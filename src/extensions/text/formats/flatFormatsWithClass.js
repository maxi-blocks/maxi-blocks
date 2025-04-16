/**
 * WordPress dependencies
 */
import { removeFormat, toHTMLString } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import getMultiFormatObj from './getMultiFormatObj';
import { styleObjectManipulator } from './updateCustomFormatStyle';
import getIsFullFormat from './getIsFullFormat';

/**
 * External dependencies
 */
import { isEqual, compact, uniq, flattenDeep, find, isEmpty } from 'lodash';

/**
 * Get the classes from custom formats that shares the same
 * typography object on the Maxi typography object
 *
 * @param {Object} customFormats Custom formats from typography object
 * @param {Object} formatValue   RichText format value
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

		if (!customFormats?.[format.className]) {
			// This is an exceptional case: when the format is set but the customFormat attribute
			// doesn't contain that specific format.
			repeatedClasses.push(format.className);
			customFormats[format.className] = {}; // sets an empty object to be deleted after
		} else {
			const objStyles = customFormats[format.className];

			repeatedClasses.push(
				Object.entries(customFormats).map(([target, style]) => {
					if (
						target !== format.className &&
						isEqual(
							JSON.stringify(objStyles),
							JSON.stringify(style)
						)
					) {
						return target;
					}

					return null;
				})
			);
		}
	});

	return compact(uniq(flattenDeep(repeatedClasses)));
};

/**
 * In case some custom format classes shares the same format, this function
 * reduces to just one class
 *
 * @param {Array}  repeatedClasses Repeated classes
 * @param {Object} formatValue     RichText format value
 * @param {Object} typography      Maxi typography object
 *
 * @returns {Object} Cleaned RichText format value and Maxi typography
 */
export const flatRepeatedClassNames = (
	repeatedClasses,
	formatValue,
	newTypography,
	isHover
) => {
	const newClassName = repeatedClasses[0];
	repeatedClasses.shift();

	const newFormatValue = { ...formatValue };

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
		delete newTypography[`custom-formats${isHover ? '-hover' : ''}`][
			className
		];
	});

	return {
		formatValue: newFormatValue,
		typography: newTypography,
	};
};

/**
 * Removes custom formats when are equal to the default typography object
 *
 * @param {Object}  [$0]             Optional named arguments.
 * @param {Object}  [$0.formatValue] RichText format value
 * @param {Object}  [$0.typography]  MaxiBlocks typography
 * @param {Object}  [$0.content]     Text Maxi block content
 * @param {boolean} [$0.isList]      Text Maxi block has list mode active
 *
 * @returns {Object} Cleaned RichText format value, content and Maxi typography
 */
export const removeUnnecessaryFormats = ({
	formatValue,
	typography,
	changedTypography,
	content,
	isList,
	value,
	breakpoint,
	textLevel,
	isHover,
	styleCardPrefix,
	styleCard,
}) => {
	const multiFormatObj = getMultiFormatObj(
		{
			...formatValue,
			start: 0,
			end: formatValue.formats.length,
		},
		isHover
	);
	const { [`custom-formats${isHover ? '-hover' : ''}`]: customFormats } = {
		...typography,
		...changedTypography,
	};
	let newFormatValue = { ...formatValue };
	let newContent = content;

	const someRemoved =
		compact(
			Object.entries(customFormats).map(([target, style]) => {
				const format = find(multiFormatObj, {
					className: target,
				});
				const cleanedStyle = styleObjectManipulator({
					typography,
					value,
					breakpoint,
					currentStyle: style,
					textLevel,
					styleCardPrefix,
					styleCard,
				});
				const isFullFormat = getIsFullFormat(formatValue, target);

				// Exist on typography, not in content
				if (!format) {
					delete changedTypography[
						`custom-formats${isHover ? '-hover' : ''}`
					][target];
				}
				// Style is empty
				if (isFullFormat && isEmpty(cleanedStyle)) {
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

					delete changedTypography[
						`custom-formats${isHover ? '-hover' : ''}`
					][target];

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
			preserveWhiteSpace: false,
		});

	return {
		formatValue: newFormatValue,
		typography: {
			...typography,
			...changedTypography,
		},
		content: newContent,
	};
};

/**
 * Clean and flat the custom formats
 *
 * @param {Object}  [$0]             Optional named arguments.
 * @param {Object}  [$0.formatValue] RichText format value
 * @param {Object}  [$0.typography]  MaxiBlocks typography
 * @param {Object}  [$0.content]     Text Maxi block content
 * @param {boolean} [$0.isList]      Text Maxi block has list mode active
 *
 * @returns {Object} Cleaned RichText format value, content and Maxi typography
 */

const flatFormatsWithClass = ({
	formatValue,
	typography,
	changedTypography,
	content,
	isList,
	value,
	textLevel,
	breakpoint,
	returnFormatValue = false,
	isHover = false,
	styleCardPrefix = '',
	styleCard,
}) => {
	const { [`custom-formats${isHover ? '-hover' : ''}`]: customFormats } =
		typography;

	let newContent = content;
	let newFormatValue = { ...formatValue };
	let newTypography = {
		...changedTypography,
		[`custom-formats${isHover ? '-hover' : ''}`]: customFormats,
	};

	if (customFormats) {
		const repeatedClasses = getRepeatedClassNames(
			customFormats,
			formatValue
		);

		if (repeatedClasses.length >= 1) {
			const {
				formatValue: preformattedFormatValue,
				typography: preformattedTypography,
			} = flatRepeatedClassNames(
				repeatedClasses,
				formatValue,
				newTypography,
				isHover
			);

			newContent = toHTMLString({
				value: preformattedFormatValue,
				multilineTag: isList ? 'li' : null,
				preserveWhiteSpace: false,
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
			typography,
			changedTypography: newTypography,
			content: newContent,
			isList,
			value,
			breakpoint,
			textLevel,
			isHover,
			styleCardPrefix,
			styleCard,
		});

		return {
			typography: cleanedTypography,
			content: cleanedContent,
			...(returnFormatValue && {
				formatValue: cleanedFormatValue,
			}),
		};
	}

	// Remove all formats
	newFormatValue = removeFormat(
		newFormatValue,
		`maxi-blocks/text-custom${isHover ? '-hover' : ''}`,
		0,
		newFormatValue.formats.length
	);

	newContent = toHTMLString({
		value: newFormatValue,
		multilineTag: isList ? 'li' : null,
		preserveWhiteSpace: false,
	});

	return {
		typography: newTypography,
		content: newContent,
		...(returnFormatValue && {
			formatValue: newFormatValue,
		}),
	};
};

export default flatFormatsWithClass;
