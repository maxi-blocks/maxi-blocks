/**
 * WordPress dependencies
 */
const { removeFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalSetFormatWithClass from './setFormatWithClass';

/**
 * Content
 */
const removeLinkFormatValue = formatValue => {
	return removeFormat(formatValue, 'maxi-blocks/text-link');
};

const removeLinkFormat = ({ formatValue, isList, typography }) => {
	const removedLinkFormatValue = removeLinkFormatValue(formatValue);

	const {
		typography: newTypography,
		content: newContent,
	} = __experimentalSetFormatWithClass({
		formatValue: removedLinkFormatValue,
		isList,
		typography,
		value: {
			color: '',
			'text-decoration': '',
		},
	});

	return {
		typography: newTypography,
		content: newContent,
	};
};

export default removeLinkFormat;
