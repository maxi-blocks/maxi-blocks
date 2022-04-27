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
						([attrType, attr]) => {
							let attrArray = [];

							if (typeof attr === 'object' && !attr.groupLabel)
								attrArray = [...attr.value];
							else if (
								typeof attr === 'object' &&
								attr.groupLabel
							)
								attrArray = [...Object.keys(attr.props)];
							else if (typeof attr === 'string')
								attrArray.push(attrType);

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

			[
				'withPrefix',
				'withPrefixHover',
				'withoutPrefix',
				'withoutPrefixHover',
			].forEach(type => {
				if (copyPasteMapping[tab][type])
					Object.entries(copyPasteMapping[tab][type]).forEach(
						([attrType, attr]) => {
							let attrArray = [];
							if (typeof attr === 'object' && attr.groupLabel)
								attrArray = Object.keys(attr.props);
							else attrArray = [attrType];
							attrArray.forEach(prop => {
								response = {
									...response,
									...getGroupAttributes(
										attributes,
										prop,
										type === 'withPrefixHover' ||
											type === 'withoutPrefixHover',
										type === 'withPrefix' ||
											type === 'withPrefixHover'
											? prefix
											: '',
										true
									),
								};
							});
						}
					);
			});
		}
	});

	return response;
};

export default cleanStyleAttributes;
