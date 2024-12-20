/* eslint-disable babylonjs/available */
/* eslint-disable jsdoc/require-jsdoc */
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as WebGPUConstants from "./webgpuConstants.js";

const filterToBits = [
    0 | (0 << 1) | (0 << 2),
    0 | (0 << 1) | (0 << 2),
    1 | (1 << 1) | (0 << 2),
    1 | (1 << 1) | (1 << 2),
    0 | (0 << 1) | (0 << 2),
    0 | (1 << 1) | (0 << 2),
    0 | (1 << 1) | (1 << 2),
    0 | (1 << 1) | (0 << 2),
    0 | (0 << 1) | (1 << 2),
    1 | (0 << 1) | (0 << 2),
    1 | (0 << 1) | (1 << 2),
    1 | (1 << 1) | (0 << 2),
    1 | (0 << 1) | (0 << 2), // TEXTURE_LINEAR_NEAREST
];
// subtract 0x01FF from the comparison function value before indexing this array!
const comparisonFunctionToBits = [
    (0 << 3) | (0 << 4) | (0 << 5) | (0 << 6),
    (0 << 3) | (0 << 4) | (0 << 5) | (1 << 6),
    (0 << 3) | (0 << 4) | (1 << 5) | (0 << 6),
    (0 << 3) | (0 << 4) | (1 << 5) | (1 << 6),
    (0 << 3) | (1 << 4) | (0 << 5) | (0 << 6),
    (0 << 3) | (1 << 4) | (0 << 5) | (1 << 6),
    (0 << 3) | (1 << 4) | (1 << 5) | (0 << 6),
    (0 << 3) | (1 << 4) | (1 << 5) | (1 << 6),
    (1 << 3) | (0 << 4) | (0 << 5) | (0 << 6), // ALWAYS
];
const filterNoMipToBits = [
    0 << 7,
    1 << 7,
    1 << 7,
    0 << 7,
    0 << 7,
    0 << 7,
    0 << 7,
    1 << 7,
    0 << 7,
    0 << 7,
    0 << 7,
    0 << 7,
    1 << 7, // TEXTURE_LINEAR_NEAREST
];
/** @internal */
export class WebGPUCacheSampler {
    constructor(device) {
        this._samplers = {};
        this._device = device;
        this.disabled = false;
    }
    static GetSamplerHashCode(sampler) {
        // The WebGPU spec currently only allows values 1 and 4 for anisotropy
        const anisotropy = sampler._cachedAnisotropicFilteringLevel && sampler._cachedAnisotropicFilteringLevel > 1 ? 4 : 1;
        const code = filterToBits[sampler.samplingMode] +
            comparisonFunctionToBits[(sampler._comparisonFunction || 0x0202) - 0x0200 + 1] +
            filterNoMipToBits[sampler.samplingMode] + // handle the lodMinClamp = lodMaxClamp = 0 case when no filter used for mip mapping
            ((sampler._cachedWrapU ?? 1) << 8) +
            ((sampler._cachedWrapV ?? 1) << 10) +
            ((sampler._cachedWrapR ?? 1) << 12) +
            ((sampler.useMipMaps ? 1 : 0) << 14) + // need to factor this in because _getSamplerFilterDescriptor depends on samplingMode AND useMipMaps!
            (anisotropy << 15);
        return code;
    }
    static _GetSamplerFilterDescriptor(sampler, anisotropy) {
        let magFilter, minFilter, mipmapFilter, lodMinClamp, lodMaxClamp;
        const useMipMaps = sampler.useMipMaps;
        switch (sampler.samplingMode) {
            case 11:
                magFilter = WebGPUConstants.FilterMode.Linear;
                minFilter = WebGPUConstants.FilterMode.Linear;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                if (!useMipMaps) {
                    lodMinClamp = lodMaxClamp = 0;
                }
                break;
            case 3:
            case 3:
                magFilter = WebGPUConstants.FilterMode.Linear;
                minFilter = WebGPUConstants.FilterMode.Linear;
                if (!useMipMaps) {
                    mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                    lodMinClamp = lodMaxClamp = 0;
                }
                else {
                    mipmapFilter = WebGPUConstants.FilterMode.Linear;
                }
                break;
            case 8:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                if (!useMipMaps) {
                    mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                    lodMinClamp = lodMaxClamp = 0;
                }
                else {
                    mipmapFilter = WebGPUConstants.FilterMode.Linear;
                }
                break;
            case 4:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                if (!useMipMaps) {
                    lodMinClamp = lodMaxClamp = 0;
                }
                break;
            case 5:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Linear;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                if (!useMipMaps) {
                    lodMinClamp = lodMaxClamp = 0;
                }
                break;
            case 6:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Linear;
                if (!useMipMaps) {
                    mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                    lodMinClamp = lodMaxClamp = 0;
                }
                else {
                    mipmapFilter = WebGPUConstants.FilterMode.Linear;
                }
                break;
            case 7:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Linear;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                lodMinClamp = lodMaxClamp = 0;
                break;
            case 1:
            case 1:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                lodMinClamp = lodMaxClamp = 0;
                break;
            case 9:
                magFilter = WebGPUConstants.FilterMode.Linear;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                if (!useMipMaps) {
                    lodMinClamp = lodMaxClamp = 0;
                }
                break;
            case 10:
                magFilter = WebGPUConstants.FilterMode.Linear;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                if (!useMipMaps) {
                    mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                    lodMinClamp = lodMaxClamp = 0;
                }
                else {
                    mipmapFilter = WebGPUConstants.FilterMode.Linear;
                }
                break;
            case 2:
            case 2:
                magFilter = WebGPUConstants.FilterMode.Linear;
                minFilter = WebGPUConstants.FilterMode.Linear;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                lodMinClamp = lodMaxClamp = 0;
                break;
            case 12:
                magFilter = WebGPUConstants.FilterMode.Linear;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                lodMinClamp = lodMaxClamp = 0;
                break;
            default:
                magFilter = WebGPUConstants.FilterMode.Nearest;
                minFilter = WebGPUConstants.FilterMode.Nearest;
                mipmapFilter = WebGPUConstants.FilterMode.Nearest;
                lodMinClamp = lodMaxClamp = 0;
                break;
        }
        if (anisotropy > 1 && (lodMinClamp !== 0 || lodMaxClamp !== 0) && mipmapFilter !== WebGPUConstants.FilterMode.Nearest) {
            return {
                magFilter: WebGPUConstants.FilterMode.Linear,
                minFilter: WebGPUConstants.FilterMode.Linear,
                mipmapFilter: WebGPUConstants.FilterMode.Linear,
                anisotropyEnabled: true,
            };
        }
        return {
            magFilter,
            minFilter,
            mipmapFilter,
            lodMinClamp,
            lodMaxClamp,
        };
    }
    static _GetWrappingMode(mode) {
        switch (mode) {
            case 1:
                return WebGPUConstants.AddressMode.Repeat;
            case 0:
                return WebGPUConstants.AddressMode.ClampToEdge;
            case 2:
                return WebGPUConstants.AddressMode.MirrorRepeat;
        }
        return WebGPUConstants.AddressMode.Repeat;
    }
    static _GetSamplerWrappingDescriptor(sampler) {
        return {
            addressModeU: this._GetWrappingMode(sampler._cachedWrapU),
            addressModeV: this._GetWrappingMode(sampler._cachedWrapV),
            addressModeW: this._GetWrappingMode(sampler._cachedWrapR),
        };
    }
    static _GetSamplerDescriptor(sampler, label) {
        // The WebGPU spec currently only allows values 1 and 4 for anisotropy
        const anisotropy = sampler.useMipMaps && sampler._cachedAnisotropicFilteringLevel && sampler._cachedAnisotropicFilteringLevel > 1 ? 4 : 1;
        const filterDescriptor = this._GetSamplerFilterDescriptor(sampler, anisotropy);
        return {
            label,
            ...filterDescriptor,
            ...this._GetSamplerWrappingDescriptor(sampler),
            compare: sampler._comparisonFunction ? WebGPUCacheSampler.GetCompareFunction(sampler._comparisonFunction) : undefined,
            maxAnisotropy: filterDescriptor.anisotropyEnabled ? anisotropy : 1,
        };
    }
    static GetCompareFunction(compareFunction) {
        switch (compareFunction) {
            case 519:
                return WebGPUConstants.CompareFunction.Always;
            case 514:
                return WebGPUConstants.CompareFunction.Equal;
            case 516:
                return WebGPUConstants.CompareFunction.Greater;
            case 518:
                return WebGPUConstants.CompareFunction.GreaterEqual;
            case 513:
                return WebGPUConstants.CompareFunction.Less;
            case 515:
                return WebGPUConstants.CompareFunction.LessEqual;
            case 512:
                return WebGPUConstants.CompareFunction.Never;
            case 517:
                return WebGPUConstants.CompareFunction.NotEqual;
            default:
                return WebGPUConstants.CompareFunction.Less;
        }
    }
    getSampler(sampler, bypassCache = false, hash = 0, label) {
        if (this.disabled) {
            return this._device.createSampler(WebGPUCacheSampler._GetSamplerDescriptor(sampler, label));
        }
        if (bypassCache) {
            hash = 0;
        }
        else if (hash === 0) {
            hash = WebGPUCacheSampler.GetSamplerHashCode(sampler);
        }
        let gpuSampler = bypassCache ? undefined : this._samplers[hash];
        if (!gpuSampler) {
            gpuSampler = this._device.createSampler(WebGPUCacheSampler._GetSamplerDescriptor(sampler, label));
            if (!bypassCache) {
                this._samplers[hash] = gpuSampler;
            }
        }
        return gpuSampler;
    }
}
//# sourceMappingURL=webgpuCacheSampler.js.map