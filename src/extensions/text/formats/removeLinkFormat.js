/**
 * WordPress dependencies
 */
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import setFormatWithClass from './setFormatWithClass';

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
const removeLinkFormat = ({ formatValue, typography, isList, textLevel }) => {
	const removedLinkFormatValue = removeFormat(
		formatValue,
		'maxi-blocks/text-link'
	);

	const {
		typography: newTypography,
		content: newContent,
	} = setFormatWithClass({
		formatValue: removedLinkFormatValue,
		isList,
		typography,
		value: {
			color: '',
			'text-decoration': '',
		},
		textLevel,
	});

	return {
		typography: newTypography,
		content: newContent,
	};
};

export default removeLinkFormat;
