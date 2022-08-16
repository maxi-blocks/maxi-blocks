const copyPasteMapping = {
	settings: {
		'Accordion settings': {
			group: {
				'Accordion layout': 'accordionLayout',
				Collapsible: 'isCollapsible',
				'Pane closes when another opens': 'autoPaneClose',
				'Pane spacing': {
					props: ['pane-spacing', 'pane-spacing-unit'],
					hasBreakpoints: true,
				},
				'Animation duration': 'animationDuration',
			},
		},
		'Accordion line': { groupAttributes: 'accordionLine' },
		'Accordion title': { groupAttributes: 'accordionTitle' },
		Icon: { groupAttributes: 'accordionIcon' },
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
	},
};

export default copyPasteMapping;
