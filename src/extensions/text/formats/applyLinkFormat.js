/**
 * WordPress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';
import setFormat from './setFormat';

/**
 * Generates formats for links
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.linkAttributes]		Link properties based on Maxi Link format
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 *
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
}) => {
	const linkCustomFormatValue = applyFormat(formatValue, {
		type: 'maxi-blocks/text-link',
		attributes: linkAttributes,
	});

	return setFormat({
		formatValue: linkCustomFormatValue,
		typography,
		isList,
		value: {
			'text-decoration': 'underline',
		},
		breakpoint,
		isHover,
		textLevel,
		returnFormatValue,
	});
};

export default applyLinkFormat;
