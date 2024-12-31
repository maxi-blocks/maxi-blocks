/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const shapeDividerCopyPasteGenerator = position => {
	return {
		[`${capitalize(position)} shape divider`]: {
			group: {
				'Divider status': `shape-divider-${position}-status`,
				'Divider style': `shape-divider-${position}-shape-style`,
				'Divider opacity': `shape-divider-${position}-opacity`,
				'Divider color': [
					`shape-divider-${position}-palette-color`,
					`shape-divider-${position}-color`,
					`shape-divider-${position}-palette-status`,
				],
				'Divider height': `shape-divider-${position}-height`,
				'Divider height unit': `shape-divider-${position}-height-unit`,
				'Divider scroll effect': `shape-divider-${position}-effects-status`,
			},
		},
	};
};

/**
 * Data object
 */
const name = 'container-maxi';
const copyPasteMapping = {
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
		...shapeDividerCopyPasteGenerator('top'),
		...shapeDividerCopyPasteGenerator('bottom'),
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
const customCss = {
	selectors: {
		...createSelectors({
			container: '',
		}),
		'top shape divider': {
			normal: {
				label: 'top shape divider',
				target: ' .maxi-shape-divider__top',
			},
			hover: {
				label: 'top shape divider on hover',
				target: ' .maxi-shape-divider__top:hover',
			},
		},
		'bottom shape divider': {
			normal: {
				label: 'bottom shape divider',
				target: ' .maxi-shape-divider__bottom',
			},
			hover: {
				label: 'bottom shape divider on hover',
				target: ' .maxi-shape-divider__bottom:hover',
			},
		},
	},
	categories: [
		'container',
		'before container',
		'after container',
		'top shape divider',
		'bottom shape divider',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = [
	'container',
	'top shape divider',
	'bottom shape divider',
];
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};
const maxiAttributes = {
	'max-width-xxl': '1690',
	'max-width-xl': '1170',
	'max-width-l': '90',
	'max-width-unit-xxl': 'px',
	'max-width-unit-xl': 'px',
	'max-width-unit-l': '%',
	'width-l': '1170',
	'width-m': '1000',
	'width-s': '700',
	'width-xs': '460',
	'width-unit-l': 'px',
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	maxiAttributes,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	maxiAttributes,
	ariaLabelsCategories,
};
export default data;
