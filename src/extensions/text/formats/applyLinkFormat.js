/**
 * WordPress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';
import { select, dispatch } from '@wordpress/data';

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
	clientId,
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

	if (saveFormatValue) {
		const blockClientId =
			clientId || select('core/block-editor').getSelectedBlockClientId();

		const newFormatValue = response.formatValue;

		// This time-out avoids to the new formatValue to be removed for the other time-out
		// on `onChangeRichText` function of text related blocks where the value is `100`
		setTimeout(() => {
			dispatch('maxiBlocks/text').sendFormatValue(
				newFormatValue,
				blockClientId
			);
		}, 150);

		if (!returnFormatValue) delete response.formatValue;
	}

	if ('content' in response) return response;

	return {
		...response,
		content: getFormattedString({ formatValue: linkCustomFormatValue }),
	};
};

export default applyLinkFormat;
