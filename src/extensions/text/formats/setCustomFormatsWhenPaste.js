/**
 * WordPress dependencies
 */
import { select } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import applyLinkFormat from './applyLinkFormat';
import setFormatWithClass from './setFormatWithClass';

/**
 * External dependencies
 */
import { isNil, chunk } from 'lodash';
import getGroupAttributes from '../../styles/getGroupAttributes';

/**
 * Check if the RichText format value is formatted with requested format
 *
 * @param {Object} formatValue 			RichText format value
 * @param {string} formatName 			RichText format type
 *
 * @returns {boolean} Is formatted with requested type
 */
const isFormattedWithType = (formatValue, formatName) => {
	return formatValue.formats.some(formatEl => {
		return formatEl.some(format => {
			return format.type === formatName;
		});
	});
};

/**
 * Check for the requested format type positions
 *
 * @param {Object} formatValue 			RichText format value
 * @param {string} formatName 			RichText format type
 *
 * @returns {Array} Array with pairs of position for start and end
 */
const getInstancePositions = (formatValue, formatName) => {
	const locatedInstances = formatValue.formats.map((formatEl, i) => {
		if (
			formatEl.some(format => {
				return format.type === formatName;
			})
		)
			return i;

		return null;
	});

	const filteredLocatedInstances = locatedInstances.filter(
		(current, i, array) => {
			const prev = array[i - 1];
			const next = array[i + 1];

			return (
				(isNil(prev) && current + 1 === next) ||
				(isNil(next) && current - 1 === prev)
			);
		}
	);

	return chunk(filteredLocatedInstances, 2);
};

/**
 * Formats the link instances
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.isList]				Text Maxi block has list mode active
 *
 * @returns {Object} Formatted typography, content and RichText format
 */
