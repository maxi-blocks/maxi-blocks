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
			blockStyle: 'light',
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
			'background-active-media': 'color',
			'background-palette-color-status': false,
			'background-color': 'rgb(255, 99, 71)',
			'border-palette-color-status-general': true,
			'border-palette-color-general': 4,
			'border-style-general': 'solid',
			'border-top-width-general': 1,
			'border-right-width-general': 1,
			'border-bottom-width-general': 1,
			'border-left-width-general': 1,
			'border-unit-width-general': 'px',
			'border-palette-color-status-m': false,
			'border-color-m': 'rgba(61,133,209)',
			'border-style-m': 'solid',
			'border-top-width-m': 3,
			'border-right-width-m': 3,
			'border-bottom-width-m': 3,
			'border-left-width-m': 3,
			'border-unit-width-m': 'px',
			'border-style-s': 'none',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct palette colors arrow hover styles', () => {
		const object = {
			target: '',
			isHover: true,
			blockStyle: 'light',
			'box-shadow-palette-color-status-general': true,
			'box-shadow-palette-color-general': 2,
			'box-shadow-palette-opacity-general': 20,
			'box-shadow-status-hover': true,
			'box-shadow-palette-color-status-general-hover': true,
			'box-shadow-palette-color-general-hover': 4,
			'box-shadow-palette-opacity-general-hover': 20,
			'box-shadow-horizontal-general-hover': 1,
			'box-shadow-vertical-general-hover': 2,
			'box-shadow-blur-general-hover': 3,
			'box-shadow-spread-general-hover': 4,
			'border-palette-color-status-general': true,
			'border-palette-color-general': 4,
			'border-palette-opacity-general': 20,
			'border-style-general': 'solid',
			'border-status-hover': true,
			'border-palette-color-status-general-hover': true,
			'border-palette-color-general-hover': 1,
			'border-palette-opacity-general-hover': 20,
			'border-style-general-hover': 'solid',
			'border-top-width-general-hover': 1,
			'border-right-width-general-hover': 2,
			'border-bottom-width-general-hover': 3,
			'border-left-width-general-hover': 4,
			'border-sync-width-general-hover': true,
			'border-unit-width-general-hover': 'px',
			'border-top-left-radius-general-hover': 1,
			'border-top-right-radius-general-hover': 2,
			'border-bottom-right-radius-general-hover': 3,
			'border-bottom-left-radius-general-hover': 4,
			'border-sync-radius-general-hover': true,
			'border-unit-radius-general-hover': 'px',
			'background-palette-color-status': true,
			'background-palette-color': 5,
			'background-status-hover': true,
			'background-active-media-hover': 'color',
			'background-palette-color-status-hover': true,
			'background-palette-color-hover': 1,
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct arrow hover styles with background, shadow and border custom colors', () => {
		const object = {
			target: '',
			isHover: true,
			blockStyle: 'light',
			'box-shadow-palette-color-status-general': true,
			'box-shadow-palette-color-general': 2,
			'box-shadow-palette-opacity-general': 20,
			'box-shadow-status-hover': true,
			'box-shadow-palette-color-status-general-hover': false,
			'box-shadow-color-general-hover': 'rgba(61,133,209)',
			'box-shadow-palette-opacity-general-hover': 20,
			'box-shadow-horizontal-general-hover': 1,
			'box-shadow-vertical-general-hover': 2,
			'box-shadow-blur-general-hover': 3,
			'box-shadow-spread-general-hover': 4,
			'border-palette-color-status-general': true,
			'border-palette-color-general': 4,
			'border-palette-opacity-general': 20,
			'border-style-general': 'solid',
			'border-status-hover': true,
			'border-palette-color-status-general-hover': false,
			'border-color-general-hover': 'rgba(150,200,90)',
			'border-palette-opacity-general-hover': 20,
			'border-style-general-hover': 'solid',
			'border-top-width-general-hover': 1,
			'border-right-width-general-hover': 2,
			'border-bottom-width-general-hover': 3,
			'border-left-width-general-hover': 4,
			'border-sync-width-general-hover': true,
			'border-unit-width-general-hover': 'px',
			'border-top-left-radius-general-hover': 1,
			'border-top-right-radius-general-hover': 2,
			'border-bottom-right-radius-general-hover': 3,
			'border-bottom-left-radius-general-hover': 4,
			'border-sync-radius-general-hover': true,
			'border-unit-radius-general-hover': 'px',
			'background-palette-color-status': true,
			'background-palette-color': 5,
			'background-status-hover': true,
			'background-active-media-hover': 'color',
			'background-palette-color-status-hover': true,
			'background-palette-color-hover': 1,
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
