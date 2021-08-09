import getPositionStyles from '../getPositionStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getPositionStyles', () => {
	it('Get a correct position styles', () => {
		const object = {
			'position-general': 'relative',
			'position-xxl': 'absolute',
			'position-xl': 'relative',
			'position-l': 'absolute',
			'position-m': 'relative',
			'position-s': 'absolute',
			'position-xs': 'relative',
			'position-top-general': 1,
			'position-right-general': 2,
			'position-bottom-general': 3,
			'position-left-general': 4,
			'position-sync-general': true,
			'position-unit-general': 'px',
			'position-top-xxl': 1,
			'position-right-xxl': 2,
			'position-bottom-xxl': 3,
			'position-left-xxl': 4,
			'position-sync-xxl': true,
			'position-unit-xxl': 'px',
			'position-top-xl': 1,
			'position-right-xl': 2,
			'position-bottom-xl': 3,
			'position-left-xl': 4,
			'position-sync-xl': true,
			'position-unit-xl': 'px',
			'position-top-l': 1,
			'position-right-l': 2,
			'position-bottom-l': 3,
			'position-left-l': 4,
			'position-sync-l': true,
			'position-unit-l': 'px',
			'position-top-m': 1,
			'position-right-m': 2,
			'position-bottom-m': 3,
			'position-left-m': 4,
			'position-sync-m': true,
			'position-unit-m': 'px',
			'position-top-s': 1,
			'position-right-s': 2,
			'position-bottom-s': 3,
			'position-left-s': 4,
			'position-sync-s': true,
			'position-unit-s': 'px',
			'position-top-xs': 1,
			'position-right-xs': 2,
			'position-bottom-xs': 3,
			'position-left-xs': 4,
			'position-sync-xs': true,
			'position-unit-xs': 'px',
		};
		const result = getPositionStyles(object);
		expect(result).toMatchSnapshot();
	});
});
