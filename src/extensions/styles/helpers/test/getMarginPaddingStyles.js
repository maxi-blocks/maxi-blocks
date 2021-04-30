import getMarginPaddingStyles from '../getMarginPaddingStyles';
import '@wordpress/block-editor';

describe('getMarginPaddingStyles', () => {
	it('Get a correct Margin', () => {
		const object = {
			'margin-top-general': 'default',
			'margin-right-general': 'default',
			'margin-bottom-general': 'default',
			'margin-left-general': 'default',
			'margin-sync-general': true,
			'margin-unit-general': ' px',
			'margin-top-xxl': 'default',
			'margin-right-xxl': 'default',
			'margin-bottom-xxl': 'default',
			'margin-left-xxl': 'default',
			'margin-sync-xxl': true,
			'margin-unit-xxl': ' %',
			'margin-top-xl': 'default',
			'margin-right-xl': 'default',
			'margin-bottom-xl': 'default',
			'margin-left-xl': 'default',
			'margin-sync-xl': true,
			'margin-unit-xl': ' %',
			'margin-top-l': 'default',
			'margin-right-l': 'default',
			'margin-bottom-l': 'default',
			'margin-left-l': 'default',
			'margin-sync-l': true,
			'margin-unit-l': ' px',
			'margin-top-m': 'default',
			'margin-right-m': 'default',
			'margin-bottom-m': 'default',
			'margin-left-m': 'default',
			'margin-sync-m': true,
			'margin-unit-m': ' px',
			'margin-top-s': 'default',
			'margin-right-s': 'default',
			'margin-bottom-s': 'default',
			'margin-left-s': 'default',
			'margin-sync-s': true,
			'margin-unit-s': ' %',
			'margin-top-xs': 'default',
			'margin-right-xs': 'default',
			'margin-bottom-xs': 'default',
			'margin-left-xs': 'default',
			'margin-sync-xs': true,
			'margin-unit-xs': ' px',
		};

		const result = getMarginPaddingStyles(object);
		expect(result).toMatchSnapshot();
	});
});
