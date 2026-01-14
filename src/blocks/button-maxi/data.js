/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	createIconSelectors,
	createSelectors,
} from '@extensions/styles/custom-css';
import {
	createIconTransitions,
	getIconWithColor,
	getLastBreakpointAttribute,
} from '@extensions/styles';

import BackgroundControl from '@components/background-control';
import BorderControl from '@components/border-control';
import BoxShadowControl from '@components/box-shadow-control';
import IconControl from '@components/icon-control';
import InfoBox from '@components/info-box';
import MarginControl from '@components/margin-control';
import PaddingControl from '@components/padding-control';
import TypographyControl from '@components/typography-control';

import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getButtonIconStyles,
	getMarginPaddingStyles,
	getTypographyStyles,
} from '@extensions/styles/helpers';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const buttonWrapperClass = ' .maxi-button-block';
const buttonClass = `${buttonWrapperClass}__button`;
const buttonInlineLinkClass = `${buttonClass} a`;
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
		[__('Button text', 'maxi-blocks')]: 'buttonContent',
		[__('Icon', 'maxi-blocks')]: {
			group: {
				[__('Icon', 'maxi-blocks')]: {
					groupAttributes: ['icon', 'iconHover'],
				},
				[__('Icon border', 'maxi-blocks')]: {
					groupAttributes: [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
						'iconBorderHover',
						'iconBorderWidthHover',
						'iconBorderRadiusHover',
					],
				},
				[__('Icon background', 'maxi-blocks')]: {
					groupAttributes: [
						'iconBackground',
						'iconBackgroundColor',
						'iconBackgroundGradient',
						'iconBackgroundHover',
						'iconBackgroundColorHover',
						'iconBackgroundGradientHover',
					],
				},
				[__('Icon padding', 'maxi-blocks')]: {
					groupAttributes: 'Icon padding',
				},
			},
		},
		[__('Alignment', 'maxi-blocks')]: {
			group: {
				[__('Alignment', 'maxi-blocks')]: {
					groupAttributes: 'alignment',
				},
				[__('Text alignment', 'maxi-blocks')]: {
					groupAttributes: 'textAlignment',
				},
			},
		},
		[__('Typography', 'maxi-blocks')]: {
			template: 'typography',
		},
		[__('Button background', 'maxi-blocks')]: {
			template: 'background',
			prefix,
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
			prefix,
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
			prefix,
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
			prefix,
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
			prefix,
		},
	},
	canvas: {
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Background', 'maxi-blocks')]: {
			template: 'blockBackground',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
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
			content: contentClass,
			'text link': buttonInlineLinkClass,
		}),
		...createIconSelectors({ icon: iconClass }),
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
		'text link',
		'before text link',
		'after text link',
		'icon',
		'before icon',
		'after icon',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['canvas', 'button', 'icon'];
const transition = {
	...transitionDefault,
	block: {
		typography: {
			title: __('Typography', 'maxi-blocks'),
			target: contentClass,
			property: false,
			hoverProp: 'typography-status-hover',
		},
		'text link': {
			title: __('Text link', 'maxi-blocks'),
			target: buttonInlineLinkClass,
			property: 'color',
		},
		'button background': {
			title: __('Button background', 'maxi-blocks'),
			target: buttonClass,
			property: 'background',
			hoverProp: `${prefix}background-status-hover`,
		},
		border: {
			title: __('Border', 'maxi-blocks'),
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
			styleAttrs: ['border-style'],
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
				'background-active-media',
				'background-gradient-opacity',
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
const linkElements = ['button', 'canvas'];

const inlineStylesTargets = {
	block: '',
	button: buttonClass,
	content: contentClass,
	icon: iconClass,
	iconPath: `${iconClass} svg path`,
};

const attributesToStyles = {
	'icon-stroke': {
		target: inlineStylesTargets.iconPath,
		property: 'stroke-width',
	},
	'icon-border-top-width': {
		target: inlineStylesTargets.icon,
		property: 'border-top-width',
	},
	'icon-border-right-width': {
		target: inlineStylesTargets.icon,
		property: 'border-right-width',
	},
	'icon-border-bottom-width': {
		target: inlineStylesTargets.icon,
		property: 'border-bottom-width',
	},
	'icon-border-left-width': {
		target: inlineStylesTargets.icon,
		property: 'border-left-width',
	},
	'icon-border-top-left-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-top-left-radius',
	},
	'icon-border-top-right-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-top-right-radius',
	},
	'icon-border-bottom-right-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-bottom-right-radius',
	},
	'icon-border-bottom-left-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-bottom-left-radius',
	},
	'font-size': {
		target: inlineStylesTargets.content,
		property: 'font-size',
	},
	'line-height': {
		target: inlineStylesTargets.content,
		property: 'line-height',
	},
	'letter-spacing': {
		target: inlineStylesTargets.content,
		property: 'letter-spacing',
	},
	'text-indent': {
		target: inlineStylesTargets.content,
		property: 'text-indent',
	},
	'word-spacing': {
		target: inlineStylesTargets.content,
		property: 'word-spacing',
	},
	'bottom-gap': {
		target: inlineStylesTargets.content,
		property: 'margin-bottom',
	},
	'button-margin-top': {
		target: inlineStylesTargets.button,
		property: 'margin-top',
	},
	'button-margin-right': {
		target: inlineStylesTargets.button,
		property: 'margin-right',
	},
	'button-margin-bottom': {
		target: inlineStylesTargets.button,
		property: 'margin-bottom',
	},
	'button-margin-left': {
		target: inlineStylesTargets.button,
		property: 'margin-left',
	},
	'button-padding-top': {
		target: inlineStylesTargets.button,
		property: 'padding-top',
	},
	'button-padding-right': {
		target: inlineStylesTargets.button,
		property: 'padding-right',
	},
	'button-padding-bottom': {
		target: inlineStylesTargets.button,
		property: 'padding-bottom',
	},
	'button-padding-left': {
		target: inlineStylesTargets.button,
		property: 'padding-left',
	},
	'button-border-top-width': {
		target: inlineStylesTargets.button,
		property: 'border-top-width',
	},
	'button-border-right-width': {
		target: inlineStylesTargets.button,
		property: 'border-right-width',
	},
	'button-border-bottom-width': {
		target: inlineStylesTargets.button,
		property: 'border-bottom-width',
	},
	'button-border-left-width': {
		target: inlineStylesTargets.button,
		property: 'border-left-width',
	},
	'button-border-top-left-radius': {
		target: inlineStylesTargets.button,
		property: 'border-top-left-radius',
	},
	'button-border-top-right-radius': {
		target: inlineStylesTargets.button,
		property: 'border-top-right-radius',
	},
	'button-border-bottom-right-radius': {
		target: inlineStylesTargets.button,
		property: 'border-bottom-right-radius',
	},
	'button-border-bottom-left-radius': {
		target: inlineStylesTargets.button,
		property: 'border-bottom-left-radius',
	},
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
	scProps,
	linkElements,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
	scProps,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
