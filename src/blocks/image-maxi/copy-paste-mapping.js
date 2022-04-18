const copyPasteMapping = {
	excludeInGeneralPaste: [
		'mediaID',
		'isImageUrl',
		'mediaURL',
		'mediaWidth',
		'mediaHeight',
		'mediaAlt',
	],
	settings: {
		blockSpecific: {
			fullWidth: 'Full Width',
			customLabel: 'Custom Label',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			extraClassName: 'Custom CSS Classes',
			imageSize: {
				label: 'Image Size',
				value: ['imageSize', 'mediaURL', 'mediaWidth', 'mediaHeight'],
			},
			cropOptions: {
				label: 'Crop Options',
				value: ['cropOptions', 'mediaURL', 'mediaWidth', 'mediaHeight'],
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
			mediaAlt: { label: 'Alt tag', value: ['mediaAlt', 'altSelector'] },
			imgWidth: 'Image Width',
			useInitSize: 'Use original size',
			clipPath: 'Clip Path',
			captionType: 'Caption Type',
			captionContent: 'Caption Content',
			captionPosition: 'Caption Position',
			imageRatio: 'Image Ratio',
			SVGElement: {
				label: 'SVG Shape',
				value: ['SVGElement', 'SVGData'],
			},
		},
		withBreakpoint: {
			'caption-gap': 'Caption Gap',
			'caption-gap-unit': 'Caption Gap Unit',
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
			alignment: 'Alignment',
			textAlignment: 'Text Alignment',
			typography: 'Typography',
			link: 'Link',
			imageShape: 'Image Shape',
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
			breakpoints: 'Breakpoints',
		},
	},
	canvas: {
		blockSpecific: {
			blockFullWidth: 'Block Full Width',
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
