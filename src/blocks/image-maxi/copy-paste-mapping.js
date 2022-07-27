const prefix = 'image-';

const copyPasteMapping = {
	settings: {
		Dimension: {
			group: {
				'Image size': 'imageSize',
				'Use original size': 'useInitSize',
				'Image width': 'imgWidth',
				'Image ratio': 'imageRatio',
			},
		},
		Alignment: {
			groupAttributes: 'alignment',
		},
		'Alt tag': ['mediaAlt', 'altSelector'],
		Caption: {
			group: {
				'Caption type': 'captionType',
				'Caption content': 'captionContent',
				'Caption position': 'captionPosition',
				'Caption gap': {
					props: 'caption-gap',
					hasBreakpoints: true,
				},
				'Caption gap unit': {
					props: 'caption-gap-unit',
					hasBreakpoints: true,
				},
				Typography: {
					groupAttributes: 'typography',
				},
				'Text alignment': {
					groupAttributes: 'textAlignment',
				},
				Link: { groupAttributes: 'link' },
			},
		},
		'Hover effects': {
			group: {
				Hover: {
					groupAttributes: 'hover',
				},
				'Hover background': {
					groupAttributes: 'hoverBackground',
				},
				'Hover background color': {
					groupAttributes: 'hoverBackgroundColor',
				},
				'Hover background gradient': {
					groupAttributes: 'hoverBackgroundGradient',
				},
				'Hover border': {
					groupAttributes: 'hoverBorder',
				},
				'Hover border radius': {
					groupAttributes: 'hoverBorderRadius',
				},
				'Hover border width': { groupAttributes: 'hoverBorderWidth' },
				'Hover content typography': {
					groupAttributes: 'hoverContentTypography',
				},
				'Hover margin': {
					groupAttributes: 'hoverMargin',
				},
				'Hover padding': {
					groupAttributes: 'hoverPadding',
				},
				'Hover title typography': {
					groupAttributes: 'hoverTitleTypography',
				},
			},
		},
		'Clip path': {
			groupAttributes: 'clipPath',
		},
		Image: [
			'mediaID',
			'isImageUrl',
			'mediaURL',
			'mediaWidth',
			'mediaHeight',
			'mediaAlt',
		],

		Border: {
			template: 'border',
			prefix,
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix,
		},
		Size: {
			template: 'size',
			prefix,
		},
		Padding: {
			groupAttributes: 'padding',
			prefix,
		},
	},
	canvas: {
		blockSpecific: {
			Size: {
				template: 'size',
			},
		},
		Background: {
			template: 'blockBackground',
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Opacity: {
			template: 'opacity',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};

export default copyPasteMapping;
