const copyPasteMapping = {
	settings: {
		blockSpecific: {
			fullWidth: 'Full Width',
			blockFullWidth: 'Block Full Width',
		},
		withoutPrefix: {
			divider: 'Divider',
		},
		withPrefix: { boxShadow: 'Box Shadow' },
		withPrefixHover: { boxShadowHover: 'Box Shadow Hover' },
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
