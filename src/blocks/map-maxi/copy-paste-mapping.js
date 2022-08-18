const copyPasteMapping = {
	settings: {
		'Configure map': {
			group: {
				'Map provider': 'map-provider',
				'Minium zoom': 'map-min-zoom',
				'Maximum zoom': 'map-max-zoom',
			},
		},
		'Map marker': {
			group: {
				Markers: 'map-markers',
				'Marker icon': ['map-marker-icon', 'map-marker'],
				'Marker fill colour': {
					props: 'svg-fill',
					isPalette: true,
				},
				'Marker line colour': {
					props: 'svg-line',
					isPalette: true,
				},
				'Marker size': {
					props: 'svg-width',
					hasBreakpoints: true,
				},
			},
		},
		'Map popup text': {
			group: {
				'Title text level': 'map-marker-heading-level',
				'Title typography': {
					groupAttributes: 'typography',
				},
				'Description typography': {
					groupAttributes: 'typography',
					prefix: 'description-',
				},
			},
		},
		'Map popup': {
			group: {
				Background: {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'popup-',
				},
				'Box shadow': {
					groupAttributes: 'boxShadow',
					prefix: 'popup-',
				},
			},
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
		'Map interaction': {
			group: {
				'Map dragging': 'map-dragging',
				'Map touch zoom': 'map-touch-zoom',
				'Map double click zoom': 'map-double-click-zoom',
				'Map scroll wheel zoom': 'map-scroll-wheel-zoom',
			},
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
