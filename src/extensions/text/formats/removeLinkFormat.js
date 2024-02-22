/**
 * WordPress dependencies
 */
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import getFormatPosition from './getFormatPosition';
import setFormat from './setFormat';
import getCustomFormatValue from './getCustomFormatValue';
import getFormattedString from './getFormattedString';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

/**
 * Removes the link and custom formats
 *
 * @param {Object} [$0]             Optional named arguments.
 * @param {Object} [$0.formatValue] RichText format value
 * @param {Object} [$0.typography]  MaxiBlocks typography
 * @param {Object} [$0.isList]      Text Maxi block has list mode active
 * @returns {Object} Returns cleaned and formatted typography and content
 */
const removeLinkFormat = ({
	formatValue,
	typography,
	isList,
	textLevel,
	attributes,
	blockStyle,
	styleCard,
}) => {
	const { start, end } = formatValue;
	const formatLength = formatValue.formats.length;
	let newStart = start;
	let newEnd = end;
	const [linkPositionStart, linkPositionEnd] =
		getFormatPosition({
			formatValue,
			formatName: 'maxi-blocks/text-link',
			formatClassName: null,
			formatAttributes: attributes,
		}) || [];
	if (start === end)
		[newStart, newEnd] = [linkPositionStart, linkPositionEnd] || [
			0,
			formatLength,
		];

	const removedLinkFormatValue = removeFormat(
		{
			...formatValue,
			start: newStart,
			end: newEnd,
		},
		'maxi-blocks/text-link'
	);

	// Check if the removing is a partial part of the whole content
	const isWholeContentLink = isEqual(
		[linkPositionStart, linkPositionEnd],
		[0, formatLength]
	);
	const hasUnderline =
		getCustomFormatValue({
			formatValue: { ...formatValue, start: 0, end: formatLength },
			typography,
			prop: 'text-decoration',
			breakpoint: 'general',
			blockStyle,
			textLevel,
			styleCard,
		}) === 'underline';
	const isPartialOfWholeLink =
		isWholeContentLink &&
		hasUnderline &&
		newStart !== 0 &&
		newEnd !== formatLength;
	const isLastPartialOfWholeLink =
		isWholeContentLink &&
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
						typography: { ...typography, ...cleanTypography },
						value: {
							'text-decoration': 'underline',
						},
						textLevel,
						returnFormatValue: true,
				  })
				: { formatValue: removedLinkFormatValue, ...cleanTypography };
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
						typography: {
							...typography,
							...cleanTypography,
							...firstPartTypography,
						},
						value: {
							'text-decoration': 'underline',
						},
						textLevel,
				  })
				: { ...firstPartTypography };

		return {
			...cleanTypography,
			...firstPartTypography,
			...secondPartTypography,
		};
	}

	if (
		isWholeContentLink &&
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
		formatValue: removedLinkFormatValue,
		isList,
		typography,
		value: {
			'text-decoration': '',
		},
		textLevel,
	});
};

export default removeLinkFormat;
