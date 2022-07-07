import { closeIconPrefix, buttonPrefix, inputPrefix } from './prefixes';

const copyPasteMapping = {
	exclude: ['placeholder'],

	block: {
		_order: ['Border', 'Box shadow', 'Height/Width', 'Margin/Padding'],

		blockSpecific: {
			size: {
				groupLabel: 'Size',
				props: {
					'full-width': {
						type: 'withBreakpoint',
						label: 'Set block full-width',
					},
					size: { label: 'Size', type: 'withoutPrefix' },
				},
			},
		},
		withoutPrefix: {
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
			},
			boxShadow: {
				groupLabel: 'Box shadow',
				props: {
					boxShadow: 'Box shadow',
					boxShadowHover: 'Box shadow hover',
				},
			},
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
			},
		},
	},
	button: {
		_order: [
			'Skin',
			'Button',
			'Icon',
			'Close icon',
			'Border',
			'Button background',
			'Margin/Padding',
		],

		blockSpecific: {
			skin: 'Skin',
			button: {
				groupLabel: 'Button',
				props: {
					buttonSkin: 'Skin',
					buttonContent: 'Button text',
					buttonContentClose: 'Button text close',
				},
			},
		},
		withoutPrefix: {
			iconGroup: {
				groupLabel: 'Icon',
				props: {
					icon: { label: 'Icon', props: ['icon', 'iconHover'] },
				},
			},
		},
		withPrefix: {
			closeIconGroup: {
				groupLabel: 'Close icon',
				props: {
					icon: { label: 'Icon', props: ['icon', 'iconHover'] },
				},
				prefix: closeIconPrefix,
			},
			typography: {
				groupLabel: 'Typography',
				props: {
					typography: 'Typography',
					typographyHover: 'Typography hover',
				},
				prefix: buttonPrefix,
			},
			background: {
				groupLabel: 'Button background',
				props: {
					backgroundColor: {
						label: 'Background color',
						props: ['background', 'backgroundColor'],
					},
					backgroundColorHover: {
						label: 'Background color hover',
						props: ['backgroundHover', 'backgroundColorHover'],
					},
				},
				prefix: buttonPrefix,
			},
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
				prefix: buttonPrefix,
			},
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
				prefix: buttonPrefix,
			},
		},
	},
	input: {
		_order: [
			'Typography',
			'Placeholder',
			'Border',
			'Input background',
			'Padding',
		],

		blockSpecific: {
			placeholder: {
				groupLabel: 'Placeholder',
				props: {
					placeholder: 'Placeholder text',
					placeholderColor: {
						type: 'withoutPrefix',
						label: 'Placeholder colour',
					},
				},
			},
		},
		withPrefix: {
			typography: {
				groupLabel: 'Typography',
				props: {
					typography: 'Typography',
					typographyHover: 'Typography hover',
				},
				prefix: inputPrefix,
			},
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
				prefix: inputPrefix,
			},
			background: {
				groupLabel: 'Input background',
				props: {
					backgroundColor: {
						label: 'Background color',
						props: ['background', 'backgroundColor'],
					},
					backgroundColorHover: {
						label: 'Background color hover',
						props: ['backgroundHover', 'backgroundColorHover'],
					},
				},
				prefix: inputPrefix,
			},
			padding: {
				groupLabel: 'Padding',
				props: { padding: 'Padding' },
				prefix: inputPrefix,
			},
		},
	},
	advanced: {
		blockSpecific: {
			extraClassName: 'Custom CSS classes',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			relations: 'Interaction',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
			customCss: 'Custom CSS',
			scroll: 'Scroll',
			transform: 'Transform',
			transition: 'Hyperlink hover transition',
			display: 'Show/hide block',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
