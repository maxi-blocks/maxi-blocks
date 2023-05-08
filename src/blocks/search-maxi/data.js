/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import { createIconTransitions } from '../../extensions/attributes/transitions';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';

/**
 * Classnames
 */
const blockClass = ' .maxi-search-block';
const buttonClass = `${blockClass}__button`;
const inputClass = `${blockClass}__input`;
const defaultIconClass = `${buttonClass}__default-icon`;
const closeIconClass = `${buttonClass}__close-icon`;

const buttonPrefix = 'bt-';
const closeIconPrefix = 'cl-';
const inputPrefix = 'in-';

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
	_exclude: ['i_c', 'cl-i_c', 'pla'],
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
const transition = {
	block: {
		border: {
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
			hoverProp: 'bo.sh',
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
			hoverProp: 'bs.sh',
		},
		opacity: {
			title: 'Opacity',
			target: '',
			property: 'opacity',
			hoverProp: '_o.sh',
		},
	},
	button: {
		...createIconTransitions({
			target: defaultIconClass,
			prefix: 'i-',
			titlePrefix: 'icon',
			disableBackground: true,
			disableBorder: true,
		}),
		...createIconTransitions({
			target: closeIconClass,
			prefix: `${closeIconPrefix}i-`,
			titlePrefix: 'close icon',
			disableBackground: true,
			disableBorder: true,
		}),
		typography: {
			title: 'Typography',
			target: `${buttonClass}__content`,
			property: false,
			hoverProp: `${buttonPrefix}t.sh`,
		},
		border: {
			title: 'Border',
			target: buttonClass,
			property: ['bo', 'bo.ra'],
			prefix: buttonPrefix,
		},
		'button background': {
			title: 'button background',
			target: buttonClass,
			property: 'background',
			hoverProp: `${buttonPrefix}b.sh`,
		},
	},
	input: {
		typography: {
			title: 'Typography',
			target: inputClass,
			property: false,
			hoverProp: `${inputPrefix}t.sh`,
		},
		border: {
			title: 'Border',
			target: inputClass,
			property: ['bo', 'bo.ra'],
			hoverProp: `${inputPrefix}bo.sh`,
		},
		'input background': {
			title: 'Input background',
			target: inputClass,
			property: 'background',
			hoverProp: `${inputPrefix}b.sh`,
		},
		'icon reveal appear': {
			title: 'Icon reveal appear',
			target: inputClass,
			property: ['opacity', 'visibility', 'width'],
		},
	},
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
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
};
export default data;
