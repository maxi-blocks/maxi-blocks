import getMarginPaddingStyles from '../getMarginPaddingStyles';

describe('getMarginPaddingStyles', () => {
	it('Get a correct margin and padding', () => {
		const obj = {
			'margin-top-general': '1',
			'margin-right-general': '2',
			'margin-bottom-general': '3',
			'margin-left-general': '4',
			'margin-sync-general': true,
			'margin-unit-general': 'px',
			'margin-top-xxl': '1',
			'margin-right-xxl': '2',
			'margin-bottom-xxl': '3',
			'margin-left-xxl': '4',
			'margin-sync-xxl': true,
			'margin-unit-xxl': '%',
			'margin-top-xl': '1',
			'margin-right-xl': '2',
			'margin-bottom-xl': '3',
			'margin-left-xl': '4',
			'margin-sync-xl': true,
			'margin-unit-xl': '%',
			'margin-top-l': '1',
			'margin-right-l': '2',
			'margin-bottom-l': '3',
			'margin-left-l': '4',
			'margin-sync-l': true,
			'margin-unit-l': 'px',
			'margin-top-m': '1',
			'margin-right-m': '2',
			'margin-bottom-m': '3',
			'margin-left-m': '4',
			'margin-sync-m': true,
			'margin-unit-m': 'px',
			'margin-top-s': '1',
			'margin-right-s': '2',
			'margin-bottom-s': '3',
			'margin-left-s': '4',
			'margin-sync-s': true,
			'margin-unit-s': '%',
			'margin-top-xs': '1',
			'margin-right-xs': '2',
			'margin-bottom-xs': '3',
			'margin-left-xs': '4',
			'margin-sync-xs': true,
			'margin-unit-xs': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
	});

	it('Different values ​​depends on the responsive', () => {
		const obj = {
			'margin-top-general': '11',
			'margin-right-general': '11',
			'margin-bottom-general': '11',
			'margin-left-general': '11',
			'margin-sync-general': true,
			'margin-unit-general': 'px',
			'margin-top-xxl': '12',
			'margin-right-xxl': '12',
			'margin-bottom-xxl': '12',
			'margin-left-xxl': '12',
			'margin-sync-xxl': true,
			'margin-unit-xxl': '%',
			'margin-top-xl': '45',
			'margin-right-xl': '45',
			'margin-bottom-xl': '45',
			'margin-left-xl': '45',
			'margin-sync-xl': true,
			'margin-unit-xl': '%',
			'margin-top-l': '5',
			'margin-right-l': '5',
			'margin-bottom-l': '5',
			'margin-left-l': '5',
			'margin-sync-l': true,
			'margin-unit-l': 'px',
			'margin-top-m': '0',
			'margin-right-m': '2',
			'margin-bottom-m': '6',
			'margin-left-m': '4',
			'margin-sync-m': true,
			'margin-unit-m': 'px',
			'margin-top-s': '0',
			'margin-right-s': '0',
			'margin-bottom-s': '0',
			'margin-left-s': '0',
			'margin-sync-s': true,
			'margin-unit-s': '%',
			'margin-top-xs': '1',
			'margin-right-xs': '1',
			'margin-bottom-xs': '1',
			'margin-left-xs': '1',
			'margin-sync-xs': true,
			'margin-unit-xs': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
	});
});
