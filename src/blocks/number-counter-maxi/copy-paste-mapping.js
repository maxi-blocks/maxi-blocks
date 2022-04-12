const copyPasteMapping = {
	settings: {
		blockSpecific: {
			blockFullWidth: 'Block Full Width',
		},
		withPrefix: {
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
			numberCounter: 'Number Counter',
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
