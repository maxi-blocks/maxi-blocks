/**
 * Internal dependencies
 */
import getPrefix from './getPrefix';
import { getGroupAttributes, paletteAttributesCreator } from '../styles';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const cleanStyleAttributes = (attributes, copyPasteMapping, prefix) => {
	let response = {};
	const settingTabs = ['settings', 'canvas', 'advanced'];

	settingTabs.forEach(tab => {
		if (copyPasteMapping[tab]) {
			['blockSpecific', 'withBreakpoint', 'withPalette'].forEach(type => {
				if (copyPasteMapping[tab][type])
					Object.entries(copyPasteMapping[tab][type]).forEach(
						([attrType, attrContent]) => {
							let attrArray = [];

							if (
								typeof attrContent === 'object' &&
								!attrContent.groupLabel
							)
								attrArray = [...attrContent.value];
							else if (
								typeof attrContent === 'object' &&
								attrContent.groupLabel
							) {
								Object.keys(attrContent.props).forEach(prop => {
									if (attrContent.props[prop].props) {
										attrArray = attrArray.concat(
											...attrContent.props[prop].props
										);
									} else if (
										attrContent.props[prop].type ===
										'withPalette'
									) {
										const withPalette =
											paletteAttributesCreator({
												prefix: prop,
											});
										attrArray = attrArray.concat(
											Object.keys(withPalette)
										);
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
										attrArray = attrArray.concat(
											Object.keys(withPaletteHover).map(
												prop => `${prop}-hover`
											)
										);
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
										attrArray = attrArray.concat(withBrkpt);
									} else if (
										attrContent.props[prop].type ===
											'withoutPrefix' ||
										attrContent.props[prop].type ===
											'withPrefix'
									) {
										attrArray = attrArray.concat(
											Object.keys(
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
											)
										);
									} else if (
										typeof attrContent.props[prop] ===
										'string'
									) {
										attrArray = attrArray.concat(prop);
									}
								});
							} else if (typeof attrContent === 'string')
								attrArray.push(attrType);

							if (type === 'withBreakpoint') {
								const newArray = [...attrArray];
								attrArray = [];
								newArray.forEach(prop => {
									const propArray = [prop];

									propArray.forEach(prop => {
										const withBrkpt = [];

										breakpoints.forEach(breakpoint =>
											withBrkpt.push(
												`${prop}-${breakpoint}`
											)
										);
										attrArray = attrArray.concat(withBrkpt);
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

							attrArray.forEach(a => {
								response = {
									...response,
									[a]: attributes[a],
								};
							});
						}
					);
			});

			['withPrefix', 'withoutPrefix'].forEach(type => {
				if (copyPasteMapping[tab][type])
					Object.entries(copyPasteMapping[tab][type]).forEach(
						([attrType, attr]) => {
							let attrArray = [];
							if (typeof attr === 'object' && attr.groupLabel) {
								Object.keys(attr.props).forEach(prop => {
									if (typeof attr.props[prop] === 'string')
										attrArray = attrArray.concat(prop);
									else
										attrArray = attrArray.concat(
											...attr.props[prop].props
										);
								});
							} else if (typeof attr === 'object' && attr.value) {
								attrArray = attr.value;
							} else attrArray = [attrType];

							response = {
								...response,
								...getGroupAttributes(
									attributes,
									attrArray,
									false,
									getPrefix(type, attr.prefix, prefix)
								),
							};
						}
					);
			});
		}
	});

	return response;
};

export default cleanStyleAttributes;
