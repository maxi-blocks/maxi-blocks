/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import { BoxShadowControl, DividerControl } from '../../components';
import {
	getBoxShadowStyles,
	getDividerStyles,
} from '../../extensions/styles/helpers';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import { transitionDefault } from '../../extensions/attributes/transitions';

/**
 * Classnames
 */
const dividerWrapperClass = ' .maxi-divider-block';
const dividerClass = `${dividerWrapperClass}__divider`;

const prefix = 'di-';

/**
 * Data object
 */
const name = 'divider-maxi';
const copyPasteMapping = {
	settings: {
		Alignment: {
			group: {
				'Line orientation': '_lo',
				'Line vertical position': '_lv',
				'Line horizontal position': '_lh',
			},
			hasBreakpoints: true,
		},
		'Line settings': {
			group: {
				'Line style': 'di-bo_s',
				'Line colour': {
					props: 'di-bo',
					isPalette: true,
				},
				'Line size': ['di_h', 'di_w'],
				'Line weight': ['di-bo.t', 'di-bo.t.u', 'di-bo.r', 'di-bo.r.u'],
			},
			hasBreakpoints: true,
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix: 'di-',
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
			c: '',
			d: dividerClass,
		}),
	},
	categories: ['c', 'be c', 'a c', 'd', 'be d', 'a d', 'bg', 'bg h'],
};
const transition = {
	...transitionDefault,
	b: {
		bs: {
			ti: 'Box shadow',
			ta: dividerClass,
			p: 'box-shadow',
			hp: `${prefix}bs.sh`,
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			label: __('Divider box shadow', 'maxi-blocks'),
			transitionTarget: transition.b.bs.ta,
			hoverProp: 'di-bs.sh',
			attrGroupName: 'boxShadow',
			prefix: 'di-',
			component: props => <BoxShadowControl {...props} />,
			helper: props => getBoxShadowStyles(props),
			target: dividerClass,
		},
		{
			label: __('Line settings', 'maxi-blocks'),
			attrGroupName: ['divider', 'size'],
			component: props => <DividerControl {...props} />,
			helper: props => getDividerStyles(props.obj, 'line', props._bs),
			target: dividerClass,
		},
	],
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
