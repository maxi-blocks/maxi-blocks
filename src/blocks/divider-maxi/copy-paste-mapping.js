const copyPasteMapping = {
	settings: {
		Alignment: {
			group: {
				'Line orientation': 'line-orientation',
				'Line vertical position': 'line-vertical',
				'Line horizontal position': 'line-horizontal',
			},
			hasBreakpoints: true,
		},
		'Line settings': {
			group: {
				'Line style': 'divider-border-style',
				'Line colour': {
					props: 'divider-border',
					isPalette: true,
				},
				'Line size': ['divider-height', 'divider-width'],
				'Line weight': [
					'divider-border-top-width',
					'divider-border-top-unit',
					'divider-border-right-width',
					'divider-border-right-unit',
				],
			},
			hasBreakpoints: true,
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix: 'divider-',
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
