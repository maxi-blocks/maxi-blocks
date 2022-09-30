/**
 * External dependencies
 */
import { isFunction } from 'lodash';

const getHoverStatus = (hoverProp, blockAttributes, relationAttributes) =>
	isFunction(hoverProp)
		? hoverProp(blockAttributes, relationAttributes)
		: blockAttributes[hoverProp];

export default getHoverStatus;
