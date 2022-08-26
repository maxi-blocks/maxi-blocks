/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

/**
 * Data object
 */
const name = 'pane-maxi';
const copyPasteMapping = {
	settings: {
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
const customCss = {
	selectors: {
		...createSelectors({
			pane: '',
		}),
		header: {
			normal: {
				label: 'pane header',
				target: ' .maxi-pane-block__header',
			},
			hover: {
				label: 'pane header on hover',
				target: ' .maxi-pane-block__header:hover',
			},
		},
		content: {
			normal: {
				label: 'pane content',
				target: ' .maxi-pane-block__content',
			},
			hover: {
				label: 'pane content on hover',
				target: ' .maxi-pane-block__content:hover',
			},
		},
	},
	categories: [
		'pane',
		'before pane',
		'after pane',
		'header',
		'content',
		'background',
		'background hover',
	],
};
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = { name, copyPasteMapping, customCss, interactionBuilderSettings };

export { copyPasteMapping, customCss };
export default data;
