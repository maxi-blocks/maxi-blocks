/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalSetFormatWithClass from './setFormatWithClass';

/**
 *
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
	} = __experimentalSetFormatWithClass({
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
