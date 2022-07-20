/**
 * Internal dependencies
 */
import getPrefix from './getPrefix';
import { getGroupAttributes, paletteAttributesCreator } from '../styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
													getPrefix(
														attrContent.props[prop]
															.type,
														attrContent.prefix,
														prefix
													)
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
											resp[attr] = attributes[attr];
										});

										groupObj.group[prop] = {
											label:
												typeof label === 'string'
													? label
													: label.label,
											attribute: resp,
										};
									}
								);

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
									resp[attr] = attributes[attr];
								});

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
											getPrefix(
												type,
												attrContent.prefix,
												prefix
											)
										);

										groupObj.group[prop] = {
											label:
												typeof label === 'string'
													? label
													: label.label,
											attribute: resp,
										};
									}
								);

								response[tab][attrType] = groupObj;
							} else if (
								typeof attrContent === 'object' &&
								attrContent.value
							) {
								const resp = getGroupAttributes(
									attributes,
									attrContent.value,
									false,
									getPrefix(type, attrContent.prefix, prefix)
								);

								response[tab][attrType] = {
									label: attrContent.label,
									attribute: resp,
								};
							} else if (typeof attrContent === 'string') {
								const resp = getGroupAttributes(
									attributes,
									attrType,
									false,
									getPrefix(type, attrContent.prefix, prefix)
								);

								response[tab][attrType] = {
									label: attrContent,
									attribute: resp,
								};
							}
						}
					);
			});
		}

		response[tab] = orderAttributes(
			response[tab],
			'label',
			copyPasteMapping,
			tab
		);
	});

	return response;
};

export default getOrganizedAttributes;
