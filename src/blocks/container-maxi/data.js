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
	const firstLetter = position[0];
	return {
		[`${capitalize(position)} shape divider`]: {
			group: {
				'Divider status': `sd${firstLetter}.s`,
				'Divider style': `sd${firstLetter}_ss`,
				'Divider opacity': `sd${firstLetter}_o`,
				'Divider color': [
					`sd${firstLetter}_pc`,
					`sd${firstLetter}_cc`,
					`sd${firstLetter}_ps`,
				],
				'Divider height': `sd${firstLetter}_h`,
				'Divider height unit': `sd${firstLetter}_h.u`,
				'Divider scroll effect': `sd${firstLetter}_ef.s`,
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
			ct: '',
		}),
		't sh d': {
			n: {
				label: 'top shape divider',
				target: ' .maxi-shape-divider__top',
			},
			h: {
				label: 'top shape divider on hover',
				target: ' .maxi-shape-divider__top:hover',
			},
		},
		'bot sh d': {
			n: {
				label: 'bottom shape divider',
				target: ' .maxi-shape-divider__bottom',
			},
			h: {
				label: 'bottom shape divider on hover',
				target: ' .maxi-shape-divider__bottom:hover',
			},
		},
	},
	categories: ['ct', 'be ct', 'a ct', 't sh d', 'bot sh d', 'bg', 'bg h'],
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
