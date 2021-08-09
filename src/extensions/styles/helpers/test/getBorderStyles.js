import getBorderStyles from '../getBorderStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getBorderStyles', () => {
	it('Return border styles object with all the settings', () => {
		const object = {
			'border-palette-color-status-general': false,
			'border-color-general': 'rgb(255, 99, 71)',
			'border-style-general': 'solid',
			'border-palette-color-status-xxl': false,
			'border-color-xxl': 'rgb(255, 99, 71)',
			'border-style-xxl': 'solid',
			'border-palette-color-status-xl': false,
			'border-color-xl': 'rgb(255, 99, 71)',
			'border-style-xl': 'solid',
			'border-palette-color-status-l': false,
			'border-color-l': 'rgb(255, 99, 71)',
			'border-style-l': 'solid',
			'border-palette-color-status-m': false,
			'border-color-m': 'rgb(255, 99, 71)',
			'border-style-m': 'solid',
			'border-palette-color-status-s': false,
			'border-color-s': 'rgb(255, 99, 71)',
			'border-style-s': 'solid',
			'border-palette-color-status-xs': false,
			'border-color-xs': 'rgb(255, 99, 71)',
			'border-style-xs': 'solid',
			'border-top-width-general': 1,
			'border-right-width-general': 2,
			'border-bottom-width-general': 3,
			'border-left-width-general': 4,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-top-width-xxl': 1,
			'border-right-width-xxl': 2,
			'border-bottom-width-xxl': 3,
			'border-left-width-xxl': 4,
			'border-sync-width-xxl': true,
			'border-unit-width-xxl': 'px',
			'border-top-width-xl': 1,
			'border-right-width-xl': 2,
			'border-bottom-width-xl': 3,
			'border-left-width-xl': 4,
			'border-sync-width-xl': true,
			'border-unit-width-xl': 'px',
			'border-top-width-l': 1,
			'border-right-width-l': 2,
			'border-bottom-width-l': 3,
			'border-left-width-l': 4,
			'border-sync-width-l': true,
			'border-unit-width-l': 'px',
			'border-top-width-m': 1,
			'border-right-width-m': 2,
			'border-bottom-width-m': 3,
			'border-left-width-m': 4,
			'border-sync-width-m': true,
			'border-unit-width-m': 'px',
			'border-top-width-s': 1,
			'border-right-width-s': 2,
			'border-bottom-width-s': 3,
			'border-left-width-s': 4,
			'border-sync-width-s': true,
			'border-unit-width-s': 'px',
			'border-top-width-xs': 1,
			'border-right-width-xs': 2,
			'border-bottom-width-xs': 3,
			'border-left-width-xs': 4,
			'border-sync-width-xs': true,
			'border-unit-width-xs': 'px',
			'border-top-left-radius-general': 1,
			'border-top-right-radius-general': 2,
			'border-bottom-right-radius-general': 3,
			'border-bottom-left-radius-general': 4,
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-top-left-radius-xxl': 1,
			'border-top-right-radius-xxl': 2,
			'border-bottom-right-radius-xxl': 3,
			'border-bottom-left-radius-xxl': 4,
			'border-sync-radius-xxl': true,
			'border-unit-radius-xxl': 'px',
			'border-top-left-radius-xl': 1,
			'border-top-right-radius-xl': 2,
			'border-bottom-right-radius-xl': 3,
			'border-bottom-left-radius-xl': 4,
			'border-sync-radius-xl': true,
			'border-unit-radius-xl': 'px',
			'border-top-left-radius-l': 1,
			'border-top-right-radius-l': 2,
			'border-bottom-right-radius-l': 3,
			'border-bottom-left-radius-l': 4,
			'border-sync-radius-l': true,
			'border-unit-radius-l': 'px',
			'border-top-left-radius-m': 1,
			'border-top-right-radius-m': 2,
			'border-bottom-right-radius-m': 3,
			'border-bottom-left-radius-m': 4,
			'border-sync-radius-m': true,
			'border-unit-radius-m': 'px',
			'border-top-left-radius-s': 1,
			'border-top-right-radius-s': 2,
			'border-bottom-right-radius-s': 3,
			'border-bottom-left-radius-s': 4,
			'border-sync-radius-s': true,
			'border-unit-radius-s': 'px',
			'border-top-left-radius-xs': 1,
			'border-top-right-radius-xs': 2,
			'border-bottom-right-radius-xs': 3,
			'border-bottom-left-radius-xs': 4,
			'border-sync-radius-xs': true,
			'border-unit-radius-xs': 'px',
		};

		const result = getBorderStyles({
			obj: object,
			parentBlockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object with changes on palette color', () => {
		const object = {
			'border-palette-color-status-general': true,
			'border-palette-color-general': 1,
			'border-style-general': 'solid',
			'border-top-width-general': 1,
			'border-right-width-general': 2,
			'border-bottom-width-general': 3,
			'border-left-width-general': 4,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-top-left-radius-general': 1,
			'border-top-right-radius-general': 2,
			'border-bottom-right-radius-general': 3,
			'border-bottom-left-radius-general': 4,
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-palette-color-l': 1,
		};

		const result = getBorderStyles({
			obj: object,
			parentBlockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object with changes on custom color', () => {
		const object = {
			'border-palette-color-status-general': true,
			'border-palette-color-general': 1,
			'border-style-general': 'solid',
			'border-top-width-general': 1,
			'border-right-width-general': 2,
			'border-bottom-width-general': 3,
			'border-left-width-general': 4,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-top-left-radius-general': 1,
			'border-top-right-radius-general': 2,
			'border-bottom-right-radius-general': 3,
			'border-bottom-left-radius-general': 4,
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-palette-color-status-l': false,
			'border-color-l': 'rgb(255, 99, 71)',
		};

		const result = getBorderStyles({
			obj: object,
			parentBlockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border hover styles object with changes on custom color', () => {
		const object = {
			'border-palette-color-status-general': true,
			'border-palette-color-general': 1,
			'border-palette-color-general-hover': 5,
			'border-style-general': 'solid',
			'border-top-width-general': 1,
			'border-right-width-general': 2,
			'border-bottom-width-general': 3,
			'border-left-width-general': 4,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-top-left-radius-general': 1,
			'border-top-right-radius-general': 2,
			'border-bottom-right-radius-general': 3,
			'border-bottom-left-radius-general': 4,
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-palette-color-status-l': false,
			'border-color-l': 'rgb(255, 99, 71)',
		};

		const result = getBorderStyles({
			obj: object,
			parentBlockStyle: 'light',
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});
});
