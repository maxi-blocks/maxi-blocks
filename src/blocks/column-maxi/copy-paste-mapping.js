const copyPasteMapping = {
	settings: {
		blockSpecific: {
			fullWidth: 'Full Width',
			verticalAlign: 'Vertical Align',
			customLabel: 'Custom Label',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			extraClassName: 'Custom CSS Classes',
		},
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
			blockBackground: 'Background',
			columnSize: 'Column Size',
			size: 'Size',
			margin: 'Margin',
			padding: 'Padding',
			breakpoints: 'Breakpoints',
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
			opacity: 'Opacity',
			scroll: 'Scroll',
			transform: 'Transform',
			display: 'Display',
			overflow: 'Overflow',
			zIndex: 'z-Index',
			customCss: 'Custom Css',
			flex: 'Flex',
		},
	},
};

export default copyPasteMapping;
