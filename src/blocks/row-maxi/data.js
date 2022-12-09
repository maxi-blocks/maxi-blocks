/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import { getCanvasSettings } from '../../extensions/relations';

/**
 * Data object
 */
const name = 'row-maxi';
const copyPasteMapping = {
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
const customCss = {
	selectors: createSelectors({
		row: '',
	}),
	categories: [
		'row',
		'before row',
		'after row',
		'background',
		'background hover',
	],
};
const interactionBuilderSettings = {
	block: getCanvasSettings({ name, customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
