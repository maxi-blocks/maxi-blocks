const copyPasteMapping = {
	settings: {
		blockSpecific: {
			blockFullWidth: 'Block Full Width',
			removeColumnGap: 'Remove Column Gap',
			verticalAlign: 'Vertical Align',
			horizontalAlign: 'Horizontal Align',
			customLabel: 'Custom Label',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			extraClassName: 'Custom CSS Classes',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
			rowPattern: 'Row Pattern',
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
			opacity: 'Opacity',
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
