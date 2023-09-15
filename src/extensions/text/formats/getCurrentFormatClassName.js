/**
 * WordPress dependencies
 */
import { getActiveFormat } from '@wordpress/rich-text';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Retrieves the current className of the 'maxi
 *
 * @param {Object}  formatValue RichText format value
 * @param {boolean} isHover     Is the requested typography under hover state
 * @returns {string} Current className for Maxi Custom format
 */
const getCurrentFormatClassName = (formatValue, isHover = false) => {
	if (!formatValue.formats || isEmpty(formatValue.formats)) return false;

	let isWholeContent = false;

	if (!isEmpty(formatValue)) {
		const { start, end } = formatValue;

		isWholeContent = start === end;
	}

	const formatOptions = getActiveFormat(
		{
			...formatValue,
			...(isWholeContent && { start: 1, end: 1 }),
		},
		!isHover ? 'maxi-blocks/text-custom' : 'maxi-blocks/text-custom-hover'
	);

	const currentClassName =
		( formatOptions?.attributes.className) || false;

	return currentClassName;
};

export default getCurrentFormatClassName;
