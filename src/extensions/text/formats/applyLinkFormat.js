/**
 * WordPress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import getFormattedString from './getFormattedString';
import setFormat from './setFormat';

/**
 * Generates formats for links
 *
 * @param {Object}  [$0]                Optional named arguments.
 * @param {Object}  [$0.formatValue]    RichText format value
 * @param {Object}  [$0.typography]     MaxiBlocks typography
 * @param {Object}  [$0.linkAttributes] Link properties based on Maxi Link format
 * @param {boolean} [$0.isList]         Text Maxi block has list mode active
 * @returns {Object} Link customized typography, RichText format value and content
 */
const applyLinkFormat = ({
	formatValue,
	typography,
	linkAttributes = {},
	isList,
	textLevel,
	breakpoint = 'general',
	isHover = false,
	returnFormatValue = false,
	saveFormatValue = false,
	onChangeTextFormat,
}) => {
	const linkCustomFormatValue = applyFormat(formatValue, {
		type: 'maxi-blocks/text-link',
		attributes: linkAttributes,
	});

	const response = setFormat({
		formatValue: linkCustomFormatValue,
		typography,
		isList,
		value: {
			'text-decoration': 'underline',
		},
		breakpoint,
		isHover,
		textLevel,
		returnFormatValue: returnFormatValue || saveFormatValue,
	});

	if (saveFormatValue && onChangeTextFormat) {
		onChangeTextFormat(response.formatValue);

		if (!returnFormatValue) delete response.formatValue;
	}

	if ('content' in response) return response;

	return {
		...response,
		content: getFormattedString({ formatValue: linkCustomFormatValue }),
	};
};

export default applyLinkFormat;
