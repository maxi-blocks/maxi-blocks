const copyPasteMapping = {
	exclude: [
		'mediaID',
		'isImageUrl',
		'mediaURL',
		'mediaWidth',
		'mediaHeight',
		'mediaAlt',
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
		},
		withoutPrefix: {
			alignment: 'Alignment',
			hoverEffects: {
				groupLabel: 'Hover effects',
				props: {
					hover: 'Hover',
					hoverBackground: 'Hover Background',
					hoverBackgroundColor: 'Hover Background Color',
					hoverBackgroundGradient: 'Hover Background Gradient',
					hoverBorder: 'Hover Border',
					hoverBorderRadius: 'Hover Border Radius',
					hoverBorderWidth: 'Hover Border Width',
					hoverContentTypography: 'Hover Content Typography',
					hoverMargin: 'Hover Margin',
					hoverPadding: 'Hover Padding',
					hoverTitleTypography: 'Hover Title Typography',
				},
			},
			clipPath: 'Clip Path',
		},
		withPrefix: {
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
				},
			},
			borderHover: {
				groupLabel: 'Border hover',
				props: {
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
			size: 'Size',
			padding: 'Padding',
		},
	},
	canvas: {
		blockSpecific: {
			blockFullWidth: 'Block full width',
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
			size: 'Size',
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
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
