/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getAttributeValue,
	getPaletteAttributes,
} from '@extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
			const getValues = (key, props, returnValue = false) => {
				const attrsToCompare = props ?? blockAttributes;

				if (
					key in cleanAttributesObject ||
					`${key}-${breakpoint}` in cleanAttributesObject
				)
					return null;

				const responsiveValues = returnValue && {};
				let isBreakpointValue = false;
				['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
					breakpoint => {
						const value = getAttributeValue({
							target: key,
							props: attrsToCompare,
							breakpoint,
							prefix,
							returnValueWithoutBreakpoint: false,
						});

						if (value) {
							isBreakpointValue = true;
							const attributeKey = getAttributeKey(
								key,
								null,
								prefix,
								breakpoint
							);
							if (!returnValue) {
								tempAttributes[attributeKey] = value;
							} else {
								responsiveValues[attributeKey] = value;
							}
						}
					}
				);

				if (!isBreakpointValue) {
					const value = getAttributeValue({
						target: key,
						props: attrsToCompare,
						prefix,
					});

					if (value) {
						const attributeKey = getAttributeKey(key, null, prefix);
						if (!returnValue) {
							tempAttributes[attributeKey] = value;
						} else {
							responsiveValues[attributeKey] = value;
						}
					}
				}

				return !isEmpty(responsiveValues) ? responsiveValues : null;
			};

			if (sid && sid === 'bgl') {
				if ('background-layers' in cleanAttributesObject) {
					if (!('background-layers' in tempAttributes))
						tempAttributes['background-layers'] =
							cleanAttributesObject['background-layers'];

					cleanAttributesObject['background-layers'].forEach(
						(_layer, i) => {
							const values = getValues(
								attrKey,
								blockAttributes['background-layers'][i],
								true
							);

							if (values) {
								tempAttributes['background-layers'][i] = {
									...tempAttributes['background-layers'][i],
									...values,
								};
							}
						}
					);
				}
			} else getValues(attrKey);
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
