
const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');

// https://www.iana.org/assignments/media-types/media-types.xhtml
export const MME = {
	gltfBinary: 'model/gltf-binary',
	gltfJson: 'model/gltf+json',
	json : 'application/json',
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob

export default function downloadFile(fileName, data, type) {
	const url = window.URL || window.webkitURL || window;
	const blob = new Blob([ data ], { type });

	saveLink.href = url.createObjectURL(blob);
	// 设置 download 属性
	saveLink.download = fileName;
	saveLink.click();
}
