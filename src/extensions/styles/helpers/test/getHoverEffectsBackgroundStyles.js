import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct Hover Effects', () => {
		const object = {};

		const result = getHoverEffectsBackgroundStyles(object);
		expect(result).toMatchSnapshot();
	});
});
