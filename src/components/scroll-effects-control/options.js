/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';

/**
 * Icons
 */
/**
 * Styles and icons
 */
import {
	motionHorizontal,
	motionVertical,
	motionFade,
	motionBlur,
	motionRotate,
	motionScale,
} from '@maxi-icons';

const motionOptions = [
	{
		icon: <Icon icon={motionVertical} />,
		value: 'vertical',
		extraIndicatorsResponsive: ['scroll-vertical-status'],
	},
	{
		icon: <Icon icon={motionHorizontal} />,
		value: 'horizontal',
		extraIndicatorsResponsive: ['scroll-horizontal-status'],
	},
	{
		icon: <Icon icon={motionRotate} />,
		value: 'rotate',
		extraIndicatorsResponsive: [
			'scroll-rotate-status',
			'scroll-rotateX-status',
			'scroll-rotateY-status',
		],
	},
	{
		icon: <Icon icon={motionScale} />,
		value: 'scale',
		extraIndicatorsResponsive: [
			'scroll-scale-status',
			'scroll-scaleX-status',
			'scroll-scaleY-status',
		],
	},
	{
		icon: <Icon icon={motionFade} />,
		value: 'fade',
		extraIndicatorsResponsive: ['scroll-fade-status'],
	},
	{
		icon: <Icon icon={motionBlur} />,
		value: 'blur',
		extraIndicatorsResponsive: ['scroll-blur-status'],
	},
];

const motionSubOptions = [
	[
		{
			label: __('Rotate', 'maxi-blocks'),
			value: 'rotate',
			extraIndicatorsResponsive: ['scroll-rotate-status'],
		},
		{
			label: __('Rotate X', 'maxi-blocks'),
			value: 'rotateX',
			extraIndicatorsResponsive: ['scroll-rotateX-status'],
		},
		{
			label: __('Rotate Y', 'maxi-blocks'),
			value: 'rotateY',
			extraIndicatorsResponsive: ['scroll-rotateY-status'],
		},
	],
	[
		{
			label: __('Scale', 'maxi-blocks'),
			value: 'scale',
			extraIndicatorsResponsive: ['scroll-scale-status'],
		},
		{
			label: __('Scale X', 'maxi-blocks'),
			value: 'scaleX',
			extraIndicatorsResponsive: ['scroll-scaleX-status'],
		},
		{
			label: __('Scale Y', 'maxi-blocks'),
			value: 'scaleY',
			extraIndicatorsResponsive: ['scroll-scaleY-status'],
		},
	],
];

const easingOptions = [
	{
		label: __('Ease', 'maxi-blocks'),
		value: 'ease',
	},
	{
		label: __('Linear', 'maxi-blocks'),
		value: 'linear',
	},
	{
		label: __('Ease In', 'maxi-blocks'),
		value: 'ease-in',
	},
	{
		label: __('Ease Out', 'maxi-blocks'),
		value: 'ease-out',
	},
	{
		label: __('Ease In Out', 'maxi-blocks'),
		value: 'ease-in-out',
	},
];

const viewportOptions = [
	{
		label: __('Top of screen', 'maxi-blocks'),
		value: 'top',
	},
	{
		label: __('Middle of screen', 'maxi-blocks'),
		value: 'mid',
	},
	{
		label: __('Bottom of screen', 'maxi-blocks'),
		value: 'bottom',
	},
];

const globalShortcutsOptions = [
	{
		label: __('Choose', 'maxi-blocks'),
		value: 0,
	},
	{
		label: __('Disable all', 'maxi-blocks'),
		value: 1,
	},

	{
		label: __('In vertical Blur', 'maxi-blocks'),
		value: 2,
	},
	{
		label: __('Out vertical Blur', 'maxi-blocks'),
		value: 3,
	},
	{
		label: __('In horizontal Blur', 'maxi-blocks'),
		value: 4,
	},
	{
		label: __('Out horizontal Blur', 'maxi-blocks'),
		value: 5,
	},
	{
		label: __('In rotate Blur', 'maxi-blocks'),
		value: 6,
	},
	{
		label: __('Out rotate Blur', 'maxi-blocks'),
		value: 7,
	},
	{
		label: __('In scale Blur', 'maxi-blocks'),
		value: 8,
	},
	{
		label: __('Out scale Blur', 'maxi-blocks'),
		value: 9,
	},

	{
		label: __('Fade in up less', 'maxi-blocks'),
		value: 10,
	},
	{
		label: __('Fade in down less', 'maxi-blocks'),
		value: 11,
	},
	{
		label: __('Fade in left less', 'maxi-blocks'),
		value: 12,
	},
	{
		label: __('Fade in right less', 'maxi-blocks'),
		value: 13,
	},
	{
		label: __('Fade in up some', 'maxi-blocks'),
		value: 14,
	},
	{
		label: __('Fade in down some', 'maxi-blocks'),
		value: 15,
	},
	{
		label: __('Fade in left some', 'maxi-blocks'),
		value: 16,
	},
	{
		label: __('Fade in right some', 'maxi-blocks'),
		value: 17,
	},

	{
		label: __('Rotate up less', 'maxi-blocks'),
		value: 18,
	},
	{
		label: __('Rotate down less', 'maxi-blocks'),
		value: 19,
	},
	{
		label: __('Rotate left less', 'maxi-blocks'),
		value: 20,
	},
	{
		label: __('Rotate right less', 'maxi-blocks'),
		value: 21,
	},
	{
		label: __('Rotate up some', 'maxi-blocks'),
		value: 22,
	},
	{
		label: __('Rotate down some', 'maxi-blocks'),
		value: 23,
	},
	{
		label: __('Rotate left some', 'maxi-blocks'),
		value: 24,
	},
	{
		label: __('Rotate right some', 'maxi-blocks'),
		value: 25,
	},

	{
		label: __('Scale in Fade in less', 'maxi-blocks'),
		value: 26,
	},
	{
		label: __('Scale out Fade out less', 'maxi-blocks'),
		value: 27,
	},
	{
		label: __('Scale up Fade in less', 'maxi-blocks'),
		value: 28,
	},
	{
		label: __('Scale down Fade in less', 'maxi-blocks'),
		value: 29,
	},
];

