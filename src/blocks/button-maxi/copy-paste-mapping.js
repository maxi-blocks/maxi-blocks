const copyPasteMapping = {
	exclude: ['buttonContent'],
	settings: {
		blockSpecific: {
			fullWidth: 'Full Width',
			buttonContent: 'Button Text',
			blockFullWidth: 'Block Full Width',
			customLabel: 'Custom Label',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			extraClassName: 'Custom CSS Classes',
		},
		withPrefix: {
			background: 'Background',
			backgroundColor: 'Background Color',
			backgroundGradient: 'Background Gradient',
			border: {
				groupLabel: 'Border Group',
				props: {
					border: 'Border',
					borderWidth: 'Border Width',
					borderRadius: 'Border Radius',
				},
			},
			boxShadow: 'Box Shadow',
			size: 'Size',
			margin: 'Margin',
			padding: 'Padding',
		},
		withPrefixHover: {
			backgroundHover: 'Background Hover',
			backgroundColorHover: 'Background Color Hover',
			backgroundGradientHover: 'Background Gradient Hover',
			borderHover: {
				groupLabel: 'Border Hover Group',
				props: {
					borderHover: 'Border Hover',
					borderWidthHover: 'Border Width Hover',
					borderRadiusHover: 'Border Radius Hover',
				},
			},
			boxShadowHover: 'Box Shadow Hover',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
			icon: 'Icon',
			iconBackground: 'Icon Background',
			iconPadding: 'Icon Padding',
			iconBackgroundColor: 'Icon Background Color',
			iconBackgroundGradient: 'Icon Background Gradient',
			iconBorder: 'Icon Border',
			iconBorderWidth: 'Icon Border Width',
			iconBorderRadius: 'Icon Border Radius',
			alignment: 'Alignment',
			textAlignment: 'Text Alignment',
			typography: 'Typography',
		},
		withoutPrefixHover: {
			iconHover: 'Icon Hover',
			iconBackgroundColorHover: 'Icon Background Color Hover',
			iconBackgroundGradientHover: 'Icon Background Gradient Hover',
			iconBorderHover: 'Icon Border Hover',
			iconBorderWidthHover: 'Icon Border Width Hover',
			iconBorderRadiusHover: 'Icon Border Radius Hover',
			typographyHover: 'Typography Hover',
		},
	},
	canvas: {
		withoutPrefix: {
			border: {
				groupLabel: 'Border Group',
				props: {
					border: 'Border',
					borderWidth: 'Border Width',
					borderRadius: 'Border Radius',
				},
			},
			boxShadow: 'Box Shadow',
			opacity: 'Opacity',
			blockBackground: 'Background',
			size: 'Size',
			margin: 'Margin',
			padding: 'Padding',
		},
		withoutPrefixHover: {
			borderHover: {
				groupLabel: 'Border Hover Group',
				props: {
					borderHover: 'Border Hover',
					borderWidthHover: 'Border Width Hover',
					borderRadiusHover: 'Border Radius Hover',
				},
			},
			boxShadowHover: 'Box Shadow Hover',
		},
	},
	advanced: {
		withoutPrefix: {
			scroll: 'Scroll',
			transform: 'Transform',
			transitionDuration: 'Transition Duration',
			display: 'Display',
			position: 'Position',
			overflow: 'Overflow',
			zIndex: 'z-Index',
			customCss: 'Custom Css',
			flex: 'Flex',
		},
	},
};

export default copyPasteMapping;
