const copyPasteMapping = {
	exclude: ['content', 'svgType'],
	settings: {
		blockSpecific: {
			content: { label: 'SVG Content', value: ['svgType', 'content'] },
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
			svg: 'SVG',
			alignment: 'Alignment',
			size: 'Size',
		},
	},
	canvas: {
		withoutPrefix: {
			blockBackground: 'Background',
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
