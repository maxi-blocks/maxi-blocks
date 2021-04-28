import getBorderStyles from '../getBorderStyles';
import '@wordpress/block-editor';

describe('getZIndexStyle', () => {
	it('Get a correct style', () => {
		const object = {
			'border-color-general': 'red',
			'border-style-general': 'blue',
			'border-color-xxl': 'red',
			'border-style-xxl': 'blue',
			'border-color-xl': 'red',
			'border-style-xl': 'blue',
			'border-color-l': 'red',
			'border-style-l': 'blue',
			'border-color-m': 'red',
			'border-style-m': 'blue',
			'border-color-s': 'red',
			'border-style-s': 'blue',
			'border-color-xs': 'red',
			'border-style-xs': 'blue',
			'border-top-width-general': 1,
			'border-right-width-general': 2,
			'border-bottom-width-general': 3,
			'border-left-width-general': 4,
			'border-sync-width-general': 'true',
			'border-unit-width-general': '1',
			'border-top-width-xxl': 1,
			'border-right-width-xxl': 2,
			'border-bottom-width-xxl': 3,
			'border-left-width-xxl': 4,
			'border-sync-width-xxl': 'true',
			'border-unit-width-xxl': '1',
			'border-top-width-xl': 1,
			'border-right-width-xl': 2,
			'border-bottom-width-xl': 3,
			'border-left-width-xl': 4,
			'border-sync-width-xl': 'true',
			'border-unit-width-xl': '1',
			'border-top-width-l': 1,
			'border-right-width-l': 2,
			'border-bottom-width-l': 3,
			'border-left-width-l': 4,
			'border-sync-width-l': 'true',
			'border-unit-width-l': '1',
			'border-top-width-m': 1,
			'border-right-width-m': 2,
			'border-bottom-width-m': 3,
			'border-left-width-m': 4,
			'border-sync-width-m': 'true',
			'border-unit-width-m': '1',
			'border-top-width-s': 1,
			'border-right-width-s': 2,
			'border-bottom-width-s': 3,
			'border-left-width-s': 4,
			'border-sync-width-s': 'true',
			'border-unit-width-s': '1',
			'border-top-width-xs': 1,
			'border-right-width-xs': 2,
			'border-bottom-width-xs': 3,
			'border-left-width-xs': 4,
			'border-sync-width-xs': 'true',
			'border-unit-width-xs': '1',
			'border-top-left-radius-general': 1,
			'border-top-right-radius-general': 2,
			'border-bottom-right-radius-general': 3,
			'border-bottom-left-radius-general': 4,
			'border-sync-radius-general': 'true',
			'border-unit-radius-general': '1',
			'border-top-left-radius-xxl': 1,
			'border-top-right-radius-xxl': 2,
			'border-bottom-right-radius-xxl': 3,
			'border-bottom-left-radius-xxl': 4,
			'border-sync-radius-xxl': 'true',
			'border-unit-radius-xxl': '1',
			'border-top-left-radius-xl': 1,
			'border-top-right-radius-xl': 2,
			'border-bottom-right-radius-xl': 3,
			'border-bottom-left-radius-xl': 4,
			'border-sync-radius-xl': 'true',
			'border-unit-radius-xl': '1',
			'border-top-left-radius-l': 1,
			'border-top-right-radius-l': 2,
			'border-bottom-right-radius-l': 3,
			'border-bottom-left-radius-l': 4,
			'border-sync-radius-l': 'true',
			'border-unit-radius-l': '1',
			'border-top-left-radius-m': 1,
			'border-top-right-radius-m': 2,
			'border-bottom-right-radius-m': 3,
			'border-bottom-left-radius-m': 4,
			'border-sync-radius-m': 'true',
			'border-unit-radius-m': '1',
			'border-top-left-radius-s': 1,
			'border-top-right-radius-s': 2,
			'border-bottom-right-radius-s': 3,
			'border-bottom-left-radius-s': 4,
			'border-sync-radius-s': 'true',
			'border-unit-radius-s': '1',
			'border-top-left-radius-xs': 1,
			'border-top-right-radius-xs': 2,
			'border-bottom-right-radius-xs': 3,
			'border-bottom-left-radius-xs': 4,
			'border-sync-radius-xs': 'true',
			'border-unit-radius-xs': '1',
		};

		const result = getBorderStyles(object);
		expect(result).toMatchSnapshot();
	});
});
