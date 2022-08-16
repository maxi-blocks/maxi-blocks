import { __ } from '@wordpress/i18n';

import { createSelectors } from '../../extensions/styles/custom-css';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-svg-icon-block';
const iconClass = `${blockClass}__icon`;

const prefix = 'svg-';

const data = {
	copyPasteMapping: {
		settings: {
			'Icon content': ['svgType', 'content'],
			Alignment: {
				groupAttributes: 'alignment',
			},
			'Icon alt': {
				group: {
					'Alt title': 'altTitle',
					'Alt description': 'altDescription',
				},
			},
			'Icon colour': {
				group: {
					'Icon hover status': 'svg-status-hover',
					'Fill colour': { props: 'svg-fill', isPalette: true },
					'Line colour': { label: 'svg-line', isPalette: true },
					'Fill hover colour': {
						props: 'svg-fill',
						isPalette: true,
						isHover: true,
					},
					'Line hover colour': {
						props: 'svg-line',
						isPalette: true,
						isHover: true,
					},
				},
			},
			'Icon line width': {
				props: 'svg-stroke',
				hasBreakpoints: true,
			},
			'Icon background': {
				group: {
					'Background colour': {
						groupAttributes: ['background', 'backgroundColor'],
					},
					'Background color hover': {
						groupAttributes: ['background', 'backgroundColor'],
					},
					'Background gradient': {
						groupAttributes: ['background', 'backgroundGradient'],
					},
					'Background gradient hover': {
						groupAttributes: [
							'backgroundHover',
							'backgroundGradientHover',
						],
					},
				},
				prefix,
			},
			Border: {
				template: 'border',
				prefix,
			},
			'Box shadow': {
				template: 'boxShadow',
				prefix,
			},
			Size: {
				template: 'size',
				prefix,
			},
			'Margin/Padding': {
				template: 'marginPadding',
				prefix,
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
		selectors: createSelectors({
			canvas: {
				label: 'canvas',
				target: '',
			},
			svg: {
				label: 'svg',
				target: `${iconClass} svg`,
			},
		}),
		categories: [
			'canvas',
			'before canvas',
			'after canvas',
			'svg',
			'background',
			'background hover',
		],
	},
	transition: {
		...transitionDefault,
		block: {
			border: {
				title: 'Border',
				target: iconClass,
				property: 'border',
				prefix,
			},
			'box shadow': {
				title: 'Box shadow',
				target: iconClass,
				property: 'box-shadow',
				prefix,
			},
		},
	},
	get interactionBuilderSettings() {
		delete this.interactionBuilderSettings;
		this.interactionBuilderSettings = [
			{
				label: __('Icon colour'),
				attrGroupName: 'svg',
				component: props => {
					const { attributes, onChange } = props;
					const { blockStyle, content, svgType } = attributes;

					return (
						<Controls.SvgColorControl
							{...props}
							onChangeFill={onChange}
							onChangeStroke={onChange}
							blockStyle={blockStyle}
							content={content}
							svgType={svgType}
							disableHover
						/>
					);
				},
				helper: props =>
					styleHelpers.getSVGStyles({
						...props,
						target: ' .maxi-svg-icon-block__icon',
						prefix: 'svg-',
					}),
			},
			{
				label: __('Icon line width', 'maxi-blocks'),
				attrGroupName: 'svg',
				component: props => {
					const { attributes } = props;
					const { content } = attributes;

					return (
						<Controls.SvgStrokeWidthControl
							{...props}
							content={content}
							prefix='svg-'
						/>
					);
				},
				helper: props =>
					styleHelpers.getSVGStyles({
						...props,
						target: ' .maxi-svg-icon-block__icon',
						prefix: 'svg-',
					}),
			},
			{
				label: __('Icon background', 'maxi-blocks'),
				attrGroupName: [
					'background',
					'backgroundColor',
					'backgroundGradient',
				],
				prefix: 'svg-',
				component: props => (
					<Controls.BackgroundControl
						{...props}
						disableImage
						disableVideo
						disableClipPath
						disableSVG
					/>
				),
				helper: props =>
					styleHelpers.getBackgroundStyles({ ...props, ...props.obj })
						.background,
				target: ' .maxi-svg-icon-block__icon',
			},
			{
				label: __('Icon border', 'maxi-blocks'),
				attrGroupName: ['border', 'borderWidth', 'borderRadius'],
				prefix: 'svg-',
				component: props => <Controls.BorderControl {...props} />,
				helper: props => styleHelpers.getBorderStyles(props),
				target: ' .maxi-svg-icon-block__icon',
			},
			...getCanvasSettings(this),
		];
		return this.interactionBuilderSettings;
	},
};

const { copyPasteMapping, customCss, transition, interactionBuilderSettings } =
	data;

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
