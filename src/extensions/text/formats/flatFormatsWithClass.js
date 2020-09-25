const { toHTMLString, removeFormat } = wp.richText;

import defaultCustomFormat from './custom/default';
import getMultiFormatObj from './getMultiFormatObj';

import { isEqual, compact, uniq, flattenDeep, find } from 'lodash';

const getRepeatedClassNames = (customFormats, formatValue) => {
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

const flatRepeatedClassNames = (repeatedClasses, formatValue, typography) => {
	const newClassName = repeatedClasses[0];
	repeatedClasses.shift();

	const newFormatValue = { ...formatValue };
	const newTypography = { ...typography };

	newFormatValue.formats = newFormatValue.formats.map(formatEl => {
		return formatEl.map(format => {
			if (repeatedClasses.includes(format.attributes.className))
				format.attributes.className = newClassName;

			return format;
		});
	});

	repeatedClasses.forEach(className => {
		delete newTypography.customFormats[className];
	});

	return {
		formatValue: newFormatValue,
		typography: newTypography,
	};
};

const removeUnnecessaryFormats = ({
	formatValue,
	typography,
	content,
	isList,
	isHover,
}) => {
	const multiFormatObj = getMultiFormatObj({
		...formatValue,
		start: 0,
		end: formatValue.formats.length,
	});
	const { customFormats } = typography;
	let newFormatValue = { ...formatValue };
	let newContent = content;

	const someRemoved =
		compact(
			Object.entries(customFormats).map(([target, style]) => {
				// const targetName = `${target}${isHover ? ':hover' : ''}`;
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
					delete typography.customFormats[target];
				}
				// Same style than default
				if (
					isEqual(
						JSON.stringify(style),
						JSON.stringify(defaultCustomFormat)
					)
				) {
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

					delete typography.customFormats[target];

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
			multilineTag: (isList && 'li') || null,
		});

	return {
		typography,
		formatValue: newFormatValue,
		content: newContent,
	};
};

const flatFormatsWithClass = ({
	typography,
	formatValue,
	content,
	isList,
	isHover,
}) => {
	const { customFormats } = typography;
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
			value: newFormatValue,
			multilineTag: (isList && 'li') || null,
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
		isHover,
	});

	return {
		formatValue: cleanedFormatValue,
		typography: cleanedTypography,
		content: cleanedContent,
	};
};

export default flatFormatsWithClass;
