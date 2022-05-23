const copyPasteMapping = {
	settings: {
		blockSpecific: {
			fullWidth: 'Full width',
			verticalAlign: 'Vertical align',
			customLabel: 'Custom label',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			extraClassName: 'Custom CSS classes',
		},
		withoutPrefix: {
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
				},
			},
			boxShadow: 'Box shadow',
			blockBackground: 'Background',
			columnSize: 'Column size',
			size: 'Size',
			margin: 'Margin',
			padding: 'Padding',
			breakpoints: 'Breakpoints',
		},
		withoutPrefixHover: {
			borderHover: {
				groupLabel: 'Border hover',
				props: {
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
			},
			boxShadowHover: 'Box shadow hover',
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
			customCss: 'Custom CSS',
			flex: 'Flex',
		},
	},
};

export default copyPasteMapping;
