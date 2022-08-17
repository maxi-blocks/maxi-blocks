import { __ } from '@wordpress/i18n';

import { createSelectors } from '../../extensions/styles/custom-css';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const dividerWrapperClass = ' .maxi-divider-block';
const dividerClass = `${dividerWrapperClass}__divider`;

const prefix = 'divider-';

const data = {
	name: 'divider-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
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
	},
	transition: {
		...transitionDefault,
		block: {
			'box shadow': {
				title: 'Box shadow',
				target: dividerClass,
				property: 'box-shadow',
				prefix,
			},
		},
	},
	get interactionBuilderSettings() {
		return [
			{
				label: __('Divider box shadow', 'maxi-blocks'),
				attrGroupName: 'boxShadow',
				prefix: 'divider-',
				component: props => <Controls.BoxShadowControl {...props} />,
				helper: props => styleHelpers.getBoxShadowStyles(props),
				target: dividerClass,
			},
			{
				label: __('Line settings', 'maxi-blocks'),
				attrGroupName: ['divider', 'size'],
				component: props => <Controls.DividerControl {...props} />,
				helper: props =>
					styleHelpers.getDividerStyles(
						props.obj,
						'line',
						props.blockStyle
					),
				target: dividerClass,
			},
			...getCanvasSettings(this),
		];
	},
};

const { copyPasteMapping, customCss, transition, interactionBuilderSettings } =
	data;

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
