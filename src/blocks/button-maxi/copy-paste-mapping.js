const copyPasteMapping = {
	settings: {
		'Button text': 'buttonContent',
		Icon: {
			Icon: { groupAttributes: ['icon', 'iconHover'] },
			'Icon border': {
				groupAttributes: [
					'iconBorder',
					'iconBorderWidth',
					'iconBorderRadius',
					'iconBorderHover',
					'iconBorderWidthHover',
					'iconBorderRadiusHover',
				],
			},
			'Icon background': {
				groupAttributes: [
					'iconBackground',
					'iconBackgroundColor',
					'iconBackgroundGradient',
					'iconBackgroundHover',
					'iconBackgroundColorHover',
					'iconBackgroundGradientHover',
				],
			},
			'Icon padding': {
				groupAttributes: 'Icon padding',
			},
		},
		Alignment: {
			Alignment: { groupAttributes: 'alignment' },
			'Text alignment': { groupAttributes: 'textAlignment' },
		},
		Typography: {
			template: 'typography',
		},
		'Button background': {
			template: 'background',
			prefix: 'button-',
		},
		Border: {
			template: 'border',
			prefix: 'button-',
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix: 'button-',
		},
		Size: {
			template: 'size',
			prefix: 'button-',
		},
		'Margin/Padding': {
			template: 'marginPadding',
			prefix: 'button-',
		},
	},
	canvas: {
		Size: {
			template: 'size',
		},
		withoutPrefix: {
			Background: {
				groupAttributes: 'blockBackground',
			},
			Border: {
				template: 'border',
			},
			'Box shadow': {
				template: 'boxShadow',
			},
			Opacity: {
				groupAttributes: 'opacity',
			},
			'Margin/Padding': {
				template: 'marginPadding',
			},
		},
	},
	advanced: {
		template: 'advanced',
	},
};

export default copyPasteMapping;
