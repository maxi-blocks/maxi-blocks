const copyPasteMapping = {
	exclude: ['content'],
	settings: {
		blockSpecific: {
			blockFullWidth: 'Full Width',
			content: 'Text Content',
			textLevel: 'Text Level',
			listStyle: 'List Style',
			listStyleCustom: 'List Style Custom',
			listStart: 'List Start',
			listReversed: 'List Reversed',
			customLabel: 'Custom Label',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			extraClassName: 'Custom CSS Classes',
		},
		withBreakpoint: {
			'list-gap': 'List Gap',
			'list-gap-unit': 'List Gap Unit',
			'list-paragraph-spacing': 'List Paragraph Spacing',
			'list-paragraph-spacing-unit': 'List Paragraph Spacing Unit',
			'list-indent': 'List Indent',
			'list-indent-unit': 'List Indent Unit',
			'list-marker-size': 'Marker Size',
			'list-marker-size-unit': 'Marker Size Unit',
			'list-marker-indent': 'List Marker Indent',
			'list-marker-indent-unit': 'List Marker Indent Unit',
			'list-marker-line-height': 'List Marker Line Height',
			'list-marker-line-height-unit': 'List Marker Line Height Unit',
			'list-text-position': 'List Text Position',
		},
		withPalette: {
			'list-': 'List Color',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
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
			size: 'Size',
			padding: 'Padding',
			margin: 'Margin',
			textAlignment: 'Text Alignment',
			typography: 'Typography',
			link: 'Link',
		},
		withoutPrefixHover: {
			typographyHover: 'Typography Hover',
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
			opacity: 'Opacity',
			position: 'Position',
			overflow: 'Overflow',
			zIndex: 'z-Index',
			customCss: 'Custom Css',
			flex: 'Flex',
		},
	},
};

export default copyPasteMapping;
