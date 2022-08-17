import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

const data = {
	name: 'row-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
		selectors: createSelectors({
			row: {
				label: 'row',
				target: '',
			},
		}),
		categories: [
			'row',
			'before row',
			'after row',
			'background',
			'background hover',
		],
	},
	get interactionBuilderSettings() {
		return getCanvasSettings(this);
	},
};

const { copyPasteMapping, customCss, interactionBuilderSettings } = data;

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
