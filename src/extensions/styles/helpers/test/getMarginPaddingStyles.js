import getMarginPaddingStyles from '../getMarginPaddingStyles';

describe('getMarginPaddingStyles', () => {
	it('Get a correct Margin', () => {
		const object = {
			'margin-top-general': 'test',
			'margin-right-general': 'test',
			'margin-bottom-general': 'test',
			'margin-left-general': 'test',
			'margin-sync-general': 'true',
			'margin-unit-general': 'test',
			'margin-top-xxl': 'test',
			'margin-right-xxl': 'test',
			'margin-bottom-xxl': 'test',
			'margin-left-xxl': 'test',
			'margin-sync-xxl': 'true',
			'margin-unit-xxl': 'test',
			'margin-top-xl': 'test',
			'margin-right-xl': 'test',
			'margin-bottom-xl': 'test',
			'margin-left-xl': 'test',
			'margin-sync-xl': 'true',
			'margin-unit-xl': 'test',
			'margin-top-l': 'test',
			'margin-right-l': 'test',
			'margin-bottom-l': 'test',
			'margin-left-l': 'test',
			'margin-sync-l': 'true',
			'margin-unit-l': 'test',
			'margin-top-m': 'test',
			'margin-right-m': 'test',
			'margin-bottom-m': 'test',
			'margin-left-m': 'test',
			'margin-sync-m': 'true',
			'margin-unit-m': 'test',
			'margin-top-s': 'test',
			'margin-right-s': 'test',
			'margin-bottom-s': 'test',
			'margin-left-s': 'test',
			'margin-sync-s': 'true',
			'margin-unit-s': 'test',
			'margin-top-xs': 'test',
			'margin-right-xs': 'test',
			'margin-bottom-xs': 'test',
			'margin-left-xs': 'test',
			'margin-sync-xs': 'true',
			'margin-unit-xs': 'test',
		};

		const result = getMarginPaddingStyles(object);
		expect(result).toMatchSnapshot();
	});
});
