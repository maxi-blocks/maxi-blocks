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
}) => {
	const [newStart, newEnd] = getFormatPosition({
		formatValue,
		formatName: 'maxi-blocks/text-link',
		formatClassName: null,
		formatAttributes: attributes,
	}) || [0, formatValue.formats.length];

	const removedLinkFormatValue = removeFormat(
		{ ...formatValue, start: newStart, end: newEnd + 1 },
		'maxi-blocks/text-link'
	);

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
