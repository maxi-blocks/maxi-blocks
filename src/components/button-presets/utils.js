export const presetsSettings = {
	1: {
		border: {
			borderWidth: 1,
			borderRadius: 8,
		},

		background: {
			color: '#ff4a17',
		},

		padding: {
			top: 10,
			right: 20,
			bottom: 10,
			left: 20,
			unit: 'px',
		},

		typography: {
			color: '#ffffff',
		},

		boxShadow: {
			shadowColor: '#ffffff',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: '',
			color: '',
			background: '',
			padding: '',
			spacing: '',
			borderWidth: '',
			borderColor: '',
			borderRadius: '',
			borderRadiusUnit: '',
			position: 'left',
		},
	},

	2: {
		border: {
			borderWidth: 1,
			borderRadius: 8,
		},

		padding: {
			top: 10,
			right: 20,
			bottom: 10,
			left: 20,
			unit: 'px',
		},

		background: {
			color: '#ffffff',
		},

		typography: {
			color: '#ff4a17',
		},

		boxShadow: {
			shadowColor: '#ffffff',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: '',
			color: '',
			background: '',
			padding: '',
			spacing: '',
			borderWidth: '',
			borderColor: '',
			borderRadius: '',
			borderRadiusUnit: '',
			position: 'left',
		},
	},

	3: {
		border: {
			borderWidth: 1,
			borderRadius: 8,
		},

		padding: {
			top: 3,
			right: 3,
			bottom: 3,
			left: 20,
			unit: 'px',
		},

		background: {
			color: '#ff4a17',
		},

		typography: {
			color: '#ffffff',
		},

		boxShadow: {
			shadowColor: '#ffffff',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: 'fas fa-arrow-right',
			color: '#fffff',
			background: 'rgba(255, 255, 255, 0.5)',
			padding: 10,
			spacing: 10,
			borderWidth: 0,
			borderColor: '',
			borderRadius: 8,
			borderRadiusUnit: 'px',
			position: 'right',
		},
	},

	4: {
		border: {
			borderWidth: 1,
			borderRadius: 0,
		},

		padding: {
			top: 10,
			right: 20,
			bottom: 10,
			left: 20,
			unit: 'px',
		},

		background: {
			color: '#ffffff',
		},

		typography: {
			color: '#ff4a17',
		},

		boxShadow: {
			shadowColor: '#c2c3c5',
			shadowHorizontal: 5,
			shadowVertical: 5,
			shadowBlur: 0,
			shadowSpread: '',
		},

		icon: {
			icon: '',
			color: '#ff4a17',
			background: '',
			padding: '',
			spacing: '',
			borderWidth: '',
			borderColor: '',
			borderRadius: '',
			borderRadiusUnit: '',
			position: 'left',
		},
	},

	5: {
		border: {
			borderWidth: 1,
			borderRadius: 8,
		},
		background: {
			color: '#ffffff',
		},

		padding: {
			top: 3,
			right: 3,
			bottom: 3,
			left: 20,
			unit: 'px',
		},

		typography: {
			color: '#ff4a17',
		},

		boxShadow: {
			shadowColor: '',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: 'fas fa-arrow-right',
			color: '#ff4a17',
			background: '',
			padding: 10,
			spacing: 8,
			borderWidth: 1,
			borderColor: '#ff4a17',
			borderRadius: 50,
			borderRadiusUnit: '%',
			position: 'right',
		},
	},

	6: {
		border: {
			borderWidth: 1,
			borderRadius: 8,
		},
		background: {
			color: '#ffffff',
		},

		padding: {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
			unit: 'px',
		},

		typography: {
			color: '#ff4a17',
		},

		boxShadow: {
			shadowColor: '',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: 'far fa-envelope',
			color: '#ff4a17',
			background: '',
			padding: 0,
			spacing: 18,
			borderWidth: 0,
			borderColor: '#ff4a17',
			borderRadius: 50,
			borderRadiusUnit: '%',
			position: 'left',
		},
	},

	7: {
		border: {
			borderWidth: 0,
			borderRadius: 0,
		},
		background: {
			color: '#ff4a17',
		},

		padding: {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
			unit: 'px',
		},

		typography: {
			color: '#ffffff',
		},

		boxShadow: {
			shadowColor: '',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: 'fas fa-arrow-right',
			color: '#ffffff',
			background: '',
			padding: 0,
			spacing: 18,
			borderWidth: 0,
			borderColor: '',
			borderRadius: '',
			borderRadiusUnit: '%',
			position: 'right',
		},
	},

	8: {
		border: {
			borderWidth: 1,
			borderRadius: 0,
		},
		background: {
			color: '#ff4a17',
		},

		padding: {
			top: 3,
			right: 3,
			bottom: 3,
			left: 10,
			unit: 'px',
		},

		typography: {
			color: '#ffffff',
		},

		boxShadow: {
			shadowColor: '',
			shadowHorizontal: '',
			shadowVertical: '',
			shadowBlur: '',
			shadowSpread: '',
		},

		icon: {
			icon: 'fas fa-arrow-right',
			color: '#ffffff',
			background: '',
			padding: 10,
			spacing: 18,
			borderWidth: 1,
			borderColor: '#ffffff',
			borderRadius: '',
			borderRadiusUnit: '%',
			position: 'right',
		},
	},
};

