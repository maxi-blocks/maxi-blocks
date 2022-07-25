/**
 * Internal dependencies
 */
import templates from './templates';
import { getGroupAttributes, paletteAttributesCreator } from '../styles';

/**
 * External dependencies
 */
import { isEmpty, isObject, isPlainObject, isString } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getOrganizedAttributes = (
	attributes,
	copyPasteMapping,
	isClean = false
) => {
	let response = {};

	Object.entries(copyPasteMapping).forEach(([tab, obj]) => {
		if (isEmpty(obj) || tab.startsWith('_')) return;

		const recursive = (obj, conditions) => {
			let newObj = {};

			Object.entries(obj).forEach(([key, rawValue]) => {
				if (isEmpty(rawValue)) return;
				let attr = {};

				if (isString(rawValue)) {
					// TODO: conditions support
					attr[rawValue] = attributes[rawValue];
				} else if (isObject(rawValue)) {
					const value = rawValue.template
						? {
								...rawValue,
								...templates[rawValue.template],
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

					const { prefix, hasBreakpoints, isPalette, isHover } =
						localCondition;

					if (
						Object.values(value).some(value => isPlainObject(value))
					) {
						attr = {
							...(!isClean && { group: true }),
							...attr,
							...recursive(value, localCondition),
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
							const props = isString(value.props)
								? [value.props]
								: value.props;

							props.forEach(prop => {
								const key = `${prefix}${prop}`;

								let currAttrKeys = [key];

								if (isPalette) {
									currAttrKeys = currAttrKeys.flatMap(
										currAttrKey =>
											Object.keys(
												paletteAttributesCreator(
													currAttrKey
												)
											)
									);
								}

								if (hasBreakpoints) {
									currAttrKeys = currAttrKeys.flatMap(
										currAttrKey =>
											breakpoints.map(
												breakpoint =>
													`${currAttrKey}-${breakpoint}`
											)
									);
								}

								if (isHover)
									currAttrKeys = currAttrKeys.map(
										currAttrKey => `${currAttrKey}-hover`
									);

								currAttrKeys.forEach(currAttrKey => {
									attr[currAttrKey] = attributes[key];
								});
							});
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

		const recursiveResponse = recursive(obj);

		if (isClean) {
			response = {
				...response,
				...recursiveResponse,
			};
		} else {
			response[tab] = recursiveResponse;
		}
	});

	// 	response[tab] = orderAttributes(
	// 		response[tab],
	// 		'label',
	// 		copyPasteMapping,
	// 		tab
	// 	);
	// });

	return response;
};

export default getOrganizedAttributes;
