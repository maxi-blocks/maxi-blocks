/**
 * Internal dependencies
 */
import { getAttributeValue } from '../styles';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';

const getHoverStatus = (hoverProp, blockAttributes, relationAttributes) =>
	isFunction(hoverProp)
		? hoverProp(blockAttributes, relationAttributes)
		: getAttributeValue({
				target: hoverProp,
				props: blockAttributes,
		  });

export default getHoverStatus;
