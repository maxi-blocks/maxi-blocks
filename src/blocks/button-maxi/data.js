import { __ } from '@wordpress/i18n';

import { createSelectors } from '../../extensions/styles/custom-css';
import { getIconWithColor } from '../../extensions/styles';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'button-';

/**
 * Classnames
 */
const buttonWrapperClass = ' .maxi-button-block';
const buttonClass = `${buttonWrapperClass}__button`;
const iconClass = `${buttonWrapperClass}__icon`;
const contentClass = `${buttonWrapperClass}__content`;

const data = {
	name: 'button-maxi',
	copyPasteMapping: {
		settings: {
			'Button text': 'buttonContent',
			Icon: {
				group: {
					Icon: { groupAttributes: ['icon', 'iconHover'] },
					'Icon border': {
						groupAttributes: [
							'iconBorder',
							'iconBorderWidth',
							'iconBorderRadius',
							'iconBorderHover',
							'iconBorderWidthHover',
							'iconBorderRadiusHover',
						],
					},
					'Icon background': {
						groupAttributes: [
							'iconBackground',
							'iconBackgroundColor',
							'iconBackgroundGradient',
							'iconBackgroundHover',
							'iconBackgroundColorHover',
							'iconBackgroundGradientHover',
						],
					},
					'Icon padding': {
						groupAttributes: 'Icon padding',
					},
				},
			},
			Alignment: {
				group: {
					Alignment: { groupAttributes: 'alignment' },
					'Text alignment': { groupAttributes: 'textAlignment' },
				},
			},
			Typography: {
				template: 'typography',
			},
			'Button background': {
				template: 'background',
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
		selectors: {
			...createSelectors({
				canvas: {
					label: 'canvas',
					target: '',
				},
				button: {
					label: 'button',
					target: buttonClass,
				},
			}),
			icon: {
				normal: {
					label: 'icon',
					target: iconClass,
				},
				svg: {
					label: "icon's svg",
					target: `${iconClass} svg`,
				},
				insideSvg: {
					label: 'everything inside svg (svg > *)',
					target: `${iconClass} svg > *`,
				},
				path: {
					label: "svg's path",
					target: `${iconClass} svg path`,
				},
				hover: {
					label: 'icon on hover',
					target: `${iconClass}:hover`,
				},
				hoverSvg: {
					label: "icon's svg on hover",
					target: `${iconClass}:hover svg`,
				},
				hoverInsideSvg: {
					label: 'everything inside svg on hover (:hover svg > *)',
					target: `${iconClass}:hover svg > *`,
				},
				hoverPath: {
					label: "svg's path on hover",
					target: `${iconClass}:hover svg path`,
				},
			},
		},
		categories: [
			'canvas',
			'before canvas',
			'after canvas',
			'button',
			'before button',
			'after button',
			'icon',
			'background',
			'background hover',
		],
	},
	transition: {
		...transitionDefault,
		block: {
			typography: {
				title: 'Typography',
				target: contentClass,
				property: 'typography',
				limitless: true,
			},
			'button background': {
				title: 'Button background',
				target: buttonClass,
				property: 'background',
				prefix,
			},
			border: {
				title: 'Border',
				target: buttonClass,
				property: 'border',
				prefix,
			},
			'box shadow': {
				title: 'Box shadow',
				target: buttonClass,
				property: 'box-shadow',
				prefix,
			},
			'icon colour': {
				title: 'Icon colour',
				target: `${iconClass} svg > *`,
				hoverProp: 'icon-status-hover',
				limitless: true,
			},
			'icon width': {
				title: 'Icon width',
				target: `${iconClass} svg`,
				property: ['width', 'height'],
				hoverProp: 'icon-status-hover',
			},
			'icon background': {
				title: 'Icon background',
				target: iconClass,
				property: 'background',
				hoverProp: 'icon-status-hover',
			},
			'icon border': {
				title: 'Icon border',
				target: iconClass,
				property: 'border',
				hoverProp: 'icon-status-hover',
			},
		},
	},
	get interactionBuilderSettings() {
		return [
			{
				label: __('Button icon', 'maxi-blocks'),
				attrGroupName: [
					'icon',
					'iconBackground',
					'iconBackgroundGradient',
					'iconBackgroundColor',
					'iconBorder',
					'iconBorderWidth',
					'iconBorderRadius',
					'iconPadding',
					'typography',
				],
				component: props => {
					const { attributes, blockAttributes } = props;
					const { svgType, 'icon-content': iconContent } = attributes;
					const { 'icon-inherit': iconInherit } = blockAttributes;
					return iconContent ? (
						<Controls.IconControl
							{...props}
							svgType={svgType}
							isInteractionBuilder
							getIconWithColor={args =>
								getIconWithColor(attributes, args)
							}
							disableIconInherit={!iconInherit}
						/>
					) : (
						<Controls.InfoBox
							message={__(
								'Add button icon to be able to use this control'
							)}
						/>
					);
				},
				helper: props => styleHelpers.getButtonIconStyles(props),
			},
			{
				label: __('Button typography', 'maxi-blocks'),
				attrGroupName: 'typography',
				component: props => (
					<Controls.TypographyControl
						{...props}
						hideAlignment
						disableCustomFormats
					/>
				),
				helper: props =>
					styleHelpers.getTypographyStyles({
						...props,
						textLevel: 'button',
					}),
				target: '.maxi-button-block__content',
			},
			{
				label: __('Button border', 'maxi-blocks'),
				attrGroupName: ['border', 'borderWidth', 'borderRadius'],
				prefix: 'button-',
				component: props => <Controls.BorderControl {...props} />,
				helper: props => styleHelpers.getBorderStyles(props),
				target: '.maxi-button-block__button',
			},
			{
				label: __('Button background', 'maxi-blocks'),
				attrGroupName: [
					'background',
					'backgroundColor',
					'backgroundGradient',
				],
				prefix: 'button-',
				component: props => (
					<Controls.BackgroundControl
						{...props}
						disableImage
						disableVideo
						disableSVG
						disableClipPath
					/>
				),
				helper: props =>
					styleHelpers.getBackgroundStyles({
						...props,
						...props.obj,
						isButton: true,
					}).background,
				target: '.maxi-button-block__button',
			},
			{
				label: __('Button box shadow', 'maxi-blocks'),
				attrGroupName: 'boxShadow',
				prefix: 'button-',
				component: props => <Controls.BoxShadowControl {...props} />,
				helper: props => styleHelpers.getBoxShadowStyles(props),
				target: '.maxi-button-block__button',
			},
			{
				label: __('Button margin/padding', 'maxi-blocks'),
				attrGroupName: ['margin', 'padding'],
				prefix: 'button-',
				component: props => (
					<>
						<Controls.MarginControl {...props} />
						<Controls.PaddingControl {...props} />
					</>
				),
				helper: props => styleHelpers.getMarginPaddingStyles(props),
				target: '.maxi-button-block__button',
			},
			...getCanvasSettings(this),
		];
	},
};

const { copyPasteMapping, customCss, transition, interactionBuilderSettings } =
	data;

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
