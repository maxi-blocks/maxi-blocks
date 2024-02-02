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
import { isNil, isEmpty } from 'lodash';

/**
 *
 * @param {Object}  [$0]             Optional named arguments.
 * @param {Object}  [$0.formatValue] RichText format value
 * @param {Object}  [$0.typography]  MaxiBlocks typography
 * @param {boolean} [$0.isList]      Text Maxi block has list mode active
 * @param {Object}  [$0.value]       Requested values to implement
 *                                   on typography object
 * @param {string}  [$0.breakpoint]  Device type breakpoint
 * @param {boolean} [$0.isHover]     Is the requested typography under hover state
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
	returnFormatValue = false,
	disableCustomFormats = false,
	styleCardPrefix = '',
}) => {
	const { __unstableMarkLastChangeAsPersistent: markLastChangeAsPersistent } =
		dispatch('core/block-editor');

	if (disableCustomFormats) {
		const newTypography = {};

		Object.entries(value).forEach(([key, val]) => {
			newTypography[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] =
				val;
		});
		// Ensures the format changes are saved as undo entity on historical records
		markLastChangeAsPersistent();

		return newTypography;
	}

	if (
		isNil(formatValue.start) ||
		isNil(formatValue.end) ||
		isCollapsed(formatValue)
	) {
		// eslint-disable-next-line @wordpress/no-global-get-selection, @wordpress/no-unguarded-get-range-at
		const { startOffset, endOffset } = window.getSelection().getRangeAt(0);

		formatValue.start = startOffset;
		formatValue.end = endOffset;
	}

	const formatsLength = !isEmpty(formatValue.formats)
		? formatValue.formats.length
		: 0;

	if (
		!formatValue ||
		formatValue.start === formatValue.end ||
		(formatValue.start === 0 && formatValue.end === formatsLength)
	) {
		const newTypography = {};
		const newFormatValue = {
			...formatValue,
			start: 0,
			end: formatsLength,
		};

		Object.entries(value).forEach(([key, val]) => {
			newTypography[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] =
				val;
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
				formatValue: cleanedFormatValue,
			} = flatFormatsWithClass({
				formatValue: newFormatValue,
				typography: { ...typography, ...newTypography },
				changedTypography: newTypography,
				content,
				isList,
				value,
				breakpoint,
				textLevel,
				isHover,
				styleCardPrefix,
				returnFormatValue,
			});

			return {
				...cleanedTypography,
				content: cleanedContent,
				...(returnFormatValue && {
					formatValue: {
						...cleanedFormatValue,
						start: formatValue.start,
						end: formatValue.end,
					},
				}),
			};
		}

		// Ensures the format changes are saved as undo entity on historical records
		markLastChangeAsPersistent();

		const newContent = newFormatValue.text
			? getFormattedString({
					formatValue: newFormatValue,
					isList,
			  })
			: false;

		return {
			...newTypography,
			...(newContent && { content: newContent }),
			...(returnFormatValue && {
				formatValue: {
					...newFormatValue,
					start: formatValue.start,
					end: formatValue.end,
				},
			}),
		};
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
		returnFormatValue,
		styleCardPrefix,
	});
};

export default setFormat;
