import createSelectors from '@extensions/styles/custom-css/createSelectors';

describe('createSelectors', () => {
	const selectors = {
		canvas: '',
		button: 'buttonClassName',
	};

	it('Should create selectors', () => {
		expect(createSelectors(selectors)).toMatchSnapshot();
	});

	it('Should create selectors without pseudo elements', () => {
		expect(createSelectors(selectors, false)).toMatchSnapshot();
	});
});
