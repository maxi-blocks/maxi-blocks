/**
 * Internal dependencies
 */
import { getGroupAttributes, paletteAttributesCreator } from '../styles';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

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
							)
								attrArray = [...Object.keys(attrContent.props)];
							else if (typeof attrContent === 'string')
								attrArray.push(attrType);

							if (type === 'withBreakpoint') {
								const newArray = [...attrArray];
								attrArray = [];
								newArray.forEach(prop => {
									let propArray = [prop];
									if (attrContent.props[prop].props) {
										propArray = [];
										propArray =
											attrContent.props[prop].props;
									}

									if (
										attrContent.props[prop].type ===
										'withPalette'
									) {
										propArray = [];
										const withPalette =
											paletteAttributesCreator({
												prefix: prop,
											});
										propArray = propArray.concat(
											Object.keys(withPalette)
										);
									}
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
								if (
									(typeof attributes[a] !== 'object' &&
										!isNil(attributes[a])) ||
									!isEmpty(attributes[a])
								)
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
									type === 'withPrefix' ? prefix : '',
									true
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
