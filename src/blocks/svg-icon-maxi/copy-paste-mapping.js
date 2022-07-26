const prefix = 'svg-';

const copyPasteMapping = {
	settings: {
		'Icon content': { props: ['svgType', 'content'] },
		Alignment: {
			groupAttributes: 'alignment',
		},
		'Icon alt': {
			group: {
				'Alt title': 'altTitle',
				'Alt description': 'altDescription',
			},
		},
		'Icon colour': {
			group: {
				'Icon hover status': 'svg-status-hover',
				'Fill colour': { props: 'svg-fill', isPalette: true },
				'Line colour': { label: 'svg-line', isPalette: true },
				'Fill hover colour': {
					props: 'svg-fill',
					isPalette: true,
					isHover: true,
				},
				'Line hover colour': {
					props: 'svg-line',
					isPalette: true,
					isHover: true,
				},
			},
		},
		'Icon line width': {
			props: 'svg-stroke',
			hasBreakpoints: true,
		},
		'Icon background': {
			group: {
				'Background colour': {
					groupAttributes: ['background', 'backgroundColor'],
				},
				'Background color hover': {
					groupAttributes: ['background', 'backgroundColor'],
				},
				'Background gradient': {
					groupAttributes: ['background', 'backgroundGradient'],
				},
				'Background gradient hover': {
					groupAttributes: [
						'backgroundHover',
						'backgroundGradientHover',
					],
				},
			},
			prefix,
		},
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
		'Margin/Padding': {
			template: 'marginPadding',
			prefix,
		},
	},
	canvas: {
		Size: {
			template: 'size',
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
