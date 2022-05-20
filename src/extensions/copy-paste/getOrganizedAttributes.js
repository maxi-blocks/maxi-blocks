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

										attrArray = [prop];

										if (type === 'withBreakpoint') {
											const newArray = [...attrArray];
											attrArray = [];
											newArray.forEach(prop => {
												let propArray = [prop];
												if (
													attrContent.props[prop]
														.type === 'withPalette'
												) {
													propArray = [];
													const withPalette =
														paletteAttributesCreator(
															{
																prefix: prop,
															}
														);
													propArray =
														propArray.concat(
															Object.keys(
																withPalette
															)
														);
												}
												propArray.forEach(prop => {
													const withBrkpt = [];

													breakpoints.forEach(
														breakpoint =>
															withBrkpt.push(
																`${prop}-${breakpoint}`
															)
													);
													attrArray =
														attrArray.concat(
															withBrkpt
														);
												});
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
			[('withPrefix', 'withoutPrefix')].forEach(type => {
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
										const resp = getGroupAttributes(
											attributes,
											prop,
											false,
											type === 'withPrefix' ? prefix : '',
											true
										);

										if (!isEmpty(resp))
											groupObj.group[prop] = {
												label,
												attribute: resp,
											};
									}
								);
								if (!isEmpty(groupObj.group))
									response[tab][attrType] = groupObj;
							} else if (typeof attrContent === 'string') {
								const resp = getGroupAttributes(
									attributes,
									attrType,
									false,
									type === 'withPrefix' ? prefix : '',
									true
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

		response[tab] = orderAlphabetically(response[tab], 'label');
	});

	return response;
};

const orderAlphabetically = (obj, property) => {
	if (isEmpty(obj)) return {};

	const orderedKeys = Object.keys(obj).sort((a, b) =>
		obj[a][property].localeCompare(obj[b][property])
	);
	const response = {};
	orderedKeys.forEach(key => {
		response[key] = obj[key];
	});

	return response;
};
export default getOrganizedAttributes;
