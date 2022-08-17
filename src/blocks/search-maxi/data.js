import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import { closeIconPrefix, buttonPrefix, inputPrefix } from './prefixes';

/**
 * Classnames
 */
const blockClass = ' .maxi-search-block';
const buttonClass = `${blockClass}__button`;
const inputClass = `${blockClass}__input`;
const defaultIconClass = `${buttonClass}__default-icon`;
const closeIconClass = `${buttonClass}__close-icon`;

const data = {
	name: 'search-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
		selectors: {
			...createSelectors({
				block: {
					label: 'block',
					target: '',
				},
				button: {
					label: 'button',
					target: buttonClass,
				},
				input: {
					label: 'input',
					target: inputClass,
				},
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
	},
	transition: {
		block: {
			border: {
				title: 'Border',
				target: ['', ' > .maxi-background-displayer'],
				property: ['border', 'top', 'left'],
			},
			'box shadow': {
				title: 'Box shadow',
				target: '',
				property: 'box-shadow',
			},
		},
		button: {
			icon: {
				title: 'Icon',
				target: [
					`${defaultIconClass} svg > *`,
					`${defaultIconClass} svg`,
					defaultIconClass,
				],
				property: 'icon',
				limitless: true,
			},
			'close icon': {
				title: 'Close icon',
				target: [
					`${closeIconClass} svg > *`,
					`${closeIconClass} svg`,
					closeIconClass,
				],
				property: 'icon',
				limitless: true,
				prefix: closeIconPrefix,
			},
			typography: {
				title: 'Typography',
				target: `${buttonClass}__content`,
				property: 'typography',
				limitless: true,
				prefix: buttonPrefix,
			},
			border: {
				title: 'Border',
				target: buttonClass,
				property: 'border',
				prefix: buttonPrefix,
			},
			'button background': {
				title: 'button background',
				target: buttonClass,
				property: 'background',
				prefix: buttonPrefix,
			},
		},
		input: {
			typography: {
				title: 'Typography',
				target: inputClass,
				property: 'typography',
				limitless: true,
				prefix: inputPrefix,
			},
			border: {
				title: 'Border',
				target: inputClass,
				property: 'border',
				prefix: inputPrefix,
			},
			'input background': {
				title: 'Input background',
				target: inputClass,
				property: 'background',
				prefix: inputPrefix,
			},
			'icon reveal appear': {
				title: 'Icon reveal appear',
				target: inputClass,
				property: ['opacity', 'visibility', 'width'],
				prefix: inputPrefix,
				ignoreHoverProp: true,
			},
		},
	},
	get interactionBuilderSettings() {
		return getCanvasSettings(this);
	},
};

const { copyPasteMapping, customCss, transition, interactionBuilderSettings } =
	data;

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
