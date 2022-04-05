const copyPasteMapping = {
	settings: {
		blockSpecific: {
			content: 'SVG Content',
			blockFullWidth: 'Block Full Width',
		},
		withPrefix: {
			background: 'Background',
			backgroundColor: 'Background Color',
			backgroundGradient: 'Background Gradient',
			border: 'Border',
			borderWidth: 'Border Width',
			borderRadius: 'Border Radius',
			boxShadow: 'Box Shadow',
			margin: 'Margin',
			padding: 'Padding',
		},
		withPrefixHover: {
			backgroundHover: 'Background Hover',
			backgroundColorHover: 'Background Color Hover',
			backgroundGradientHover: 'Background Gradient Hover',
			borderHover: 'Border Hover',
			borderWidthHover: 'Border Width Hover',
			borderRadiusHover: 'Border Radius Hover',
			boxShadowHover: 'Box Shadow Hover',
		},
		withoutPrefix: { svg: 'SVG', alignment: 'Alignment', size: 'Size' },
	},
	canvas: {
		withoutPrefix: {
			blockBackground: 'Background',
			border: 'Border',
			borderRadius: 'Border Radius',
			borderWidth: 'Border Width',
			boxShadow: 'Box Shadow',
			opacity: 'Opacity',
			margin: 'Margin',
			padding: 'Padding',
		},
		withoutPrefixHover: {
			borderHover: 'Border Hover',
			borderRadiusHover: 'Border Radius Hover',
			borderWidthHover: 'Border Width Hover',
			boxShadowHover: 'Box Shadow Hover',
		},
	},
	advanced: {
		withoutPrefix: {
			scroll: 'Scroll',
			transform: 'Transform',
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
