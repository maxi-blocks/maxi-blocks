/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getAttributeValue,
	getLastBreakpointAttribute,
	getPaletteAttributes,
} from '../styles';

const getTempAttributes = (
	selectedSettingsObj = {},
	cleanAttributesObject,
	blockAttributes,
	breakpoint,
	prefix,
	sid
) => {
	const tempAttributes = {};

	if (selectedSettingsObj.styleAttrs)
		selectedSettingsObj.styleAttrs.forEach(attrKey => {
			/**
			 * TODO: this piece of code is having a dual behavior: it's returning a value or setting a value.
			 * Needs to be refactored to be more readable and maintainable.
			 */
			const getValue = (key, props, returnValue = false) => {
				const attrsToCompare = props ?? blockAttributes;

				if (
					key in cleanAttributesObject ||
					`${key}-${breakpoint}` in cleanAttributesObject
				)
					return null;

				let value = getLastBreakpointAttribute({
					target: key,
					attributes: attrsToCompare,
					breakpoint,
				});

				if (value && !returnValue)
					tempAttributes[getAttributeKey(key, null, '', breakpoint)] =
						value;
				else if (value) return value;
				else {
					value = getAttributeValue({
						target: key,
						props: attrsToCompare,
						prefix,
					});

					if (value && !returnValue)
						tempAttributes[getAttributeKey(key, null, prefix)] =
							value;
					else if (value) return value;
				}

				return null;
			};

			if (sid && sid === 'bgl') {
				if ('background-layers' in cleanAttributesObject) {
					if (!('background-layers' in tempAttributes))
						tempAttributes['background-layers'] = [];

					cleanAttributesObject['background-layers'].forEach(
						(layer, i) => {
							tempAttributes['background-layers'][i] = {
								...tempAttributes['background-layers'][i],
								[attrKey]: getValue(
									attrKey,
									blockAttributes['background-layers'][i],
									true
								),
							};
						}
					);
				}
			} else getValue(attrKey);
		});

	// In some cases we need to force the adding of colours to the IB styles
	if (selectedSettingsObj.forceTempPalette) {
		let needPaletteInTemp = selectedSettingsObj.forceTempPalette;

		if (typeof needPaletteInTemp === 'function')
			needPaletteInTemp = needPaletteInTemp(
				blockAttributes,
				breakpoint,
				cleanAttributesObject
			);

		if (needPaletteInTemp) {
			const { paletteStatus, paletteColor, paletteOpacity, color } =
				getPaletteAttributes({
					obj: blockAttributes,
					prefix:
						selectedSettingsObj.forceTempPalettePrefix ?? prefix,
					breakpoint,
				});

			const addPaletteAttrToTemp = (attrValue, attrKey) => {
				const key = getAttributeKey(
					attrKey,
					null,
					selectedSettingsObj.forceTempPalettePrefix ?? prefix,
					breakpoint
				);

				if (!(key in cleanAttributesObject) && attrValue)
					tempAttributes[key] = attrValue;
			};

			addPaletteAttrToTemp(paletteStatus, 'palette-status');
			addPaletteAttrToTemp(paletteColor, 'palette-color');
			addPaletteAttrToTemp(paletteOpacity, 'palette-opacity');
			addPaletteAttrToTemp(color, 'color');
		}
	}

	return tempAttributes;
};

export default getTempAttributes;
