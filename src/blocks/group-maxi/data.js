import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

const data = {
	name: 'group-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
		selectors: createSelectors({
			group: {
				label: 'group',
				target: '',
			},
		}),
		categories: [
			'group',
			'before group',
			'after group',
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
