/**
 * Internal dependencies
 */
import templates from './templates';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

/**
 * External dependencies
 */
import { isArray, isEmpty, isPlainObject, isString, omit } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getTemplate = templateName => {
	const getNestedTemplates = obj => {
		let response = {};

		Object.entries(obj).forEach(([key, value]) => {
			if (key === 'template') {
				response = {
					...response,
					...templates[value],
				};
			} else if (isPlainObject(value)) {
				response[key] = getNestedTemplates(value);
			} else {
				response[key] = value;
			}
		});

		return response;
	};

	const template = templates[templateName];

	return getNestedTemplates(template);
};

const getAttrsFromConditions = (rawProps, attr, attributes, conditions) => {
	const { prefix, hasBreakpoints, isPalette, isHover } = conditions;

	const props = isString(rawProps) ? [rawProps] : rawProps;

	props.forEach(prop => {
		const key = `${prefix}${prop}`;

		let currAttrKeys = [key];

		if (isPalette) {
			currAttrKeys = currAttrKeys.flatMap(currAttrKey =>
				Object.keys(
					paletteAttributesCreator({ prefix: `${currAttrKey}-` })
				)
			);
		}

		if (hasBreakpoints) {
			currAttrKeys = currAttrKeys.flatMap(currAttrKey =>
				breakpoints.map(breakpoint => `${currAttrKey}-${breakpoint}`)
			);
		}

		if (isHover)
			currAttrKeys = currAttrKeys.map(
				currAttrKey => `${currAttrKey}-hover`
			);

		currAttrKeys.forEach(currAttrKey => {
			attr[currAttrKey] = attributes[currAttrKey];
		});
	});
};

const getOrganizedAttributes = (
	attributes,
	copyPasteMapping,
	isClean = false
) => {
	let response = {};

	const recursive = (obj, conditions, isTab) => {
		let newObj = {};

		Object.entries(obj).forEach(([key, rawValue]) => {
			if (isEmpty(rawValue) || key.startsWith('_')) return;
			let attr = {};

			if (isString(rawValue) || isArray(rawValue)) {
				getAttrsFromConditions(rawValue, attr, attributes, conditions);
			} else if (isPlainObject(rawValue)) {
				const value = rawValue.template
					? {
							...omit(rawValue, 'template'),
							...getTemplate(rawValue.template),
					  }
					: rawValue;

				const localCondition = {
					prefix: value?.prefix || conditions?.prefix || '',
					hasBreakpoints:
						value?.hasBreakpoints ||
						conditions?.hasBreakpoints ||
						false,
					isPalette:
						value?.isPalette || conditions?.isPalette || false,
					isHover: value?.isHover || conditions?.isHover || false,
				};

				const { prefix, isHover } = localCondition;

				if (!isEmpty(value.group) || isTab) {
					attr = {
						...(!isClean && { group: true }),
						...attr,
						...recursive(
							isTab ? value : value.group,
							localCondition
						),
					};
				} else {
					if (value.groupAttributes) {
						const groupAttributesNames = isString(
							value.groupAttributes
						)
							? [value.groupAttributes]
							: value.groupAttributes;

						const groupAttributes = getGroupAttributes(
							attributes,
							groupAttributesNames,
							isHover,
							prefix
						);

						Object.entries(groupAttributes).forEach(
							([name, value]) => {
								attr[name] = value;
							}
						);
					}

					if (value.props) {
						getAttrsFromConditions(
							value.props,
							attr,
							attributes,
							localCondition
						);
					}
				}
			}

			if (isClean) {
				newObj = {
					...newObj,
					...attr,
				};
			} else {
				newObj[key] = attr;
			}
		});

		return newObj;
	};

	const recursiveResponse = recursive(copyPasteMapping, false, true);

	if (isClean) {
		response = {
			...response,
			...recursiveResponse,
		};
	} else {
		response = recursiveResponse;
	}

	return response;
};

export default getOrganizedAttributes;
