/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import { getCanvasSettings } from '../../extensions/relations';

/**
 * Classnames
 */
const blockClass = ' .maxi-map-block';
const popupClass = `${blockClass}__popup`;
const popupContentClass = `${popupClass}__content`;
const popupTitleClass = `${popupContentClass}__title`;
const popupDescriptionClass = `${popupContentClass}__description`;

/**
 * Data object
 */
const name = 'map-maxi';
const copyPasteMapping = {
	_exclude: ['m_mar'],
	settings: {
		'Configure map': {
			group: {
				'Map provider': 'm_pro',
				'Minium zoom': 'm_mz',
				'Maximum zoom': 'm_mzo',
			},
		},
		'Map marker': {
			group: {
				Markers: 'm_mar',
				'Marker icon': ['m_mic', 'm_ma'],
				'Marker fill colour': {
					props: 'sfi',
					isPalette: true,
				},
				'Marker line colour': {
					props: 'sli',
					isPalette: true,
				},
				'Marker size': {
					props: 's_w',
					hasBreakpoints: true,
				},
			},
		},
		'Map popup text': {
			group: {
				'Title text level': 'm_mhl',
				'Title typography': {
					groupAttributes: 'typography',
				},
				'Description typography': {
					groupAttributes: 'typography',
					prefix: 'd-',
				},
			},
		},
		'Map popup': {
			group: {
				Background: {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'p-',
				},
				'Box shadow': {
					groupAttributes: 'boxShadow',
					prefix: 'p-',
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
				'Map dragging': 'm_dr',
				'Map touch zoom': 'm_tzo',
				'Map double click zoom': 'm_dcz',
				'Map scroll wheel zoom': 'm_swz',
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
const customCss = {
	selectors: {
		...createSelectors({
			map: '',
			popup: popupClass,
			title: popupTitleClass,
			description: popupDescriptionClass,
		}),
	},
	categories: [
		'map',
		'before map',
		'after map',
		'popup',
		'after popup',
		'popup arrow',
		'title',
		'after title',
		'before title',
		'description',
		'after description',
		'before description',
	],
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name, customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
