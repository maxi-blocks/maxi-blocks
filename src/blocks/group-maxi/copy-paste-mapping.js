const copyPasteMapping = {
	_order: [
		'Callout arrow',
		'Background',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		'Callout arrow': {
			group: {
				'Show arrow': 'arrow-status',
				'Arrow side': 'arrow-side',
				'Arrow position': 'arrow-position',
				'Arrow size': 'arrow-width',
			},
			hasBreakpoints: true,
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
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
		Opacity: {
			template: 'opacity',
		},
	},
};

export default copyPasteMapping;
