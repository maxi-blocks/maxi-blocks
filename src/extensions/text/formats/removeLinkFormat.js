/**
 * WordPress dependencies
 */
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import getFormatPosition from './getFormatPosition';
import setFormat from './setFormat';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';
import getCustomFormatValue from './getCustomFormatValue';
import getFormattedString from './getFormattedString';

/**
 * Removes the link and custom formats
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.isList]				Text Maxi block has list mode active
 *
 * @returns {Object} Returns cleaned and formatted typography and content
 */
const removeLinkFormat = ({
	formatValue,
	typography,
	isList,
	textLevel,
	attributes,
	blockStyle,
}) => {
	const { start, end } = formatValue;
	const formatLength = formatValue.formats.length;
	let newStart = start;
	let newEnd = end;
	if (start === end) {
		[newStart, newEnd] = getFormatPosition({
			formatValue,
			formatName: 'maxi-blocks/text-link',
			formatClassName: null,
			formatAttributes: attributes,
		}) || [0, formatLength];
	}

	const removedLinkFormatValue = removeFormat(
		{ ...formatValue, start: newStart, end: newEnd + 1 },
		'maxi-blocks/text-link'
	);

	// Check if the removing is a partial part of the whole content
	const isWholeLink = isEqual(
		getFormatPosition({
			formatValue,
			formatName: 'maxi-blocks/text-link',
			formatClassName: null,
			formatAttributes: attributes,
		}),
		[0, formatLength - 1]
	);
	const hasUnderline =
		getCustomFormatValue({
			formatValue: { ...formatValue, start: 0, end: formatLength },
			typography,
			prop: 'text-decoration',
			breakpoint: 'general',
			blockStyle,
			textLevel,
		}) === 'underline';
	const isPartialOfWholeLink =
		isWholeLink &&
		hasUnderline &&
		newStart !== 0 &&
		newEnd !== formatLength;
	const isLastPartialOfWholeLink =
		isWholeLink &&
		hasUnderline &&
		newStart !== 0 &&
		newStart !== formatLength &&
		newEnd === formatLength;

	if (isPartialOfWholeLink || isLastPartialOfWholeLink) {
		// Remove whole content underline
		const cleanTypography = setFormat({
			disableCustomFormats: true,
			isList,
			typography,
			value: {
				'text-decoration': '',
			},
			textLevel,
		});
		// Set first part
		const { formatValue: firstPartFormatValue, ...firstPartTypography } =
			start !== 0
				? setFormat({
						formatValue: {
							...removedLinkFormatValue,
							start: 0,
							end: start,
						},
						isList,
						typography: cleanTypography,
						value: {
							'text-decoration': 'underline',
						},
						textLevel,
						returnFormatValue: true,
				  })
				: { formatvalue: removedLinkFormatValue, ...cleanTypography };
		// Set second part
		const secondPartTypography =
			end !== formatLength
				? setFormat({
						formatValue: {
							...firstPartFormatValue,
							start: end,
							end: formatLength,
						},
						isList,
						typography: firstPartTypography,
						value: {
							'text-decoration': 'underline',
						},
						textLevel,
				  })
				: { ...firstPartTypography };

		return { ...secondPartTypography };
	}

	if (
		isWholeLink &&
		hasUnderline &&
		((newStart === 0 && newEnd === formatLength) || start === end)
	) {
		const removedLinkContent = getFormattedString({
			formatValue: removedLinkFormatValue,
			isList,
		});
		return {
			...setFormat({
				disableCustomFormats: true,
				isList,
				typography,
				value: {
					'text-decoration': '',
				},
				textLevel,
			}),
			content: removedLinkContent,
		};
	}

	return setFormat({
		formatValue: {
			...removedLinkFormatValue,
			end: removedLinkFormatValue.end - 1,
		},
		isList,
		typography,
		value: {
			'text-decoration': '',
		},
		textLevel,
	});
};

export default removeLinkFormat;
