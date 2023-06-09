import createSelectors from '../createSelectors';

describe('createSelectors', () => {
	const selectors = {
		c: '',
		bt: 'buttonClassName',
	};

	it('Should create selectors', () => {
		expect(createSelectors(selectors)).toMatchSnapshot();
	});

	it('Should create selectors without pseudo elements', () => {
		expect(createSelectors(selectors, false)).toMatchSnapshot();
	});
});
