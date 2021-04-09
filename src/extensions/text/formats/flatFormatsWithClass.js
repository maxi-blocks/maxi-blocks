/**
 * WordPress dependencies
 */
import { removeFormat, toHTMLString } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import getMultiFormatObj from './getMultiFormatObj';

/**
 * External dependencies
 */
import {
	isEqual,
	compact,
	uniq,
	flattenDeep,
	find,
	isEmpty,
	cloneDeep,
} from 'lodash';

/**
 * Get the classes from custom formats that shares the same
 * typography object on the Maxi typography object
 *
 * @param {Object} customFormats 	Custom formats from typography object
 * @param {Object} formatValue 		RichText format value
 *
 * @returns {Array} Repeated classNames
 */
export const getRepeatedClassNames = (customFormats, formatValue) => {
	const multiFormatObj = getMultiFormatObj({
		...formatValue,
		start: 0,
		end: formatValue.formats.length,
	});
	const repeatedClasses = [];

	Object.values(multiFormatObj).forEach(format => {
		if (!format.className) return;

		const objStyles = customFormats[format.className];

		repeatedClasses.push(
			Object.entries(customFormats).map(([target, style]) => {
				if (
					target !== format.className &&
					isEqual(JSON.stringify(objStyles), JSON.stringify(style))
				) {
					return target;
				}

				return null;
			})
		);
	});

	return compact(uniq(flattenDeep(repeatedClasses)));
};

/**
 * In case some custom format classes shares the same format, this function
 * reduces to just one class
 *
 * @param {Array} repeatedClasses 		Repeated classes
 * @param {Object} formatValue 			RichText format value
 * @param {Object} typography 			Maxi typography object
 *
 * @returns {Object} Cleaned RichText format value and Maxi typography
 */
export const flatRepeatedClassNames = (
	repeatedClasses,
	formatValue,
	typography
) => {
	const newClassName = repeatedClasses[0];
	repeatedClasses.shift();

	const newFormatValue = cloneDeep(formatValue);
	const newTypography = cloneDeep(typography);

	newFormatValue.formats = newFormatValue.formats.map(formatEl => {
		if (formatEl)
			return formatEl.map(format => {
				if (
					format.attributes &&
					repeatedClasses.includes(format.attributes.className)
				)
					format.attributes.className = newClassName;

				return format;
			});

		return formatEl;
	});

	repeatedClasses.forEach(className => {
		delete newTypography['custom-formats'][className];
	});

	return {
		formatValue: newFormatValue,
		typography: newTypography,
	};
};

/**
 * Removes custom formats when are equal to the default typography object
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.content]			Text Maxi block content
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 *
 * @returns {Object} Cleaned RichText format value, content and Maxi typography
 */
export const removeUnnecessaryFormats = ({
	formatValue,
	typography,
	content,
	isList,
}) => {
	const multiFormatObj = getMultiFormatObj({
		...formatValue,
		start: 0,
		end: formatValue.formats.length,
	});
	const { 'custom-formats': customFormats } = typography;
	let newFormatValue = { ...formatValue };
	let newContent = content;

	const someRemoved =
		compact(
			Object.entries(customFormats).map(([target, style]) => {
				const format = find(multiFormatObj, {
					className: target,
				});

				/**
				 * Exist on typography, not in content
				 * This action is working too late: after removing content,
				 * this action is not called. Is necessary to modify custom format
				 * again to make it work correctly.
				 * */
				if (!format) {
					delete typography['custom-formats'][target];
				}
				// Same style than default
				if (isEmpty(style)) {
					newFormatValue = removeFormat(
						format
							? {
									...newFormatValue,
									start: format.start,
									end: format.end,
							  }
							: newFormatValue,
						'maxi-blocks/text-custom'
					);

					delete typography['custom-formats'][target];

					return true;
				}

				return null;
			})
		).length > 0;

	if (someRemoved)
		newContent = toHTMLString({
			value: {
				...newFormatValue,
				start: formatValue.start,
				end: formatValue.end,
			},
			multilineTag: isList ? 'li' : null,
			preserveWhiteSpace: true,
		});

	return {
		formatValue: newFormatValue,
		typography,
		content: newContent,
	};
};

/**
 * Clean and flat the custom formats
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.content]			Text Maxi block content
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 *
 * @returns {Object} Cleaned RichText format value, content and Maxi typography
 */

const flatFormatsWithClass = ({ formatValue, typography, content, isList }) => {
	const { 'custom-formats': customFormats } = typography;

	const repeatedClasses = getRepeatedClassNames(customFormats, formatValue);

	let newContent = content;
	let newFormatValue = { ...formatValue };
	let newTypography = { ...typography };

	if (repeatedClasses.length > 1) {
		const {
			formatValue: preformattedFormatValue,
			typography: preformattedTypography,
		} = flatRepeatedClassNames(repeatedClasses, formatValue, typography);

		newContent = toHTMLString({
			value: preformattedFormatValue,
			multilineTag: isList ? 'li' : null,
			preserveWhiteSpace: true,
		});

		newFormatValue = preformattedFormatValue;
		newTypography = preformattedTypography;
	}

	const {
		formatValue: cleanedFormatValue,
		typography: cleanedTypography,
		content: cleanedContent,
	} = removeUnnecessaryFormats({
		formatValue: newFormatValue,
		typography: newTypography,
		content: newContent,
		isList,
	});

	return {
		formatValue: cleanedFormatValue,
		typography: cleanedTypography,
		content: cleanedContent,
	};
};

export default flatFormatsWithClass;
