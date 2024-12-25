/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { createIconTransitions } from '@extensions/styles';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';

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

const data = {
	name,
	prefixes,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export {
	prefixes,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
