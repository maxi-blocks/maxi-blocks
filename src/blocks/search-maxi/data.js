/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { createIconTransitions } from '@extensions/styles';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';

/**
 * Classnames
 */
const blockClass = ' .maxi-search-block';
const buttonClass = `${blockClass}__button`;
const inputClass = `${blockClass}__input`;
const defaultIconClass = `${buttonClass}__default-icon`;
const closeIconClass = `${buttonClass}__close-icon`;

const buttonPrefix = 'button-';
const closeIconPrefix = 'close-';
const inputPrefix = 'input-';

/**
 * Data object
 */
const name = 'search-maxi';
const prefixes = {
	buttonPrefix,
	closeIconPrefix,
	inputPrefix,
};
const copyPasteMapping = {
	_exclude: ['icon-content', 'close-icon-content', 'placeholder'],
	block: {
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
	},
	button: {
		[__('Skin', 'maxi-blocks')]: 'skin',
		[__('Button', 'maxi-blocks')]: {
			group: {
				[__('Skin', 'maxi-blocks')]: 'buttonSkin',
				[__('Button text', 'maxi-blocks')]: 'buttonContent',
				[__('Button text close', 'maxi-blocks')]: 'buttonContentClose',
			},
		},
		[__('Icon', 'maxi-blocks')]: {
			groupAttributes: ['icon', 'iconHover'],
		},
		[__('Close icon', 'maxi-blocks')]: {
			groupAttributes: ['icon', 'iconHover'],
			prefix: closeIconPrefix,
		},
		[__('Typography', 'maxi-blocks')]: {
			template: 'typography',
			prefix: buttonPrefix,
		},
		[__('Button background', 'maxi-blocks')]: {
			template: 'background',
			prefix: buttonPrefix,
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
			prefix: buttonPrefix,
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
			prefix: buttonPrefix,
		},
	},
	input: {
		[__('Typography', 'maxi-blocks')]: {
			template: 'typography',
			prefix: inputPrefix,
		},
		[__('Placeholder', 'maxi-blocks')]: {
			group: {
				[__('Placeholder text', 'maxi-blocks')]: 'placeholder',
				[__('Placeholder colour', 'maxi-blocks')]: {
					groupAttributes: 'placeholderColor',
				},
			},
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
			prefix: inputPrefix,
		},
		[__('Input background', 'maxi-blocks')]: {
			template: 'background',
			prefix: inputPrefix,
		},
		[__('Padding', 'maxi-blocks')]: {
			groupAttributes: 'padding',
			prefix: inputPrefix,
		},
	},
	advanced: {
		template: 'advanced',
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
		},
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			block: '',
			button: buttonClass,
			input: inputClass,
		}),
		'placeholder input': {
			normal: {
				label: __('input ::placeholder', 'maxi-blocks'),
				target: ' .maxi-search-block__input::placeholder',
			},
			hover: {
				label: __('input ::placeholder on hover', 'maxi-blocks'),
				target: ' .maxi-search-block__input:hover::placeholder',
			},
		},
		icon: {
			normal: {
				label: __('icon', 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon',
			},
			svg: {
				label: __("icon's svg", 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon svg',
			},
			insideSvg: {
				label: __('everything inside svg (svg > *)', 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon svg > *',
			},
			path: {
				label: __("svg's path", 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon svg path',
			},
			hover: {
				label: __('icon on hover', 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon:hover',
			},
			hoverSvg: {
				label: __("icon's svg on hover", 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon:hover svg',
			},
			hoverInsideSvg: {
				label: __(
					'everything inside svg on hover (:hover svg > *)',
					'maxi-blocks'
				),
				target: ' .maxi-search-block__button__default-icon:hover svg > *',
			},
			hoverPath: {
				label: __("svg's path on hover", 'maxi-blocks'),
				target: ' .maxi-search-block__button__default-icon:hover svg path',
			},
		},
		'close icon': {
			normal: {
				label: __('icon', 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon',
			},
			svg: {
				label: __("icon's svg", 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon svg',
			},
			insideSvg: {
				label: __('everything inside svg (svg > *)', 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon svg > *',
			},
			path: {
				label: __("svg's path", 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon svg path',
			},
			hover: {
				label: __('icon on hover', 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon:hover',
			},
			hoverSvg: {
				label: __("icon's svg on hover", 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon:hover svg',
			},
			hoverInsideSvg: {
				label: __(
					'everything inside svg on hover (:hover svg > *)',
					'maxi-blocks'
				),
				target: ' .maxi-search-block__button__close-icon:hover svg > *',
			},
			hoverPath: {
				label: __("svg's path on hover", 'maxi-blocks'),
				target: ' .maxi-search-block__button__close-icon:hover svg path',
			},
		},
	},
	categories: [
		'block',
		'before block',
		'after block',
		'button',
		'before button',
		'after button',
		'input',
		'before input',
		'after input',
		'placeholder input',
		'icon',
		'close icon',
	],
};
const ariaLabelsCategories = ['block', 'button', 'input', 'icon', 'close icon'];
const transition = {
	block: {
		border: {
			title: __('Border', 'maxi-blocks'),
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
			hoverProp: 'border-status-hover',
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: '',
			property: 'box-shadow',
			hoverProp: 'box-shadow-status-hover',
		},
		opacity: {
			title: __('Opacity', 'maxi-blocks'),
			target: '',
			property: 'opacity',
			hoverProp: 'opacity-status-hover',
		},
	},
	button: {
		...createIconTransitions({
			target: defaultIconClass,
			prefix: 'icon-',
			titlePrefix: 'icon',
			disableBackground: true,
			disableBorder: true,
		}),
		...createIconTransitions({
			target: closeIconClass,
			prefix: `${closeIconPrefix}icon-`,
			titlePrefix: 'close icon',
			disableBackground: true,
			disableBorder: true,
		}),
		typography: {
			title: __('Typography', 'maxi-blocks'),
			target: `${buttonClass}__content`,
			property: false,
			hoverProp: `${buttonPrefix}typography-status-hover`,
		},
		border: {
			title: __('Border', 'maxi-blocks'),
			target: buttonClass,
			property: ['border', 'border-radius'],
			prefix: buttonPrefix,
		},
		'button background': {
			title: __('button background', 'maxi-blocks'),
			target: buttonClass,
			property: 'background',
			hoverProp: `${buttonPrefix}background-status-hover`,
		},
	},
	input: {
		typography: {
			title: __('Typography', 'maxi-blocks'),
			target: inputClass,
			property: false,
			hoverProp: `${inputPrefix}typography-status-hover`,
		},
		border: {
			title: __('Border', 'maxi-blocks'),
			target: inputClass,
			property: ['border', 'border-radius'],
			hoverProp: `${inputPrefix}border-status-hover`,
		},
		'input background': {
			title: __('Input background', 'maxi-blocks'),
			target: inputClass,
			property: 'background',
			hoverProp: `${inputPrefix}background-status-hover`,
		},
		'icon reveal appear': {
			title: __('Icon reveal appear', 'maxi-blocks'),
			target: inputClass,
			property: ['opacity', 'visibility', 'width'],
		},
	},
};
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const inlineStylesTargets = {
	block: '',
	button: buttonClass,
	buttonContent: `${buttonClass}__content`,
	input: inputClass,
	icon: defaultIconClass,
	closeIcon: closeIconClass,
	iconSvg: `${defaultIconClass} svg`,
	closeIconSvg: `${closeIconClass} svg`,
	iconPath: `${defaultIconClass} svg path`,
	closeIconPath: `${closeIconClass} svg path`,
};

const attributesToStyles = {
	'input-font-size': {
		target: inlineStylesTargets.input,
		property: 'font-size',
	},
	'input-line-height': {
		target: inlineStylesTargets.input,
		property: 'line-height',
	},
	'input-letter-spacing': {
		target: inlineStylesTargets.input,
		property: 'letter-spacing',
	},
	'input-text-indent': {
		target: inlineStylesTargets.input,
		property: 'text-indent',
	},
	'input-word-spacing': {
		target: inlineStylesTargets.input,
		property: 'word-spacing',
	},
	'input-bottom-gap': {
		target: inlineStylesTargets.input,
		property: 'margin-bottom',
	},
	'input-border-top-width': {
		target: inlineStylesTargets.input,
		property: 'border-top-width',
	},
	'input-border-right-width': {
		target: inlineStylesTargets.input,
		property: 'border-right-width',
	},
	'input-border-bottom-width': {
		target: inlineStylesTargets.input,
		property: 'border-bottom-width',
	},
	'input-border-left-width': {
		target: inlineStylesTargets.input,
		property: 'border-left-width',
	},
	'input-border-top-left-radius': {
		target: inlineStylesTargets.input,
		property: 'border-top-left-radius',
	},
	'input-border-top-right-radius': {
		target: inlineStylesTargets.input,
		property: 'border-top-right-radius',
	},
	'input-border-bottom-right-radius': {
		target: inlineStylesTargets.input,
		property: 'border-bottom-right-radius',
	},
	'input-border-bottom-left-radius': {
		target: inlineStylesTargets.input,
		property: 'border-bottom-left-radius',
	},
	'input-margin-top': {
		target: inlineStylesTargets.input,
		property: 'margin-top',
	},
	'input-margin-right': {
		target: inlineStylesTargets.input,
		property: 'margin-right',
	},
	'input-margin-bottom': {
		target: inlineStylesTargets.input,
		property: 'margin-bottom',
	},
	'input-margin-left': {
		target: inlineStylesTargets.input,
		property: 'margin-left',
	},
	'input-padding-top': {
		target: inlineStylesTargets.input,
		property: 'padding-top',
	},
	'input-padding-right': {
		target: inlineStylesTargets.input,
		property: 'padding-right',
	},
	'input-padding-bottom': {
		target: inlineStylesTargets.input,
		property: 'padding-bottom',
	},
	'input-padding-left': {
		target: inlineStylesTargets.input,
		property: 'padding-left',
	},
	'button-font-size': {
		target: inlineStylesTargets.buttonContent,
		property: 'font-size',
	},
	'button-line-height': {
		target: inlineStylesTargets.buttonContent,
		property: 'line-height',
	},
	'button-letter-spacing': {
		target: inlineStylesTargets.buttonContent,
		property: 'letter-spacing',
	},
	'button-text-indent': {
		target: inlineStylesTargets.buttonContent,
		property: 'text-indent',
	},
	'button-word-spacing': {
		target: inlineStylesTargets.buttonContent,
		property: 'word-spacing',
	},
	'button-bottom-gap': {
		target: inlineStylesTargets.buttonContent,
		property: 'margin-bottom',
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
	'icon-stroke': {
		target: inlineStylesTargets.iconPath,
		property: 'stroke-width',
	},
	'close-icon-stroke': {
		target: inlineStylesTargets.closeIconPath,
		property: 'stroke-width',
	},
	'icon-width': {
		target: inlineStylesTargets.iconSvg,
		property: 'width',
	},
	'close-icon-width': {
		target: inlineStylesTargets.closeIconSvg,
		property: 'width',
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
	prefixes,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	prefixes,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
