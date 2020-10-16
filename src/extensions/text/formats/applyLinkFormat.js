/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import setFormatWithClass from './setFormatWithClass';

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
}) => {
	const linkCustomFormatValue = applyFormat(formatValue, {
		type: 'maxi-blocks/text-link',
		attributes: linkAttributes,
	});

	const {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	} = setFormatWithClass({
		formatValue: linkCustomFormatValue,
		isList,
		typography,
		value: {
			color: '#ff4a17',
			'text-decoration': 'underline',
		},
	});

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

export default applyLinkFormat;
