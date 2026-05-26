const prefix = 'fixture-';

const makeGeneratedGroup = generatedPrefix => ({
	'Generated size': {
		template: 'size',
		prefix: generatedPrefix,
	},
});

const copyPasteMapping = {
	_exclude: ['excluded-setting'],
	settings: {
		'Border': {
			template: 'border',
		},
		'Typography': {
			template: 'typography',
		},
		'Position': {
			template: 'position',
		},
		'Plain': 'plain-setting',
		'Responsive fixture': {
			props: 'gap',
			prefix,
			hasBreakpoints: true,
		},
		'Palette fixture': {
			props: 'palette-test',
			isPalette: true,
		},
		'Generated fixture': {
			group: makeGeneratedGroup(prefix),
		},
		'Opacity': {
			template: 'opacity',
		},
	},
	advanced: {
		template: 'advanced',
		'Context loop': {
			template: 'contextLoop',
		},
	},
};

const attributesToStyles = {
	'border-top-width': {},
	'border-bottom-left-radius': {},
	'font-size': {},
	'position-top': {},
	'text-orientation': {},
};

const data = {
	name: 'scan-maxi-fixture',
	copyPasteMapping,
	attributesToStyles,
};

export { copyPasteMapping, attributesToStyles, data };
export default data;
