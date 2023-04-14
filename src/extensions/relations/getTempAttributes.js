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
	selectedSettingsObj,
	cleanAttributesObject,
	blockAttributes,
	breakpoint,
	prefix
) => {
	const tempAttributes = {};

	if (selectedSettingsObj.styleAttrs)
		selectedSettingsObj.styleAttrs.forEach(attrKey => {
			if (
				attrKey in cleanAttributesObject ||
				`${attrKey}-${breakpoint}` in cleanAttributesObject
			)
				return;

			let value = getLastBreakpointAttribute({
				target: attrKey,
				attributes: blockAttributes,
				breakpoint,
			});

			if (value)
				tempAttributes[getAttributeKey(attrKey, null, '', breakpoint)] =
					value;
			else {
				value = getAttributeValue({
					target: attrKey,
					props: blockAttributes,
					prefix,
					breakpoint,
				});

				if (value)
					tempAttributes[getAttributeKey(attrKey, null, prefix)] =
						value;
			}
		});

	// In some cases we need to force the adding of colours to the IB styles
	if (selectedSettingsObj.forceTempPalette) {
		let needPaletteInTemp = selectedSettingsObj.forceTempPalette;

		if (typeof needPaletteInTemp === 'function')
			needPaletteInTemp = needPaletteInTemp(blockAttributes, breakpoint);

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
