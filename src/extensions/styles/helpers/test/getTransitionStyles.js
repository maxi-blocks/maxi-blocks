import getTransitionStyles from '../getTransitionStyles';
import transitionDefault from '../../transitions/transitionDefault';

describe('getTransitionStyles', () => {
	it('Get a correct transition styles', () => {
		const object = {
			'border-status-hover': true,
			'box-shadow-status-hover': false,
			'block-background-status-hover': true,
			transition: {
				block: {},
				canvas: {
					border: {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'border-status-hover',
					},
					'box shadow': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'box-shadow-status-hover',
					},
					'background / layer': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': false,
						hoverProp: 'block-background-status-hover',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const repeatedAttributes = {
		'transition-duration-general': 0.3,
		'transition-duration-l': 0.4,
		'transition-duration-m': 0.5,
		'transition-duration-s': 0.6,
		'transition-duration-xs': 0.7,
		'transition-duration-xxl': 0.8,
		'transition-delay-general': 0,
		'transition-delay-l': 0.1,
		'transition-delay-m': 0.2,
		'transition-delay-s': 0.3,
		'transition-delay-xs': 0.4,
		'transition-delay-xxl': 0.5,
		'easing-general': 'ease',
		'easing-l': 'ease-in',
		'easing-m': 'ease-out',
		'easing-s': 'ease-in-out',
		'easing-xs': 'linear',
		'easing-xxl': 'ease-in-out',
	};

	it('Get a correct responsive transition styles', () => {
		const object = {
			'border-status-hover': true,
			'box-shadow-status-hover': true,
			'block-background-status-hover': false,
			transition: {
				block: {},
				canvas: {
					border: {
						...repeatedAttributes,
						'transition-status-general': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						hoverProp: 'border-status-hover',
					},
					'box shadow': {
						...repeatedAttributes,
						'transition-status-general': false,
						'transition-status-l': true,
						'transition-status-m': false,
						'transition-status-s': true,
						'transition-status-xs': false,
						'transition-status-xxl': true,
						hoverProp: 'box-shadow-status-hover',
					},
					'background / layer': {
						...repeatedAttributes,
						'transition-status-general': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						hoverProp: 'block-background-status-hover',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct responsive transition styles with custom transitionObj', () => {
		const repeatedAttributes = {
			'transition-duration-general': 0.3,
			'transition-duration-l': 0.4,
			'transition-duration-m': 0.5,
			'transition-duration-s': 0.6,
			'transition-duration-xs': 0.7,
			'transition-duration-xxl': 0.8,
			'transition-delay-general': 0,
			'transition-delay-l': 0.1,
			'transition-delay-m': 0.2,
			'transition-delay-s': 0.3,
			'transition-delay-xs': 0.4,
			'transition-delay-xxl': 0.5,
			'easing-general': 'ease',
			'easing-l': 'ease-in',
			'easing-m': 'ease-out',
			'easing-s': 'ease-in-out',
			'easing-xs': 'linear',
			'easing-xxl': 'ease-in-out',
			'transition-status-general': true,
			'transition-status-l': false,
			'transition-status-m': true,
			'transition-status-s': false,
			'transition-status-xs': true,
			'transition-status-xxl': false,
		};

		const prefix = 'button-';

		const transitionObj = {
			...transitionDefault,
			block: {
				typography: {
					title: 'Typography',
					target: ' .maxi-button-block__content',
					property: false,
					hoverProp: 'typography-status-hover',
				},
				'button background': {
					title: 'Button background',
					target: ' .maxi-button-block__button',
					property: 'background',
					hoverProp: `${prefix}background-status-hover`,
				},
			},
		};

		const object = {
			'border-status-hover': true,
			'box-shadow-status-hover': true,
			'block-background-status-hover': false,
			'typography-status-hover': true,
			'button-background-status-hover': false,
			transition: {
				block: {
					typography: repeatedAttributes,

					'button background': repeatedAttributes,
				},
				canvas: {
					border: repeatedAttributes,
					'box shadow': repeatedAttributes,
					'background / layer': repeatedAttributes,
				},
			},
		};

		const result = getTransitionStyles(object, transitionObj);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct in/out transition styles', () => {
		const object = {
			'border-status-hover': true,
			'box-shadow-status-hover': true,
			'block-background-status-hover': true,
			transition: {
				block: {},
				canvas: {
					border: {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						out: {
							'transition-duration-general': 0.9,
							'transition-delay-general': 0.2,
							'easing-general': 'ease-out',
							'transition-status-general': true,
						},
						'split-general': true,
						hoverProp: 'border-status-hover',
					},
					'box shadow': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						out: {
							'transition-duration-general': 0.9,
							'transition-delay-general': 0.2,
							'easing-general': 'ease-out',
							'transition-status-general': true,
						},
						'split-general': false,
						hoverProp: 'box-shadow-status-hover',
					},
					'background / layer': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': false,
						hoverProp: 'block-background-status-hover',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct responsive in/out transition styles', () => {
		const repeatedOutAttributes = {
			'transition-duration-general': 1.8,
			'transition-duration-l': 1.7,
			'transition-duration-m': 1.6,
			'transition-duration-s': 1.5,
			'transition-duration-xs': 1.4,
			'transition-duration-xxl': 1.3,
			'transition-delay-general': 1,
			'transition-delay-l': 0.9,
			'transition-delay-m': 0.8,
			'transition-delay-s': 0.7,
			'transition-delay-xs': 0.6,
			'transition-delay-xxl': 0.5,
			'easing-general': 'ease-in-out',
			'easing-l': 'ease-out',
			'easing-m': 'ease-in',
			'easing-s': 'linear',
			'easing-xs': 'ease-in-out',
			'easing-xxl': 'linear',
			'transition-status-general': true,
		};

		const object = {
			'border-status-hover': true,
			'box-shadow-status-hover': true,
			'block-background-status-hover': false,
			transition: {
				block: {},
				canvas: {
					border: {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'transition-status-general': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						'split-general': true,
						'split-l': true,
						'split-m': false,
						'split-s': true,
						'split-xs': true,
						'split-xxl': false,
						hoverProp: 'border-status-hover',
					},
					'box shadow': {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'transition-status-general': false,
						'transition-status-l': true,
						'transition-status-m': false,
						'transition-status-s': true,
						'transition-status-xs': false,
						'transition-status-xxl': true,
						'split-general': false,
						'split-l': false,
						'split-m': true,
						'split-s': true,
						'split-xs': false,
						'split-xxl': true,
						hoverProp: 'box-shadow-status-hover',
					},
					'background / layer': {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'transition-status-general': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						'split-general': true,
						'split-l': true,
						'split-m': false,
						'split-s': true,
						'split-xs': true,
						'split-xxl': false,
						hoverProp: 'block-background-status-hover',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});
});
