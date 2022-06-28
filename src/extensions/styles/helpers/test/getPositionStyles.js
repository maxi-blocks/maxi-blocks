import getPositionStyles from '../getPositionStyles';

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
			'position-top-unit-general': 'px',
			'position-right-unit-general': 'em',
			'position-bottom-unit-general': 'vw',
			'position-left-unit-general': '%',
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
			'position-top-unit-xl': 'px',
			'position-right-unit-xl': 'em',
			'position-bottom-unit-xl': 'vw',
			'position-left-unit-xl': '%',
			'position-top-l': 1,
			'position-right-l': 2,
			'position-bottom-l': 3,
			'position-left-l': 4,
			'position-sync-l': true,
			'position-top-unit-l': 'px',
			'position-right-unit-l': 'em',
			'position-bottom-unit-l': 'vw',
			'position-left-unit-l': '%',
			'position-top-m': 1,
			'position-right-m': 2,
			'position-bottom-m': 3,
			'position-left-m': 4,
			'position-sync-m': true,
			'position-unit-top-m': 'px',
			'position-unit-right-m': 'em',
			'position-unit-bottom-m': 'vw',
			'position-unit-left-m': '%',
			'position-top-s': 1,
			'position-right-s': 2,
			'position-bottom-s': 3,
			'position-left-s': 4,
			'position-sync-s': true,
			'position-top-unit-s': 'px',
			'position-right-unit-s': 'em',
			'position-bottom-unit-s': 'vw',
			'position-left-unit-s': '%',
			'position-top-xs': 1,
			'position-right-xs': 2,
			'position-bottom-xs': 3,
			'position-left-xs': 4,
			'position-sync-xs': true,
			'position-top-unit-xs': 'px',
			'position-right-unit-xs': 'em',
			'position-bottom-unit-xs': 'vw',
			'position-left-unit-xs': '%',
		};
		const result = getPositionStyles(object);
		expect(result).toMatchSnapshot();
	});
});
