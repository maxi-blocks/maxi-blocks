import presetsStyles from './presets';

const newButtonAttributes = (attributes, presetNumber) => {
	const newAttributes = { ...attributes };
	const border = JSON.parse(newAttributes.border);
	const background = JSON.parse(newAttributes.background);
	const typography = JSON.parse(newAttributes.typography);
	const boxShadow = JSON.parse(newAttributes.boxShadow);
	const padding = JSON.parse(newAttributes.padding);
	const iconObject = JSON.parse(newAttributes.icon);
	const iconBorder = JSON.parse(newAttributes.iconBorder);
	const iconBackground = JSON.parse(newAttributes.background);
	const iconPadding = JSON.parse(newAttributes.iconPadding);

	// Set Padding
	padding.general.unit = 'px';
	padding.general['padding-top'] = presetsStyles[presetNumber].padding.top;
	padding.general['padding-right'] =
		presetsStyles[presetNumber].padding.right;
	padding.general['padding-bottom'] =
		presetsStyles[presetNumber].padding.bottom;
	padding.general['padding-left'] = presetsStyles[presetNumber].padding.left;

	padding.general.unit = presetsStyles[presetNumber].padding.unit;
	newAttributes.padding = JSON.stringify(padding);

	// Set Box Shadow
	boxShadow.general.shadowColor =
		presetsStyles[presetNumber].boxShadow.shadowColor;

	boxShadow.general.shadowHorizontal =
		presetsStyles[presetNumber].boxShadow.shadowHorizontal;

	boxShadow.general.shadowVertical =
		presetsStyles[presetNumber].boxShadow.shadowVertical;

	boxShadow.general.shadowBlur =
		presetsStyles[presetNumber].boxShadow.shadowBlur;

	newAttributes.boxShadow = JSON.stringify(boxShadow);

	// Set Border Width.
	border.general['border-style'] = 'solid';
	border.general['border-color'] = '#ff4a17';
	border.borderWidth.general['border-bottom-width'] =
		presetsStyles[presetNumber].border.borderWidth;
	border.borderWidth.general['border-top-width'] =
		presetsStyles[presetNumber].border.borderWidth;
	border.borderWidth.general['border-right-width'] =
		presetsStyles[presetNumber].border.borderWidth;
	border.borderWidth.general['border-left-width'] =
		presetsStyles[presetNumber].border.borderWidth;
	border.borderWidth.unit = 'px';

	// Set Border Radius.
	border.borderRadius.general['border-bottom-left-radius'] =
		presetsStyles[presetNumber].border.borderRadius;
	border.borderRadius.general['border-bottom-right-radius'] =
		presetsStyles[presetNumber].border.borderRadius;
	border.borderRadius.general['border-top-right-radius'] =
		presetsStyles[presetNumber].border.borderRadius;
	border.borderRadius.general['border-top-left-radius'] =
		presetsStyles[presetNumber].border.borderRadius;
	border.borderWidth.general.unit = 'px';

	newAttributes.border = JSON.stringify(border);

	// Set Background
	background.activeMedia = 'color';

	background.colorOptions.activeColor =
		presetsStyles[presetNumber].background.color;
	background.colorOptions.color =
		presetsStyles[presetNumber].background.color;

	newAttributes.background = JSON.stringify(background);

	// Set Typography
	typography.general.color = presetsStyles[presetNumber].typography.color;
	newAttributes.typography = JSON.stringify(typography);

	// Set Icon Settings
	iconObject.icon = presetsStyles[presetNumber].icon.icon;
	iconObject.position = presetsStyles[presetNumber].icon.position;
	iconObject.general.spacing = presetsStyles[presetNumber].icon.spacing;

	newAttributes.icon = JSON.stringify(iconObject);

	// Set Icon Background
	iconBackground.activeMedia = 'color';

	iconBackground.colorOptions.activeColor =
		presetsStyles[presetNumber].icon.background;
	iconBackground.colorOptions.color =
		presetsStyles[presetNumber].icon.background;

	newAttributes.iconBackground = JSON.stringify(iconBackground);

	// Set Icon padding
	iconPadding.general.unit = 'px';
	iconPadding.general['padding-top'] =
		presetsStyles[presetNumber].icon.padding;
	iconPadding.general['padding-right'] =
		presetsStyles[presetNumber].icon.padding;
	iconPadding.general['padding-bottom'] =
		presetsStyles[presetNumber].icon.padding;
	iconPadding.general['padding-left'] =
		presetsStyles[presetNumber].icon.padding;
	newAttributes.iconPadding = JSON.stringify(iconPadding);

	// Icon border
	iconBorder.general['border-style'] = 'solid';
	iconBorder.general['border-color'] =
		presetsStyles[presetNumber].icon.borderColor;
	iconBorder.borderWidth.general['border-bottom-width'] =
		presetsStyles[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.general['border-top-width'] =
		presetsStyles[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.general['border-right-width'] =
		presetsStyles[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.general['border-left-width'] =
		presetsStyles[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.unit = 'px';

	// Set Border Radius.
	iconBorder.borderRadius.general['border-bottom-left-radius'] =
		presetsStyles[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general['border-bottom-right-radius'] =
		presetsStyles[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general['border-top-right-radius'] =
		presetsStyles[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general['border-top-left-radius'] =
		presetsStyles[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general.unit =
		presetsStyles[presetNumber].icon.borderRadiusUnit;
	newAttributes.iconBorder = JSON.stringify(iconBorder);

	return newAttributes;
};

export default newButtonAttributes;
