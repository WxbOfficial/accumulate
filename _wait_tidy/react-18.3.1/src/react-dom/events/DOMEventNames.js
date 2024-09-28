/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import getVendorPrefixedEventName from './getVendorPrefixedEventName.js';


export const ANIMATION_END = getVendorPrefixedEventName(
  'animationend',
);
export const ANIMATION_ITERATION = getVendorPrefixedEventName(
  'animationiteration',
);
export const ANIMATION_START = getVendorPrefixedEventName(
  'animationstart',
);
export const TRANSITION_END = getVendorPrefixedEventName(
  'transitionend',
);
