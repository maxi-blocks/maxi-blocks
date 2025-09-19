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
	button: {
		Skin: 'skin',
		Button: {
			group: {
				Skin: 'buttonSkin',
				'Button text': 'buttonContent',
				'Button text close': 'buttonContentClose',
			},
		},
		Icon: {
			groupAttributes: ['icon', 'iconHover'],
		},
		'Close icon': {
			groupAttributes: ['icon', 'iconHover'],
			prefix: closeIconPrefix,
		},
		Typography: {
			template: 'typography',
			prefix: buttonPrefix,
		},
		'Button background': {
			template: 'background',
			prefix: buttonPrefix,
		},
		Border: {
			template: 'border',
			prefix: buttonPrefix,
		},
		'Margin/Padding': {
			template: 'marginPadding',
			prefix: buttonPrefix,
		},
	},
	input: {
		Typography: {
			template: 'typography',
			prefix: inputPrefix,
		},
		Placeholder: {
			group: {
				'Placeholder text': 'placeholder',
				'Placeholder colour': {
					groupAttributes: 'placeholderColor',
				},
			},
		},
		Border: {
			template: 'border',
			prefix: inputPrefix,
		},
		'Input background': {
			template: 'background',
			prefix: inputPrefix,
		},
		Padding: {
			groupAttributes: 'padding',
			prefix: inputPrefix,
		},
	},
	advanced: {
		template: 'advanced',
		Opacity: {
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
				label: 'input ::placeholder',
				target: ' .maxi-search-block__input::placeholder',
			},
			hover: {
				label: 'input ::placeholder on hover',
				target: ' .maxi-search-block__input:hover::placeholder',
			},
		},
		icon: {
			normal: {
				label: 'icon',
				target: ' .maxi-search-block__button__default-icon',
			},
			svg: {
				label: "icon's svg",
				target: ' .maxi-search-block__button__default-icon svg',
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: ' .maxi-search-block__button__default-icon svg > *',
			},
			path: {
				label: "svg's path",
				target: ' .maxi-search-block__button__default-icon svg path',
			},
			hover: {
				label: 'icon on hover',
				target: ' .maxi-search-block__button__default-icon:hover',
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: ' .maxi-search-block__button__default-icon:hover svg',
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: ' .maxi-search-block__button__default-icon:hover svg > *',
			},
			hoverPath: {
				label: "svg's path on hover",
				target: ' .maxi-search-block__button__default-icon:hover svg path',
			},
		},
		'close icon': {
			normal: {
				label: 'icon',
				target: ' .maxi-search-block__button__close-icon',
			},
			svg: {
				label: "icon's svg",
				target: ' .maxi-search-block__button__close-icon svg',
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: ' .maxi-search-block__button__close-icon svg > *',
			},
			path: {
				label: "svg's path",
				target: ' .maxi-search-block__button__close-icon svg path',
			},
			hover: {
				label: 'icon on hover',
				target: ' .maxi-search-block__button__close-icon:hover',
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: ' .maxi-search-block__button__close-icon:hover svg',
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: ' .maxi-search-block__button__close-icon:hover svg > *',
			},
			hoverPath: {
				label: "svg's path on hover",
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
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
			hoverProp: 'border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
			hoverProp: 'box-shadow-status-hover',
		},
		opacity: {
			title: 'Opacity',
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
			title: 'Typography',
			target: `${buttonClass}__content`,
			property: false,
			hoverProp: `${buttonPrefix}typography-status-hover`,
		},
		border: {
			title: 'Border',
			target: buttonClass,
			property: ['border', 'border-radius'],
			prefix: buttonPrefix,
		},
		'button background': {
			title: 'button background',
			target: buttonClass,
			property: 'background',
			hoverProp: `${buttonPrefix}background-status-hover`,
		},
	},
	input: {
		typography: {
			title: 'Typography',
			target: inputClass,
			property: false,
			hoverProp: `${inputPrefix}typography-status-hover`,
		},
		border: {
			title: 'Border',
			target: inputClass,
			property: ['border', 'border-radius'],
			hoverProp: `${inputPrefix}border-status-hover`,
		},
		'input background': {
			title: 'Input background',
			target: inputClass,
			property: 'background',
			hoverProp: `${inputPrefix}background-status-hover`,
		},
		'icon reveal appear': {
			title: 'Icon reveal appear',
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
