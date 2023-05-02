/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const shapeDividerCopyPasteGenerator = position => {
	return {
		[`${capitalize(position)} shape divider`]: {
			group: {
				'Divider status': `sd${position[0]}.s`,
				'Divider style': `sd${position[0]}_ss`,
				'Divider opacity': `sd${position[0]}_o`,
				'Divider color': [
					`sd${position[0]}_pc`,
					`sd${position[0]}_cc`,
					`sd${position[0]}_ps`,
				],
				'Divider height': `sd${position[0]}_h`,
				'Divider height unit': `sd${position[0]}_h.u`,
				'Divider scroll effect': `sd${position[0]}_ef.s`,
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
				'Show arrow': 'ar.s',
				'Arrow side': 'ar_sid',
				'Arrow position': 'ar_pos',
				'Arrow size': 'ar_w',
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
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};
const maxiAttributes = {
	'mw-xxl': '1690',
	'mw-xl': '1170',
	'mw-l': '90',
	'mwu-xxl': 'px',
	'mwu-xl': 'px',
	'mwu-l': '%',
	'w-l': '1170',
	'w-m': '1000',
	'w-s': '700',
	'w-xs': '460',
	'wu-l': 'px',
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
};
export default data;
