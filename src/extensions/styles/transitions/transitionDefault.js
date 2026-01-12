import { __ } from '@wordpress/i18n';

const transitionDefault = {
	canvas: {
		border: {
			title: __('Border', 'maxi-blocks'),
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'border-radius', 'top', 'left'],
			hoverProp: 'border-status-hover',
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: '',
			property: 'box-shadow',
			hoverProp: 'box-shadow-status-hover',
		},
		'background / layer': {
			title: __('Background / Layer', 'maxi-blocks'),
			target: [
				' > .maxi-background-displayer > div',
				' > .maxi-background-displayer > div > svg',
			],
			property: false,
			hoverProp: 'block-background-status-hover',
		},
		opacity: {
			title: __('Opacity', 'maxi-blocks'),
			target: '',
			property: 'opacity',
			hoverProp: 'opacity-status-hover',
		},
	},
};

export default transitionDefault;
