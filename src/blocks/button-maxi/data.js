/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import {
	createIconTransitions,
	getIconWithColor,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
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
import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getButtonIconStyles,
	getMarginPaddingStyles,
	getTypographyStyles,
} from '../../extensions/styles/helpers';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const buttonWrapperClass = ' .maxi-button-block';
const buttonClass = `${buttonWrapperClass}__button`;
const iconClass = `${buttonWrapperClass}__icon`;
const contentClass = `${buttonWrapperClass}__content`;

const prefix = 'button-';

/**
 * Data object
 */
const name = 'button-maxi';
const copyPasteMapping = {
	_exclude: ['buttonContent', 'icon-content'],
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
		'before icon': {
			normal: {
				label: 'icon ::before',
				target: `${iconClass}::before`,
			},
			hover: {
				label: 'icon ::before on hover',
				target: `${iconClass}:hover::before`,
			},
		},
		'after icon': {
			normal: {
				label: 'icon ::after',
				target: `${iconClass}::after`,
			},
			hover: {
				label: 'icon ::after on hover',
				target: `${iconClass}:hover::after`,
			},
		},
		content: {
			normal: {
				label: 'content',
				target: `${contentClass}`,
			},
			hover: {
				label: 'content on hover',
				target: `${contentClass}:hover`,
			},
		},
		'before content': {
			normal: {
				label: 'content ::before',
				target: `${contentClass}::before`,
			},
			hover: {
				label: 'content ::before on hover',
				target: `${contentClass}:hover::before`,
			},
		},
		'after content': {
			normal: {
				label: 'content ::after',
				target: `${contentClass}::after`,
			},
			hover: {
				label: 'content ::after on hover',
				target: `${contentClass}:hover::after`,
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
		'content',
		'before content',
		'after content',
		'icon',
		'before icon',
		'after icon',
		'background',
		'background hover',
	],
};
const transition = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: contentClass,
			property: false,
			hoverProp: 'typography-status-hover',
		},
		'button background': {
			title: 'Button background',
			target: buttonClass,
			property: 'background',
			hoverProp: `${prefix}background-status-hover`,
		},
		border: {
			title: 'Border',
			target: buttonClass,
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}border-status-hover`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: buttonClass,
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
		...createIconTransitions({
			target: ' .maxi-button-block__icon',
			prefix: 'icon-',
			titlePrefix: 'icon',
		}),
	},
};
const interactionBuilderSettings = {
	block: [
		{
			sid: 'bi',
			label: __('Button icon', 'maxi-blocks'),
			transitionTarget: [
				transition.block['icon colour'].target,
				transition.block['icon width'].target,
				transition.block['icon background'].target,
				transition.block['icon border'].target,
			],
			hoverProp: 'icon-status-hover',
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
					<IconControl
						{...props}
						svgType={svgType}
						isIB
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
			styleAttrs: ['icon-content', 'icon-background-active-media'],
		},
		{
			sid: 'bty',
			label: __('Button typography', 'maxi-blocks'),
			transitionTarget: transition.block.typography.target,
			transitionTrigger: buttonClass,
			hoverProp: 'typography-status-hover',
			attrGroupName: 'typography',
			component: props => (
				<TypographyControl
					{...props}
					hideAlignment
					disableCustomFormats
					forceIndividualChanges
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
			sid: 'bb',
			label: __('Button border', 'maxi-blocks'),
			transitionTarget: transition.block.border.target,
			hoverProp: 'button-border-status-hover',
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'button-',
			component: props => <BorderControl {...props} />,
			helper: props => getBorderStyles(props),
			target: '.maxi-button-block__button',
			forceTempPalette: (attributes, breakpoint, IBAttributes) => {
				if ('button-border-style' in IBAttributes) return false;

				const borderStyle = getLastBreakpointAttribute({
					target: 'button-border-style',
					attributes,
					breakpoint,
				});

				return borderStyle && borderStyle === 'none';
			},
			forceTempPalettePrefix: 'button-border-',
			styleAttrs: ['button-border-style'],
		},
		{
			sid: 'bbg',
			label: __('Button background', 'maxi-blocks'),
			transitionTarget: transition.block['button background'].target,
			hoverProp: 'button-background-status-hover',
			attrGroupName: [
				'background',
				'backgroundColor',
				'backgroundGradient',
			],
			prefix: 'button-',
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
			styleAttrs: [
				'button-background-active-media',
				'button-background-gradient-opacity',
			],
		},
		{
			sid: 'bbs',
			label: __('Button box shadow', 'maxi-blocks'),
			transitionTarget: transition.block['box shadow'].target,
			hoverProp: 'button-box-shadow-status-hover',
			attrGroupName: 'boxShadow',
			prefix: 'button-',
			component: props => <BoxShadowControl {...props} />,
			helper: props => getBoxShadowStyles(props),
			target: '.maxi-button-block__button',
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
				'box-shadow-palette-color',
				'box-shadow-color',
				'box-shadow-palette-status',
				'box-shadow-palette-opacity',
			],
		},
		{
			sid: 'bmp',
			label: __('Button margin/padding', 'maxi-blocks'),
			attrGroupName: ['margin', 'padding'],
			prefix: 'button-',
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
	'button-padding-sync-xxl': 'axis',
	'button-padding-top-xxl': '23',
	'button-padding-right-xxl': '55',
	'button-padding-bottom-xxl': '23',
	'button-padding-left-xxl': '55',
};
const scProps = {
	scElements: [
		'hover-border-color-global',
		'hover-border-color-all',
		'hover-color-global',
		'hover-color-all',
		'hover-background-color-global',
		'hover-background-color-all',
	],
	scType: 'button',
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
	scProps,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
	scProps,
};
export default data;
