import getClipPathStyles from '../getClipPathStyles';

describe('getClipPathStyles', () => {
	it('Get a correct clipPath styles', () => {
		const object = {
			'clip-path-status-general': true,
			'clip-path-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
			'clip-path-status-l': true,
			'clip-path-l': 'polygon(50% 0%, 0% 100%, 100% 100%)',
			'clip-path-status-xl': true,
			'clip-path-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
			'clip-path-status-xxl': true,
			'clip-path-xxl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
			'clip-path-status-m': true,
			'clip-path-m': 'polygon(50% 0%, 0% 100%, 100% 100%)',
			'clip-path-status-s': true,
			'clip-path-s': 'polygon(50% 0%, 0% 100%, 100% 100%)',
			'clip-path-status-xs': true,
			'clip-path-xs': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		};

		const result = getClipPathStyles(object);
		expect(result).toMatchSnapshot();
	});
});
