/**
 * Internal dependencies
 */
import getTransitionStyles from '../getTransitionStyles';
import transitionDefault from '../../../attributes/transitions/transitionDefault';

/**
 * External dependencies
 */
import { merge } from 'lodash';

describe('getTransitionStyles', () => {
	it('Get a correct transition styles', () => {
		const object = {
			'bo.sh': true,
			'bs.sh': false,
			'bb.sh': true,
			transition: {
				block: {},
				canvas: {
					border: {
						'transition-duration-g': 0.3,
						'transition-delay-g': 0,
						'easing-g': 'ease',
						'transition-status-g': true,
						hoverProp: 'bo.sh',
					},
					'box shadow': {
						'transition-duration-g': 0.3,
						'transition-delay-g': 0,
						'easing-g': 'ease',
						'transition-status-g': true,
						hoverProp: 'bs.sh',
					},
					'background / layer': {
						'transition-duration-g': 0.3,
						'transition-delay-g': 0,
						'easing-g': 'ease',
						'transition-status-g': false,
						hoverProp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const repeatedAttributes = {
		'transition-duration-g': 0.3,
		'transition-duration-l': 0.4,
		'transition-duration-m': 0.5,
		'transition-duration-s': 0.6,
		'transition-duration-xs': 0.7,
		'transition-duration-xxl': 0.8,
		'transition-delay-g': 0,
		'transition-delay-l': 0.1,
		'transition-delay-m': 0.2,
		'transition-delay-s': 0.3,
		'transition-delay-xs': 0.4,
		'transition-delay-xxl': 0.5,
		'easing-g': 'ease',
		'easing-l': 'ease-in',
		'easing-m': 'ease-out',
		'easing-s': 'ease-in-out',
		'easing-xs': 'linear',
		'easing-xxl': 'ease-in-out',
	};

	const repeatedGeneralAttributes = {
		'transition-duration-g': 0.3,
		'transition-delay-g': 0,
		'easing-g': 'ease',
		'transition-status-g': true,
	};

	it('Get a correct responsive transition styles', () => {
		const object = {
			'bo.sh': true,
			'bs.sh': true,
			'bb.sh': false,
			transition: {
				block: {},
				canvas: {
					border: {
						...repeatedAttributes,
						'transition-status-g': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						hoverProp: 'bo.sh',
					},
					'box shadow': {
						...repeatedAttributes,
						'transition-status-g': false,
						'transition-status-l': true,
						'transition-status-m': false,
						'transition-status-s': true,
						'transition-status-xs': false,
						'transition-status-xxl': true,
						hoverProp: 'bs.sh',
					},
					'background / layer': {
						...repeatedAttributes,
						'transition-status-g': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						hoverProp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const customTransitionObj = {
		...transitionDefault,
		block: {
			typography: {
				title: 'Typography',
				target: ' .maxi-button-block__content',
				property: false,
				hoverProp: 't.sh',
			},
			'button background': {
				title: 'Button background',
				target: ' .maxi-button-block__button',
				property: 'background',
				hoverProp: 'bt-b.sh',
			},
		},
	};

	const repeatedAttributesWithStatus = {
		...repeatedAttributes,
		'transition-status-g': true,
		'transition-status-l': false,
		'transition-status-m': true,
		'transition-status-s': false,
		'transition-status-xs': true,
		'transition-status-xxl': false,
	};

	const responsiveTransitionAttributes = {
		'bo.sh': true,
		'bs.sh': true,
		'bb.sh': false,
		't.sh': true,
		'bt-b.sh': false,
		transition: {
			block: {
				typography: repeatedAttributesWithStatus,
				'button background': repeatedAttributesWithStatus,
			},
			canvas: {
				border: repeatedAttributesWithStatus,
				'box shadow': repeatedAttributesWithStatus,
				'background / layer': repeatedAttributesWithStatus,
			},
		},
	};

	it('Get a correct responsive transition styles with custom transitionObj', () => {
		const result = getTransitionStyles(
			responsiveTransitionAttributes,
			customTransitionObj
		);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct in/out transition styles', () => {
		const object = {
			'bo.sh': true,
			'bs.sh': true,
			'bb.sh': true,
			transition: {
				block: {},
				canvas: {
					border: {
						'transition-duration-g': 0.3,
						'transition-delay-g': 0,
						'easing-g': 'ease',
						'transition-status-g': true,
						out: {
							'transition-duration-g': 0.9,
							'transition-delay-g': 0.2,
							'easing-g': 'ease-out',
							'transition-status-g': true,
						},
						'split-g': true,
						hoverProp: 'bo.sh',
					},
					'box shadow': {
						'transition-duration-g': 0.3,
						'transition-delay-g': 0,
						'easing-g': 'ease',
						'transition-status-g': true,
						out: {
							'transition-duration-g': 0.9,
							'transition-delay-g': 0.2,
							'easing-g': 'ease-out',
							'transition-status-g': true,
						},
						'split-g': false,
						hoverProp: 'bs.sh',
					},
					'background / layer': {
						'transition-duration-g': 0.3,
						'transition-delay-g': 0,
						'easing-g': 'ease',
						'transition-status-g': false,
						hoverProp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct responsive in/out transition styles', () => {
		const repeatedOutAttributes = {
			'transition-duration-g': 1.8,
			'transition-duration-l': 1.7,
			'transition-duration-m': 1.6,
			'transition-duration-s': 1.5,
			'transition-duration-xs': 1.4,
			'transition-duration-xxl': 1.3,
			'transition-delay-g': 1,
			'transition-delay-l': 0.9,
			'transition-delay-m': 0.8,
			'transition-delay-s': 0.7,
			'transition-delay-xs': 0.6,
			'transition-delay-xxl': 0.5,
			'easing-g': 'ease-in-out',
			'easing-l': 'ease-out',
			'easing-m': 'ease-in',
			'easing-s': 'linear',
			'easing-xs': 'ease-in-out',
			'easing-xxl': 'linear',
			'transition-status-g': true,
		};

		const object = {
			'bo.sh': true,
			'bs.sh': true,
			'bb.sh': false,
			transition: {
				block: {},
				canvas: {
					border: {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'transition-status-g': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						'split-g': true,
						'split-l': true,
						'split-m': false,
						'split-s': true,
						'split-xs': true,
						'split-xxl': false,
						hoverProp: 'bo.sh',
					},
					'box shadow': {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'transition-status-g': false,
						'transition-status-l': true,
						'transition-status-m': false,
						'transition-status-s': true,
						'transition-status-xs': false,
						'transition-status-xxl': true,
						'split-g': false,
						'split-l': false,
						'split-m': true,
						'split-s': true,
						'split-xs': false,
						'split-xxl': true,
						hoverProp: 'bs.sh',
					},
					'background / layer': {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'transition-status-g': true,
						'transition-status-l': false,
						'transition-status-m': true,
						'transition-status-s': false,
						'transition-status-xs': true,
						'transition-status-xxl': false,
						'split-g': true,
						'split-l': true,
						'split-m': false,
						'split-s': true,
						'split-xs': true,
						'split-xxl': false,
						hoverProp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const transformTransitionObj = {
		transform: {
			canvas: {
				title: 'Canvas',
				target: '',
				property: 'transform',
				isTransform: true,
			},
			block: {
				title: 'Block',
				target: ' .block-class',
				property: 'transform',
				isTransform: true,
			},
			button: {
				title: 'Button',
				target: ' .button-class',
				property: 'transform',
				isTransform: true,
			},
		},
	};

	it('Get a correct transform transition styles', () => {
		const object = {
			'transform-scale-g': {
				canvas: {
					'hover-status': true,
				},
				block: {
					'hover-status': false,
				},
			},
			'transform-rotate-g': {
				canvas: {
					'hover-status': false,
				},
				block: {
					'hover-status': true,
				},
			},
			transition: {
				transform: {
					canvas: repeatedGeneralAttributes,
					block: repeatedGeneralAttributes,
					button: repeatedGeneralAttributes,
				},
			},
		};

		const result = getTransitionStyles(object, transformTransitionObj);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct responsive transform(mixed with others) transition styles', () => {
		const transitionObj = {
			...customTransitionObj,
			...transformTransitionObj,
		};

		const object = merge(
			{
				'transform-scale-g': {
					canvas: {
						'hover-status': true,
					},
					block: {
						'hover-status': false,
					},
				},
				'transform-rotate-g': {
					canvas: {
						'hover-status': false,
					},
				},
				'transform-rotate-m': {
					block: {
						'hover-status': true,
					},
				},
				'transform-scale-s': {
					canvas: {
						'hover-status': false,
					},
				},
				transition: {
					transform: {
						canvas: repeatedAttributesWithStatus,
						block: repeatedAttributesWithStatus,
						button: repeatedAttributesWithStatus,
					},
				},
			},
			repeatedAttributesWithStatus
		);

		const result = getTransitionStyles(object, transitionObj);
		expect(result).toMatchSnapshot();
	});
});
