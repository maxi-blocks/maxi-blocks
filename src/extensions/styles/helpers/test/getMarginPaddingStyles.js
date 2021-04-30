import getMarginPaddingStyles from '../getMarginPaddingStyles';
import '@wordpress/block-editor';

describe('getMarginPaddingStyles', () => {
	it('Get a correct Margin', () => {
		const object = {
			'margin-top-general': 'general margin',
			'margin-right-general': 'general margin',
			'margin-bottom-general': 'general margin',
			'margin-left-general': 'general margin',
			'margin-sync-general': 'true',
			'margin-unit-general': ' px',
			'margin-top-xxl': 'xxl margin',
			'margin-right-xxl': 'xxl margin',
			'margin-bottom-xxl': 'xxl margin',
			'margin-left-xxl': 'xxl margin',
			'margin-sync-xxl': 'true',
			'margin-unit-xxl': ' %',
			'margin-top-xl': 'xl margin',
			'margin-right-xl': 'xl margin',
			'margin-bottom-xl': 'xl margin',
			'margin-left-xl': 'xl margin',
			'margin-sync-xl': 'true',
			'margin-unit-xl': ' %',
			'margin-top-l': 'l margin',
			'margin-right-l': 'l margin',
			'margin-bottom-l': 'l margin',
			'margin-left-l': 'l margin',
			'margin-sync-l': 'true',
			'margin-unit-l': ' px',
			'margin-top-m': 'm margin',
			'margin-right-m': 'm margin',
			'margin-bottom-m': 'm margin',
			'margin-left-m': 'm margin',
			'margin-sync-m': 'true',
			'margin-unit-m': ' px',
			'margin-top-s': 's margin',
			'margin-right-s': 's margin',
			'margin-bottom-s': 's margin',
			'margin-left-s': 's margin',
			'margin-sync-s': 'true',
			'margin-unit-s': ' %',
			'margin-top-xs': 'xs margin',
			'margin-right-xs': 'xs margin',
			'margin-bottom-xs': 'xs margin',
			'margin-left-xs': 'xs margin',
			'margin-sync-xs': 'true',
			'margin-unit-xs': ' px',
		};

		const result = getMarginPaddingStyles(object);
		expect(result).toMatchSnapshot();
	});
});