const getShortcutEffect = type => {
	let response = {};
	switch (type) {
		case 'vertical':
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 0,
				},
				{
					label: __('Up less', 'maxi-blocks'),
					value: 1,
				},
				{
					label: __('Down less', 'maxi-blocks'),
					value: 2,
				},
				{
					label: __('Up some', 'maxi-blocks'),
					value: 3,
				},
				{
					label: __('Down some', 'maxi-blocks'),
					value: 4,
				},
				{
					label: __('Up more', 'maxi-blocks'),
					value: 5,
				},
				{
					label: __('Down more', 'maxi-blocks'),
					value: 6,
				},
			];
			break;

		case 'horizontal':
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 0,
				},
				{
					label: __('Right less', 'maxi-blocks'),
					value: 1,
				},
				{
					label: __('Left less', 'maxi-blocks'),
					value: 2,
				},
				{
					label: __('Right some', 'maxi-blocks'),
					value: 3,
				},
				{
					label: __('Left some', 'maxi-blocks'),
					value: 4,
				},
				{
					label: __('Right more', 'maxi-blocks'),
					value: 5,
				},
				{
					label: __('Left more', 'maxi-blocks'),
					value: 6,
				},
			];
			break;

		case 'rotate':
		case 'rotateX':
		case 'rotateY':
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 0,
				},
				{
					label: __('Right less', 'maxi-blocks'),
					value: 1,
				},
				{
					label: __('Left less', 'maxi-blocks'),
					value: 2,
				},
				{
					label: __('Right some', 'maxi-blocks'),
					value: 3,
				},
				{
					label: __('Left some', 'maxi-blocks'),
					value: 4,
				},
				{
					label: __('Right more', 'maxi-blocks'),
					value: 5,
				},
				{
					label: __('Left more', 'maxi-blocks'),
					value: 6,
				},
			];
			break;

		case 'scale':
		case 'scaleX':
		case 'scaleY':
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 0,
				},
				{
					label: __('Up less', 'maxi-blocks'),
					value: 1,
				},
				{
					label: __('Down less', 'maxi-blocks'),
					value: 2,
				},
				{
					label: __('Up some', 'maxi-blocks'),
					value: 3,
				},
				{
					label: __('Down some', 'maxi-blocks'),
					value: 4,
				},
				{
					label: __('Up more', 'maxi-blocks'),
					value: 5,
				},
				{
					label: __('Down more', 'maxi-blocks'),
					value: 6,
				},
			];
			break;

		case 'fade':
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 0,
				},
				{
					label: __('In less', 'maxi-blocks'),
					value: 1,
				},
				{
					label: __('Out less', 'maxi-blocks'),
					value: 2,
				},
				{
					label: __('In some', 'maxi-blocks'),
					value: 3,
				},
				{
					label: __('Out some', 'maxi-blocks'),
					value: 4,
				},
				{
					label: __('In more', 'maxi-blocks'),
					value: 5,
				},
				{
					label: __('Out more', 'maxi-blocks'),
					value: 6,
				},
			];
			break;

		case 'blur':
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 0,
				},
				{
					label: __('In less', 'maxi-blocks'),
					value: 1,
				},
				{
					label: __('Out less', 'maxi-blocks'),
					value: 2,
				},
				{
					label: __('In some', 'maxi-blocks'),
					value: 3,
				},
				{
					label: __('Out some', 'maxi-blocks'),
					value: 4,
				},
				{
					label: __('In more', 'maxi-blocks'),
					value: 5,
				},
				{
					label: __('Out more', 'maxi-blocks'),
					value: 6,
				},
			];
			break;

		default:
			response = [
				{
					label: __('Choose', 'maxi-blocks'),
					value: 'none',
				},
				{
					label: __('Placeholder effect', 'maxi-blocks'),
					value: 'placeholder-effect',
				},
				{
					label: __('Another', 'maxi-blocks'),
					value: 'another',
				},
			];
			break;
	}

	return response;
};

export {
	motionOptions,
	motionSubOptions,
	easingOptions,
	viewportOptions,
	globalShortcutsOptions,
	getShortcutEffect,
};
