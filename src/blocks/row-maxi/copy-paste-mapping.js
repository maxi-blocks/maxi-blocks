const copyPasteMapping = {
	_order: [
		'Row settings',
		'Background',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		'Row settings': {
			group: {
				'Row pattern': 'row-pattern',
				'Row gap': ['row-gap', 'row-gap-unit'],
				'Column gap': ['column-gap', 'column-gap-unit'],
				'Flex wrap': 'flex-wrap',
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
