// import '@wordpress/block-editor';
import getArrowStyles from '../getArrowStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getArrowStyles', () => {
	it('Get a correct arrow styles', () => {
		const object = {
			target: '',
			'arrow-status': true,
			'arrow-side-general': 'top',
			'arrow-position-general': 1,
			'arrow-width-general': 2,
			'arrow-side-xxl': 'top',
			'arrow-position-xxl': 4,
			'arrow-width-xxl': 1,
			'arrow-side-xl': 'top',
			'arrow-position-xl': 2,
			'arrow-width-xl': 3,
			'arrow-side-l': 'top',
			'arrow-position-l': 4,
			'arrow-width-l': 1,
			'arrow-side-m': 'bottom',
			'arrow-position-m': 2,
			'arrow-width-m': 3,
			'arrow-side-s': 'bottom',
			'arrow-position-s': 4,
			'arrow-width-s': 1,
			'arrow-side-xs': 'bottom',
			'arrow-position-xs': 2,
			'arrow-width-xs': 3,
			'border-color-general': 'rgb(255, 99, 71)',
			'background-active-media': 'color',
			'background-palette-color-status': false,
			'background-color': 'rgb(255, 99, 71)',
			'background-gradient':
				'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(50,98,118) 49%,rgb(155,81,224) 100%)',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
