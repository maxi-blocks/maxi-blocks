/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	BackgroundControl,
	BorderControl,
	BoxShadowControl,
	IconControl,
	InfoBox,
	MarginControl,
	PaddingControl,
	TypographyControl,
} from '../../components';
import { getAttributesValue } from '../../extensions/attributes';
import { createSelectors } from '../../extensions/attributes/custom-css';
import {
	createIconTransitions,
	transitionDefault,
} from '../../extensions/attributes/transitions';
import {
	getAdvancedSettings,
	getCanvasSettings,
} from '../../extensions/relations';
import { getIconWithColor } from '../../extensions/styles';
import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getButtonIconStyles,
	getMarginPaddingStyles,
	getTypographyStyles,
} from '../../extensions/styles/helpers';

/**
 * Classnames
 */
const buttonWrapperClass = ' .maxi-button-block';
const buttonClass = `${buttonWrapperClass}__button`;
const iconClass = `${buttonWrapperClass}__icon`;
const contentClass = `${buttonWrapperClass}__content`;

const prefix = 'bt-';

/**
 * Data object
 */
const name = 'button-maxi';
const copyPasteMapping = {
	_exclude: ['i_c', '_bc'],
	settings: {
		'Button text': '_bc',
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
					groupAttributes: 'iconPadding',
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
};
const customCss = {
	selectors: {
		...createSelectors({
			canvas: '',
			button: buttonClass,
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
};
const transition = {
	...transitionDefault,
	b: {
		ty: {
			ti: 'Typography',
			ta: contentClass,
			p: false,
			hp: 't.sh',
		},
		'bt bg': {
			ti: 'Button background',
			ta: buttonClass,
			p: 'background',
			hp: `${prefix}b.sh`,
		},
		bo: {
			ti: 'Border',
			ta: buttonClass,
			p: ['border', 'border-radius'],
			hp: `${prefix}bo.sh`,
		},
		bs: {
			ti: 'Box shadow',
			ta: buttonClass,
			p: 'box-shadow',
			hp: `${prefix}bs.sh`,
		},
		...createIconTransitions({
			target: ' .maxi-button-block__icon',
			prefix: 'i-',
			titlePrefix: 'icon',
			shortPrefix: 'i',
		}),
	},
};
const interactionBuilderSettings = {
	block: [
		{
			label: __('Button icon', 'maxi-blocks'),
			transitionTarget: [
				transition.b['i co'].ta,
				transition.b['i w'].ta,
				transition.b['i bg'].ta,
				transition.b['i bo'].ta,
			],
			hoverProp: 'i.sh',
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
				const [svgType, iconContent] = getAttributesValue({
					target: ['_st', 'i_c'],
					props: attributes,
				});

				const iconInherit = getAttributesValue({
					target: 'i_i',
					props: blockAttributes,
				});

				return iconContent ? (
					<IconControl
						{...props}
						svgType={svgType}
						isInteractionBuilder
						getIconWithColor={args =>
							getIconWithColor(attributes, args)
						}
						disableIconInherit={!iconInherit}
					/>
				) : (
					<InfoBox
						message={__(
							'Add button icon to be able to use this control'
						)}
					/>
				);
			},
			helper: props =>
				getButtonIconStyles({
					...props,
					target: iconClass,
					wrapperTarget: buttonClass,
				}),
		},
		{
			label: __('Button typography', 'maxi-blocks'),
			transitionTarget: transition.b.ty.ta,
			transitionTrigger: buttonClass,
			hoverProp: 't.sh',
			attrGroupName: 'typography',
			component: props => (
				<TypographyControl
					{...props}
					hideAlignment
					disableCustomFormats
				/>
			),
			helper: props =>
				getTypographyStyles({
					...props,
					textLevel: 'button',
				}),
			target: '.maxi-button-block__content',
		},
		{
			label: __('Button border', 'maxi-blocks'),
			transitionTarget: transition.b.bo.ta,
			hoverProp: 'bt-bo.sh',
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'bt-',
			component: props => <BorderControl {...props} />,
			helper: props => getBorderStyles(props),
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button background', 'maxi-blocks'),
			transitionTarget: transition.b['bt bg'].ta,
			hoverProp: 'bt-b.sh',
			attrGroupName: [
				'background',
				'backgroundColor',
				'backgroundGradient',
			],
			prefix: 'bt-',
			component: props => (
				<BackgroundControl
					{...props}
					disableImage
					disableVideo
					disableSVG
					disableClipPath
				/>
			),
			helper: props =>
				getBackgroundStyles({
					...props,
					...props.obj,
					isButton: true,
				}).background,
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button box shadow', 'maxi-blocks'),
			transitionTarget: transition.b.bs.ta,
			hoverProp: 'bt-bs.sh',
			attrGroupName: 'boxShadow',
			prefix: 'bt-',
			component: props => <BoxShadowControl {...props} />,
			helper: props => getBoxShadowStyles(props),
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button margin/padding', 'maxi-blocks'),
			attrGroupName: ['margin', 'padding'],
			prefix: 'bt-',
			component: props => (
				<>
					<MarginControl {...props} />
					<PaddingControl {...props} />
				</>
			),
			helper: props => getMarginPaddingStyles(props),
			target: '.maxi-button-block__button',
		},
	],
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};
const maxiAttributes = {
	'bt_p.sy-xxl': 'axis',
	'bt_p.t-xxl': '23',
	'bt_p.r-xxl': '55',
	'bt_p.b-xxl': '23',
	'bt_p.l-xxl': '55',
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
};
export default data;
