/**
 * Internal dependencies
 */
import { getGroupAttributes, paletteAttributesCreator } from '../styles';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getOrganizedAttributes = (attributes, copyPasteMapping, prefix) => {
	const response = {};
	const settingTabs = ['settings', 'canvas', 'advanced'];

	settingTabs.forEach(tab => {
		if (copyPasteMapping[tab]) {
			response[tab] = {};

			['blockSpecific', 'withBreakpoint', 'withPalette'].forEach(type => {
				if (copyPasteMapping[tab][type])
					Object.entries(copyPasteMapping[tab][type]).forEach(
						([attrType, attrContent]) => {
							if (
								typeof attrContent === 'object' &&
								attrContent.groupLabel
							) {
								const groupObj = {
									label: attrContent.groupLabel,
									group: {},
								};

								Object.entries(attrContent.props).forEach(
									([prop, label]) => {
										let attrArray = [];
										if (typeof label === 'string')
											attrArray = [prop];
										else if (label.props) {
											attrArray = label.props;
										} else if (
											attrContent.props[prop].type ===
											'withPalette'
										) {
											const withPalette =
												paletteAttributesCreator({
													prefix: prop,
												});
											attrArray =
												Object.keys(withPalette);
										} else if (
											attrContent.props[prop].type ===
											'withPaletteHover'
										) {
											const withPaletteHover =
												paletteAttributesCreator({
													prefix: prop.replace(
														'hover',
														''
													),
												});
											attrArray = Object.keys(
												withPaletteHover
											).map(prop => `${prop}-hover`);
										} else if (
											attrContent.props[prop].type ===
											'withBreakpoint'
										) {
											const withBrkpt = [];

											breakpoints.forEach(breakpoint =>
												withBrkpt.push(
													`${prop}-${breakpoint}`
												)
											);
											attrArray = withBrkpt;
										} else if (
											attrContent.props[prop].type ===
												'withoutPrefix' ||
											attrContent.props[prop].type ===
												'withPrefix'
										) {
											attrArray = Object.keys(
												getGroupAttributes(
													attributes,
													prop,
													false,
													attrContent.props[prop]
														.type === 'withPrefix'
														? prefix
														: ''
												)
											);
										}

										if (type === 'withBreakpoint') {
											const newArray = [...attrArray];
											attrArray = [];
											newArray.forEach(prop => {
												const withBrkpt = [];

												breakpoints.forEach(
													breakpoint =>
														withBrkpt.push(
															`${prop}-${breakpoint}`
														)
												);
												attrArray =
													attrArray.concat(withBrkpt);
											});
										}

										if (type === 'withPalette') {
											const newArray = [...attrArray];
											attrArray = [];
											newArray.forEach(a => {
												const withPalette =
													paletteAttributesCreator({
														prefix: a,
													});
												attrArray = attrArray.concat(
													Object.keys(withPalette)
												);
											});
										}

										const resp = {};

										attrArray.forEach(attr => {
											if (
												(typeof attributes[attr] !==
													'object' &&
													!isNil(attributes[attr])) ||
												!isEmpty(attributes[attr])
											)
												resp[attr] = attributes[attr];
										});

										if (!isEmpty(resp))
											groupObj.group[prop] = {
												label:
													typeof label === 'string'
														? label
														: label.label,
												attribute: resp,
											};
									}
								);
								if (!isEmpty(groupObj.group))
									response[tab][attrType] = groupObj;
							} else {
								let attrArray = [];

								if (
									typeof attrContent === 'object' &&
									attrContent.value
								)
									attrArray = [...attrContent.value];
								else attrArray = [attrType];

								if (type === 'withBreakpoint') {
									const newArray = [...attrArray];
									attrArray = [];
									newArray.forEach(a => {
										const withBrkpt = [];

										breakpoints.forEach(breakpoint =>
											withBrkpt.push(`${a}-${breakpoint}`)
										);
										attrArray = attrArray.concat(withBrkpt);
									});
								}

								if (type === 'withPalette') {
									const newArray = [...attrArray];
									attrArray = [];
									newArray.forEach(a => {
										const withPalette =
											paletteAttributesCreator({
												prefix: a,
											});
										attrArray = attrArray.concat(
											Object.keys(withPalette)
										);
									});
								}
								const resp = {};
								attrArray.forEach(attr => {
									if (
										(typeof attributes[attr] !== 'object' &&
											!isNil(attributes[attr])) ||
										!isEmpty(attributes[attr])
									)
										resp[attr] = attributes[attr];
								});
								if (!isEmpty(resp))
									response[tab][attrType] = {
										label:
											typeof attrContent === 'string'
												? attrContent
												: attrContent.label,
										attribute: resp,
									};
							}
						}
					);
			});
			['withPrefix', 'withoutPrefix'].forEach(type => {
				if (copyPasteMapping[tab][type])
					Object.entries(copyPasteMapping[tab][type]).forEach(
						([attrType, attrContent]) => {
							if (
								typeof attrContent === 'object' &&
								attrContent.groupLabel
							) {
								const groupObj = {
									label: attrContent.groupLabel,
									group: {},
								};
								Object.entries(attrContent.props).forEach(
									([prop, label]) => {
										let propArray = [];
										if (typeof label === 'string')
											propArray = [prop];
										else propArray = label.props;
										const resp = getGroupAttributes(
											attributes,
											propArray,
											false,
											type === 'withPrefix' ? prefix : ''
										);

										if (!isEmpty(resp))
											groupObj.group[prop] = {
												label:
													typeof label === 'string'
														? label
														: label.label,
												attribute: resp,
											};
									}
								);
								if (!isEmpty(groupObj.group))
									response[tab][attrType] = groupObj;
							} else if (
								typeof attrContent === 'object' &&
								attrContent.value
							) {
								const resp = getGroupAttributes(
									attributes,
									attrContent.value,
									false,
									type === 'withPrefix' ? prefix : ''
								);

								if (!isEmpty(resp))
									response[tab][attrType] = {
										label: attrContent.label,
										attribute: resp,
									};
							} else if (typeof attrContent === 'string') {
								const resp = getGroupAttributes(
									attributes,
									attrType,
									false,
									type === 'withPrefix' ? prefix : ''
								);

								if (!isEmpty(resp))
									response[tab][attrType] = {
										label: attrContent,
										attribute: resp,
									};
							}
						}
					);
			});
		}

		response[tab] = orderAlphabetically(
			response[tab],
			'label',
			copyPasteMapping,
			tab
		);
	});

	return response;
};

const orderAlphabetically = (obj, property, copyPasteMapping, tab) => {
	if (isEmpty(obj)) return {};
	let orderedKeys;

	if (tab === 'settings') {
		const { _order } = copyPasteMapping;

		orderedKeys = Object.keys(obj).sort(
			(a, b) =>
				_order.indexOf(obj[a][property]) -
				_order.indexOf(obj[b][property])
		);
	} else if (tab === 'canvas') {
		const _order = [
			'Background',
			'Border',
			'Box shadow',
			'Opacity',
			'Size',
			'Margin/Padding',
		];

		orderedKeys = Object.keys(obj).sort(
			(a, b) =>
				_order.indexOf(obj[a][property]) -
				_order.indexOf(obj[b][property])
		);
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

		orderedKeys = Object.keys(obj).sort(
			(a, b) =>
				_order.indexOf(obj[a][property]) -
				_order.indexOf(obj[b][property])
		);
	}

	const response = {};
	orderedKeys.forEach(key => {
		response[key] = obj[key];
	});
	return response;
};

export default getOrganizedAttributes;