export const updateButtonAttributes = (attributes, presetNumber) => {
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
	padding.general['padding-top'] = presetsSettings[presetNumber].padding.top;
	padding.general['padding-right'] =
		presetsSettings[presetNumber].padding.right;
	padding.general['padding-bottom'] =
		presetsSettings[presetNumber].padding.bottom;
	padding.general['padding-left'] =
		presetsSettings[presetNumber].padding.left;

	padding.general.unit = presetsSettings[presetNumber].padding.unit;
	newAttributes.padding = JSON.stringify(padding);

	// Set Box Shadow
	boxShadow.general.shadowColor =
		presetsSettings[presetNumber].boxShadow.shadowColor;

	boxShadow.general.shadowHorizontal =
		presetsSettings[presetNumber].boxShadow.shadowHorizontal;

	boxShadow.general.shadowVertical =
		presetsSettings[presetNumber].boxShadow.shadowVertical;

	boxShadow.general.shadowBlur =
		presetsSettings[presetNumber].boxShadow.shadowBlur;

	newAttributes.boxShadow = JSON.stringify(boxShadow);

	// Set Border Width.
	border.general['border-style'] = 'solid';
	border.general['border-color'] = '#ff4a17';
	border.borderWidth.general['border-bottom-width'] =
		presetsSettings[presetNumber].border.borderWidth;
	border.borderWidth.general['border-top-width'] =
		presetsSettings[presetNumber].border.borderWidth;
	border.borderWidth.general['border-right-width'] =
		presetsSettings[presetNumber].border.borderWidth;
	border.borderWidth.general['border-left-width'] =
		presetsSettings[presetNumber].border.borderWidth;
	border.borderWidth.unit = 'px';

	// Set Border Radius.
	border.borderRadius.general['border-bottom-left-radius'] =
		presetsSettings[presetNumber].border.borderRadius;
	border.borderRadius.general['border-bottom-right-radius'] =
		presetsSettings[presetNumber].border.borderRadius;
	border.borderRadius.general['border-top-right-radius'] =
		presetsSettings[presetNumber].border.borderRadius;
	border.borderRadius.general['border-top-left-radius'] =
		presetsSettings[presetNumber].border.borderRadius;
	border.borderWidth.general.unit = 'px';

	newAttributes.border = JSON.stringify(border);

	// Set Background
	background.activeMedia = 'color';

	background.colorOptions.activeColor =
		presetsSettings[presetNumber].background.color;
	background.colorOptions.color =
		presetsSettings[presetNumber].background.color;

	newAttributes.background = JSON.stringify(background);

	// Set Typography
	typography.general.color = presetsSettings[presetNumber].typography.color;
	newAttributes.typography = JSON.stringify(typography);

	// Set Icon Settings
	iconObject.icon = presetsSettings[presetNumber].icon.icon;
	iconObject.position = presetsSettings[presetNumber].icon.position;
	iconObject.general.spacing = presetsSettings[presetNumber].icon.spacing;

	newAttributes.icon = JSON.stringify(iconObject);

	// Set Icon Background
	iconBackground.activeMedia = 'color';

	iconBackground.colorOptions.activeColor =
		presetsSettings[presetNumber].icon.background;
	iconBackground.colorOptions.color =
		presetsSettings[presetNumber].icon.background;

	newAttributes.iconBackground = JSON.stringify(iconBackground);

	// Set Icon padding
	iconPadding.general.unit = 'px';
	iconPadding.general['padding-top'] =
		presetsSettings[presetNumber].icon.padding;
	iconPadding.general['padding-right'] =
		presetsSettings[presetNumber].icon.padding;
	iconPadding.general['padding-bottom'] =
		presetsSettings[presetNumber].icon.padding;
	iconPadding.general['padding-left'] =
		presetsSettings[presetNumber].icon.padding;
	newAttributes.iconPadding = JSON.stringify(iconPadding);

	// Icon border
	iconBorder.general['border-style'] = 'solid';
	iconBorder.general['border-color'] =
		presetsSettings[presetNumber].icon.borderColor;
	iconBorder.borderWidth.general['border-bottom-width'] =
		presetsSettings[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.general['border-top-width'] =
		presetsSettings[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.general['border-right-width'] =
		presetsSettings[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.general['border-left-width'] =
		presetsSettings[presetNumber].icon.borderWidth;
	iconBorder.borderWidth.unit = 'px';

	// Set Border Radius.
	iconBorder.borderRadius.general['border-bottom-left-radius'] =
		presetsSettings[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general['border-bottom-right-radius'] =
		presetsSettings[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general['border-top-right-radius'] =
		presetsSettings[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general['border-top-left-radius'] =
		presetsSettings[presetNumber].icon.borderRadius;
	iconBorder.borderRadius.general.unit =
		presetsSettings[presetNumber].icon.borderRadiusUnit;
	newAttributes.iconBorder = JSON.stringify(iconBorder);

	return newAttributes;
};
