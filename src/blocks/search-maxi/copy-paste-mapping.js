import { closeIconPrefix, buttonPrefix, inputPrefix } from './prefixes';

const copyPasteMapping = {
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

export default copyPasteMapping;
