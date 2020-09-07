/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { create, getActiveFormat } = wp.richText;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * @param {Object} formatElement Format object for RichText
 * @param {string} formatName Format type
 */
const getFormatSettings = (formatElement, formatName) => {
	const { getSelectionStart, getSelectionEnd } = select('core/block-editor');

	const formatValue = create(formatElement);
	formatValue.start = getSelectionStart().offset;
	formatValue.end = getSelectionEnd().offset;

	const activeFormat = getActiveFormat(formatValue, formatName);
	const isActive =
		(!isNil(activeFormat) && activeFormat.type === formatName) || false;

	return {
		formatValue,
		isActive,
	};
};

export default getFormatSettings;
