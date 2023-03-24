/**
 * Internal dependencies
 */
import { getAttributesValue } from '../attributes';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';

const getHoverStatus = (hoverProp, blockAttributes, relationAttributes) =>
	isFunction(hoverProp)
		? hoverProp(blockAttributes, relationAttributes)
		: getAttributesValue({
				target: hoverProp,
				props: blockAttributes,
		  });

export default getHoverStatus;
