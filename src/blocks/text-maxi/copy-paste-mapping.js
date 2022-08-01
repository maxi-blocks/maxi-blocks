const copyPasteMapping = {
	settings: {
		'Text content': 'content',
		'Heading / Paragraph tag': 'textLevel',
		'List options': {
			group: {
				'List indent': {
					props: 'list-indent',
					hasBreakpoints: true,
				},
				'List indent unit': {
					props: 'list-indent-unit',
					hasBreakpoints: true,
				},
				'List gap': {
					props: 'list-gap',
					hasBreakpoints: true,
				},
				'List gap unit': {
					props: 'list-gap-unit',
					hasBreakpoints: true,
				},
				'List paragraph spacing': {
					props: 'list-paragraph-spacing',
					hasBreakpoints: true,
				},
				'List paragraph spacing unit': {
					props: 'list-paragraph-spacing-unit',
					hasBreakpoints: true,
				},
				'Marker size': {
					props: 'list-marker-size',
					hasBreakpoints: true,
				},
				'Marker size unit': {
					props: 'list-marker-size-unit',
					hasBreakpoints: true,
				},
				'List marker indent': {
					props: 'list-marker-indent',
					hasBreakpoints: true,
				},
				'List marker indent unit': {
					props: 'list-marker-indent-unit',
					hasBreakpoints: true,
				},
				'List marker line height': {
					props: 'list-marker-line-height',
					hasBreakpoints: true,
				},
				'List marker line height unit': {
					props: 'list-marker-line-height-unit',
					hasBreakpoints: true,
				},
				'List colour': {
					props: 'list',
					isPalette: true,
				},
				'List text position': {
					props: 'list-text-position',
					hasBreakpoints: true,
				},
				'List type': 'typeOfList',
				'List style': 'listStyle',
				'List style custom': 'listStyleCustom',
				'List start': 'listStart',
				'List reversed': 'listReversed',
			},
		},
		'Text alignment': {
			groupAttributes: 'textAlignment',
		},
		Typography: {
			template: 'typography',
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
