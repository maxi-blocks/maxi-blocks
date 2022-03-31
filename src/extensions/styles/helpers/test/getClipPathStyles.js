import getClipPathStyles from '../getClipPathStyles';

describe('getOpacityStyles', () => {
	it('Get a correct clipPath styles', () => {
		const object = {
			'clip-path-status': true,
			'clip-path': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		};

		const result = getClipPathStyles(object);
		expect(result).toMatchSnapshot();
	});
});
