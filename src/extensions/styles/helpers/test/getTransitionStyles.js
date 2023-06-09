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
			_t: {
				b: {},
				c: {
					bo: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						hp: 'bo.sh',
					},
					bs: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						hp: 'bs.sh',
					},
					bl: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': false,
						hp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const repeatedAttributes = {
		'_tdu-g': 0.3,
		'_tdu-l': 0.4,
		'_tdu-m': 0.5,
		'_tdu-s': 0.6,
		'_tdu-xs': 0.7,
		'_tdu-xxl': 0.8,
		'_tde-g': 0,
		'_tde-l': 0.1,
		'_tde-m': 0.2,
		'_tde-s': 0.3,
		'_tde-xs': 0.4,
		'_tde-xxl': 0.5,
		'_ea-g': 'ease',
		'_ea-l': 'ease-in',
		'_ea-m': 'ease-out',
		'_ea-s': 'ease-in-out',
		'_ea-xs': 'linear',
		'_ea-xxl': 'ease-in-out',
	};

	const repeatedGeneralAttributes = {
		'_tdu-g': 0.3,
		'_tde-g': 0,
		'_ea-g': 'ease',
		'_ts-g': true,
	};

	it('Get a correct responsive transition styles', () => {
		const object = {
			'bo.sh': true,
			'bs.sh': true,
			'bb.sh': false,
			_t: {
				b: {},
				c: {
					bo: {
						...repeatedAttributes,
						'_ts-g': true,
						'_ts-l': false,
						'_ts-m': true,
						'_ts-s': false,
						'_ts-xs': true,
						'_ts-xxl': false,
						hp: 'bo.sh',
					},
					bs: {
						...repeatedAttributes,
						'_ts-g': false,
						'_ts-l': true,
						'_ts-m': false,
						'_ts-s': true,
						'_ts-xs': false,
						'_ts-xxl': true,
						hp: 'bs.sh',
					},
					bl: {
						...repeatedAttributes,
						'_ts-g': true,
						'_ts-l': false,
						'_ts-m': true,
						'_ts-s': false,
						'_ts-xs': true,
						'_ts-xxl': false,
						hp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const customTransitionObj = {
		...transitionDefault,
		b: {
			ty: {
				ti: 'Typography',
				ta: ' .maxi-button-block__content',
				p: false,
				hp: 't.sh',
			},
			'bt bg': {
				ti: 'Button background',
				ta: ' .maxi-button-block__button',
				p: 'background',
				hp: 'bt-b.sh',
			},
		},
	};

	const repeatedAttributesWithStatus = {
		...repeatedAttributes,
		'_ts-g': true,
		'_ts-l': false,
		'_ts-m': true,
		'_ts-s': false,
		'_ts-xs': true,
		'_ts-xxl': false,
	};

	const responsiveTransitionAttributes = {
		'bo.sh': true,
		'bs.sh': true,
		'bb.sh': false,
		't.sh': true,
		'bt-b.sh': false,
		_t: {
			b: {
				ty: repeatedAttributesWithStatus,
				'bt bg': repeatedAttributesWithStatus,
			},
			c: {
				bo: repeatedAttributesWithStatus,
				bs: repeatedAttributesWithStatus,
				bl: repeatedAttributesWithStatus,
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
			_t: {
				b: {},
				c: {
					bo: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						out: {
							'_tdu-g': 0.9,
							'_tde-g': 0.2,
							'_ea-g': 'ease-out',
							'_ts-g': true,
						},
						'_spl-g': true,
						hp: 'bo.sh',
					},
					bs: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						out: {
							'_tdu-g': 0.9,
							'_tde-g': 0.2,
							'_ea-g': 'ease-out',
							'_ts-g': true,
						},
						'_spl-g': false,
						hp: 'bs.sh',
					},
					bl: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': false,
						hp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct responsive in/out transition styles', () => {
		const repeatedOutAttributes = {
			'_tdu-g': 1.8,
			'_tdu-l': 1.7,
			'_tdu-m': 1.6,
			'_tdu-s': 1.5,
			'_tdu-xs': 1.4,
			'_tdu-xxl': 1.3,
			'_tde-g': 1,
			'_tde-l': 0.9,
			'_tde-m': 0.8,
			'_tde-s': 0.7,
			'_tde-xs': 0.6,
			'_tde-xxl': 0.5,
			'_ea-g': 'ease-in-out',
			'_ea-l': 'ease-out',
			'_ea-m': 'ease-in',
			'_ea-s': 'linear',
			'_ea-xs': 'ease-in-out',
			'_ea-xxl': 'linear',
			'_ts-g': true,
		};

		const object = {
			'bo.sh': true,
			'bs.sh': true,
			'bb.sh': false,
			_t: {
				b: {},
				c: {
					bo: {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'_ts-g': true,
						'_ts-l': false,
						'_ts-m': true,
						'_ts-s': false,
						'_ts-xs': true,
						'_ts-xxl': false,
						'_spl-g': true,
						'_spl-l': true,
						'_spl-m': false,
						'_spl-s': true,
						'_spl-xs': true,
						'_spl-xxl': false,
						hp: 'bo.sh',
					},
					bs: {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'_ts-g': false,
						'_ts-l': true,
						'_ts-m': false,
						'_ts-s': true,
						'_ts-xs': false,
						'_ts-xxl': true,
						'_spl-g': false,
						'_spl-l': false,
						'_spl-m': true,
						'_spl-s': true,
						'_spl-xs': false,
						'_spl-xxl': true,
						hp: 'bs.sh',
					},
					bl: {
						...repeatedAttributes,
						out: repeatedOutAttributes,
						'_ts-g': true,
						'_ts-l': false,
						'_ts-m': true,
						'_ts-s': false,
						'_ts-xs': true,
						'_ts-xxl': false,
						'_spl-g': true,
						'_spl-l': true,
						'_spl-m': false,
						'_spl-s': true,
						'_spl-xs': true,
						'_spl-xxl': false,
						hp: 'bb.sh',
					},
				},
			},
		};

		const result = getTransitionStyles(object);
		expect(result).toMatchSnapshot();
	});

	const transformTransitionObj = {
		tr: {
			c: {
				ti: 'Canvas',
				ta: '',
				p: 'transform',
				it: true,
			},
			b: {
				ti: 'Block',
				ta: ' .block-class',
				p: 'transform',
				it: true,
			},
			bt: {
				ti: 'Button',
				ta: ' .button-class',
				p: 'transform',
				it: true,
			},
		},
	};

	it('Get a correct transform transition styles', () => {
		const object = {
			'tr_sc-g': {
				c: {
					hs: true,
				},
				b: {
					hs: false,
				},
			},
			'tr_rot-g': {
				c: {
					hs: false,
				},
				b: {
					hs: true,
				},
			},
			_t: {
				tr: {
					c: repeatedGeneralAttributes,
					b: repeatedGeneralAttributes,
					bt: repeatedGeneralAttributes,
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
				'tr_sc-g': {
					c: {
						hs: true,
					},
					b: {
						hs: false,
					},
				},
				'tr_rot-g': {
					c: {
						hs: false,
					},
				},
				'tr_rot-m': {
					b: {
						hs: true,
					},
				},
				'tr_sc-s': {
					c: {
						hs: false,
					},
				},
				_t: {
					tr: {
						c: repeatedAttributesWithStatus,
						b: repeatedAttributesWithStatus,
						bt: repeatedAttributesWithStatus,
					},
				},
			},
			repeatedAttributesWithStatus
		);

		const result = getTransitionStyles(object, transitionObj);
		expect(result).toMatchSnapshot();
	});
});
