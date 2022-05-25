const copyPasteMapping = {
	exclude: [
		'mediaID',
		'isImageUrl',
		'mediaURL',
		'mediaWidth',
		'mediaHeight',
		'mediaAlt',
	],
	_order: [
		'Dimension',
		'Alignment',
		'Alt tag',
		'Background',
		'Caption',
		'Hover effects',
		'Clip path',
		'Border',
		'Box shadow',
		'Size',
		'Padding',
	],

	settings: {
		blockSpecific: {
			dimension: {
				groupLabel: 'Dimension',
				props: {
					useInitSize: 'Use original size',
					imgWidth: 'Image width',
					imageRatio: 'Image ratio',
				},
			},
			mediaAlt: { label: 'Alt tag', value: ['mediaAlt', 'altSelector'] },
			caption: {
				groupLabel: 'Caption',
				props: {
					captionType: 'Caption type',
					captionContent: 'Caption content',
					captionPosition: 'Caption position',
					'caption-gap': {
						label: 'Caption gap',
						type: 'withBreakpoint',
					},
					'caption-gap-unit': {
						label: 'Caption gap unit',
						type: 'withBreakpoint',
					},
					typography: { label: 'Typography', type: 'withoutPrefix' },
					textAlignment: {
						label: 'Text alignment',
						type: 'withoutPrefix',
					},
					link: { label: 'Link', type: 'withoutPrefix' },
				},
			},
			mediaID: {
				label: 'Image',
				value: [
					'mediaID',
					'isImageUrl',
					'mediaURL',
					'mediaWidth',
					'mediaHeight',
					'mediaAlt',
				],
			},
			size: {
				groupLabel: 'Size',
				props: {
					fullWidth: 'Full width',
					size: { label: 'Size', type: 'withPrefix' },
				},
			},
		},
		withoutPrefix: {
			alignment: 'Alignment',
			hoverEffects: {
				groupLabel: 'Hover effects',
				props: {
					hover: 'Hover',
					hoverBackground: 'Hover background',
					hoverBackgroundColor: 'Hover background color',
					hoverBackgroundGradient: 'Hover background gradient',
					hoverBorder: 'Hover border',
					hoverBorderRadius: 'Hover border radius',
					hoverBorderWidth: 'Hover border width',
					hoverContentTypography: 'Hover content typography',
					hoverMargin: 'Hover margin',
					hoverPadding: 'Hover padding',
					hoverTitleTypography: 'Hover title typography',
				},
			},
			clipPath: 'Clip path',
		},
		withPrefix: {
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
			},
			boxShadow: {
				groupLabel: 'Box shadow',
				props: {
					boxShadow: 'Box shadow',
					boxShadowHover: 'Box shadow hover',
				},
			},
			padding: 'Padding',
		},
	},
	canvas: {
		blockSpecific: {
			size: {
				groupLabel: 'Size',
				props: {
					blockFullWidth: 'Full width',
					size: { label: 'Size', type: 'withoutPrefix' },
				},
			},
		},
		withoutPrefix: {
			blockBackground: 'Background',
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
			},
			boxShadow: {
				groupLabel: 'Box shadow',
				props: {
					boxShadow: 'Box shadow',
					boxShadowHover: 'Box shadow hover',
				},
			},
			opacity: 'Opacity',
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
			},
		},
	},
	advanced: {
		blockSpecific: {
			extraClassName: 'Custom CSS classes',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			relations: 'Interaction',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
			customCss: 'Custom CSS',
			scroll: 'Scroll',
			transform: 'Transform',
			transition: 'Hyperlink hover transition',
			display: 'Show/hide block',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
