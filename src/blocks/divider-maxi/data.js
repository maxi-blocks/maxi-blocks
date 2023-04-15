/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import { BoxShadowControl, DividerControl } from '../../components';
import {
	getBoxShadowStyles,
	getDividerStyles,
} from '../../extensions/styles/helpers';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';
import { getPaletteAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Classnames
 */
const dividerWrapperClass = ' .maxi-divider-block';
const dividerClass = `${dividerWrapperClass}__divider`;

const prefix = 'divider-';

/**
 * Data object
 */
const name = 'divider-maxi';
const copyPasteMapping = {
	settings: {
		Alignment: {
			group: {
				'Line orientation': 'line-orientation',
				'Line vertical position': 'line-vertical',
				'Line horizontal position': 'line-horizontal',
			},
			hasBreakpoints: true,
		},
		'Line settings': {
			group: {
				'Line style': 'divider-border-style',
				'Line colour': {
					props: 'divider-border',
					isPalette: true,
				},
				'Line size': ['divider-height', 'divider-width'],
				'Line weight': [
					'divider-border-top-width',
					'divider-border-top-unit',
					'divider-border-right-width',
					'divider-border-right-unit',
				],
			},
			hasBreakpoints: true,
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix: 'divider-',
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
			canvas: '',
			divider: dividerClass,
		}),
	},
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'divider',
		'before divider',
		'after divider',
		'background',
		'background hover',
	],
};
const transition = {
	...transitionDefault,
	block: {
		'box shadow': {
			title: 'Box shadow',
			target: dividerClass,
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			sid: 'dbs',
			label: __('Divider box shadow', 'maxi-blocks'),
			transitionTarget: transition.block['box shadow'].target,
			hoverProp: 'divider-box-shadow-status-hover',
			attrGroupName: 'boxShadow',
			prefix: 'divider-',
			component: props => <BoxShadowControl {...props} />,
			helper: props => getBoxShadowStyles(props),
			target: dividerClass,
			relatedAttributes: [
				'box-shadow-inset',
				'box-shadow-horizontal',
				'box-shadow-horizontal-unit',
				'box-shadow-vertical',
				'box-shadow-vertical-unit',
				'box-shadow-blur',
				'box-shadow-blur-unit',
				'box-shadow-spread',
				'box-shadow-spread-unit',
			],
			forceTempPalette: (attributes, breakpoint, IBAttributes) => {
				const paletteAttributes = getPaletteAttributes({
					obj: IBAttributes,
					prefix: 'box-shadow-',
					breakpoint,
				});

				return Object.values(paletteAttributes).every(attr =>
					isNil(attr)
				);
			},
			forceTempPalettePrefix: 'box-shadow-',
		},
		{
			sid: 'dls',
			label: __('Line settings', 'maxi-blocks'),
			attrGroupName: ['divider', 'size'],
			component: props => <DividerControl {...props} />,
			helper: props =>
				getDividerStyles(props.obj, 'line', props.blockStyle),
			target: dividerClass,
			styleAttrs: ['line-orientation', 'divider-border-style'],
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
