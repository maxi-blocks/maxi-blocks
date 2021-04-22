/**
 * WordPress dependencies
 */
import { isCollapsed } from '@wordpress/rich-text';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getFormattedString from './getFormattedString';
import getHasCustomFormat from './getHasCustomFormat';
import setFormatWithClass from './setFormatWithClass';
import flatFormatsWithClass from './flatFormatsWithClass';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 * @param {Object}	[$0.value]				Requested values to implement
 * 											on typography object
 * @param {string} 	[$0.breakpoint]			Device type breakpoint
 * @param {boolean}	[$0.isHover]			Is the requested typography under hover state
 *
 * @returns {Object} Formatted object
 */
const setFormat = ({
	formatValue,
	typography,
	isList,
	value,
	breakpoint = 'general',
	isHover = false,
	textLevel,
}) => {
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const {
		__unstableMarkLastChangeAsPersistent: markLastChangeAsPersistent,
	} = dispatch('core/block-editor');

	if (
		isNil(formatValue.start) ||
		isNil(formatValue.end || isCollapsed(formatValue))
	) {
		// eslint-disable-next-line @wordpress/no-global-get-selection, @wordpress/no-unguarded-get-range-at
		const { startOffset, endOffset } = window.getSelection().getRangeAt(0);

		formatValue.start = startOffset;
		formatValue.end = endOffset;
	}
	if (!formatValue || formatValue.start === formatValue.end) {
		const newTypography = { ...typography };
		const newFormatValue = {
			...formatValue,
			start: 0,
			end: formatValue.formats.length,
		};

		Object.entries(value).forEach(([key, val]) => {
			newTypography[
				`${key}-${breakpoint}${isHover ? '-hover' : ''}`
			] = val;
		});

		const hasCustomFormat = getHasCustomFormat(newFormatValue, isHover);

		if (hasCustomFormat) {
			const content = getFormattedString({
				formatValue: newFormatValue,
				isList,
			});

			const {
				typography: cleanedTypography,
				content: cleanedContent,
			} = flatFormatsWithClass({
				formatValue: newFormatValue,
				typography: newTypography,
				content,
				isList,
				value,
				breakpoint,
				textLevel,
				isHover,
			});

			return { ...cleanedTypography, content: cleanedContent };
		}

		// Ensures the format changes are saved as undo entity on historical records
		markLastChangeAsPersistent();

		return newTypography;
	}

	// Ensures the format changes are saved as undo entity on historical records
	markLastChangeAsPersistent();

	return setFormatWithClass({
		formatValue,
		isList,
		typography,
		value,
		breakpoint,
		isHover,
		textLevel,
	});
};

export default setFormat;
