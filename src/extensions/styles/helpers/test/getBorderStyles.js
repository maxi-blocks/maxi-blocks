import getBorderStyles from '../getBorderStyles';

describe('getZIndexStyle', () => {
	it('Get a correct style', () => {
		const object = {};
		const result = getBorderStyles(object);
		expect(result).toMatchSnapshot();
	});
});