const setLinkFormats = ({ formatValue, typography, isList }) => {
	const linkInstancePositions = getInstancePositions(
		formatValue,
		'core/link'
	);

	let newContent = formatValue.html;
	let newTypography = { ...typography };
	let newFormatValue = { ...formatValue };

	linkInstancePositions.forEach(pos => {
		newFormatValue = {
			...newFormatValue,
			start: pos[0],
			end: pos[1] + 1,
		};

		const newAttributes = newFormatValue.formats[pos[0]].filter(format => {
			return format.type === 'core/link';
		})[0].attributes;
		newFormatValue = removeFormat(newFormatValue, 'core/link');

		const linkObj = applyLinkFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			linkAttributes: newAttributes,
			isList,
		});

		newTypography = getGroupAttributes(linkObj, 'typography');
		newContent = linkObj.content;
		newFormatValue = linkObj.formatValue;
	});

	return {
		...newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

/**
 * Replace core formats for Maxi Custom format
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {string} 	[$0.oldFormat]			Core format to remove
 * @param {Object}	[$0.value]				Requested values to implement
 * 											on typography object
 * @param {Object} 	[$0.isList]				Text Maxi block has list mode active
 *
 * @returns {Object} Formatted typography, content and RichText format
 */
const setFormat = ({ formatValue, typography, oldFormat, value, isList }) => {
	const instancePositions = getInstancePositions(formatValue, oldFormat);

	let newContent = formatValue.html;
	let newTypography = { ...typography };
	let newFormatValue = { ...formatValue };

	instancePositions.forEach(pos => {
		newFormatValue = {
			...newFormatValue,
			start: pos[0],
			end: pos[1] + 1,
		};

		newFormatValue = removeFormat(newFormatValue, oldFormat);

		const obj = setFormatWithClass({
			formatValue: newFormatValue,
			typography: newTypography,
			value,
			isList,
		});

		newTypography = getGroupAttributes(obj, 'typography');
		newContent = obj.content;
		newFormatValue = obj.formatValue;
	});

	return {
		...newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

/**
 * Ensures organized/unorganized list content
 *
 * @param {string} content 				Text Maxi content
 * @param {boolean} isList 				Text Maxi block has list mode active
 * @param {string} typeOfList 			Text Maxi block list type
 *
 * @returns {string} New formatted content
 */
const cleanListContent = (content, isList, typeOfList) => {
	if (isList && typeOfList === 'ol')
		return content.replace(/<ul>/gi, '<ol>').replace(/<\/ul>/gi, '</ol>');
	if (isList && typeOfList === 'ul')
		return content.replace(/<ol>/gi, '<ul>').replace(/<\/ol>/gi, '</ul>');

	return content;
};

/**
 * Check and transform core formats to Maxi formats after pasting content
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.isList]				Text Maxi block has list mode active
 * @param {string} 	[$0.typeOfList]			Text Maxi block list type
 * @param {string} 	[$0.content]			Text Maxi content
 *
 * @returns {Object} Formatted typography, content and RichText format
 */
const setCustomFormatsWhenPaste = ({
	formatValue,
	typography,
	isList,
	typeOfList,
	content,
}) => {
	const isLinkUnformatted = isFormattedWithType(formatValue, 'core/link');
	const isBoldUnformatted = isFormattedWithType(formatValue, 'core/bold');
	const isItalicUnformatted = isFormattedWithType(formatValue, 'core/italic');
	const isUnderlineUnformatted = isFormattedWithType(
		formatValue,
		'core/underline'
	);
	const isStrikethroughUnformatted = isFormattedWithType(
		formatValue,
		'core/strikethrough'
	);
	const isSubscriptUnformatted = isFormattedWithType(
		formatValue,
		'core/subscript'
	);
	const isSuperscriptUnformatted = isFormattedWithType(
		formatValue,
		'core/superscript'
	);

	let newTypography = { ...typography };
	let newContent = '';
	let newFormatValue = { ...formatValue };

	if (isLinkUnformatted) {
		const linkObj = setLinkFormats({
			formatValue: newFormatValue,
			typography: newTypography,
			isList,
		});

		newTypography = getGroupAttributes(linkObj, 'typography');
		newContent = linkObj.content;
		newFormatValue = linkObj.formatValue;
	}
	if (isBoldUnformatted) {
		const boldObj = setFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			oldFormat: 'core/bold',
			value: { 'font-weight': 800 },
			isList,
		});

		newTypography = getGroupAttributes(boldObj, 'typography');
		newContent = boldObj.content;
		newFormatValue = boldObj.formatValue;
	}
	if (isItalicUnformatted) {
		const italicObj = setFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			oldFormat: 'core/italic',
			value: { 'font-style': 'italic' },
			isList,
		});

		newTypography = getGroupAttributes(italicObj, 'typography');
		newContent = italicObj.content;
		newFormatValue = italicObj.formatValue;
	}
	if (isUnderlineUnformatted) {
		const underlineObj = setFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			oldFormat: 'core/underline',
			value: { 'font-decoration': 'underline' },
			isList,
		});

		newTypography = getGroupAttributes(underlineObj, 'typography');
		newContent = underlineObj.content;
		newFormatValue = underlineObj.formatValue;
	}
	if (isStrikethroughUnformatted) {
		const strikethoughObj = setFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			oldFormat: 'core/strikethrough',
			value: { 'font-decoration': 'strikethrough' },
			isList,
		});

		newTypography = getGroupAttributes(strikethoughObj, 'typography');
		newContent = strikethoughObj.content;
		newFormatValue = strikethoughObj.formatValue;
	}
	if (isSubscriptUnformatted) {
		const subscriptObj = setFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			oldFormat: 'core/subscript',
			value: { 'vertical-align': 'sub' },
			isList,
		});

		newTypography = getGroupAttributes(subscriptObj, 'typography');
		newContent = subscriptObj.content;
		newFormatValue = subscriptObj.formatValue;
	}
	if (isSuperscriptUnformatted) {
		const superscriptObj = setFormat({
			formatValue: newFormatValue,
			typography: newTypography,
			oldFormat: 'core/superscript',
			value: { 'vertical-align': 'super' },
			isList,
		});

		newTypography = getGroupAttributes(superscriptObj, 'typography');
		newContent = superscriptObj.content;
		newFormatValue = superscriptObj.formatValue;
	}

	newContent = cleanListContent(newContent || content, isList, typeOfList);

	if (newContent) {
		return {
			...newTypography,
			content: newContent,
			formatValue: newFormatValue,
		};
	}

	return false;
};

export default setCustomFormatsWhenPaste;
