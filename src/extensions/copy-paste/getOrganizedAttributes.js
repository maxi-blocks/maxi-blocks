/**
 * Internal dependencies
 */
import templates from './templates';
import { getGroupAttributes, paletteAttributesCreator } from '../styles';

/**
 * External dependencies
 */
import { isEmpty, isObject, isString } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const orderAttributes = (obj, property, copyPasteMapping, tab) => {
	if (isEmpty(obj)) return {};
	let orderedKeys;

	const getOrderedKeys = order =>
		Object.keys(obj).sort(
			(a, b) =>
				order.indexOf(obj[a][property]) -
				order.indexOf(obj[b][property])
		);

	if (tab === 'settings') {
		const { _order } = copyPasteMapping;

		orderedKeys = getOrderedKeys(_order);
	} else if (tab === 'canvas') {
		const _order = [
			'Background',
			'Border',
			'Box shadow',
			'Opacity',
			'Size',
			'Margin/Padding',
		];

		orderedKeys = getOrderedKeys(_order);
	} else if (tab === 'advanced') {
		const _order = [
			'Custom CSS classes',
			'Anchor',
			'Custom CSS',
			'Scroll',
			'Transform',
			'Hyperlink hover transition',
			'Show/hide block',
			'Opacity',
			'Position',
			'Overflow',
			'Flexbox',
			'Z-index',
		];

		orderedKeys = getOrderedKeys(_order);
	}

	const response = {};
	orderedKeys.forEach(key => {
		response[key] = obj[key];
	});
	return response;
};

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
						if (isObject(value.props)) {
							attr = {
								...(!isClean && { group: true }),
								...attr,
								...recursive(value.props, localCondition),
							};
						} else {
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
