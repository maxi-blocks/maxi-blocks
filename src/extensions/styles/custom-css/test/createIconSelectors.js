import createIconSelectors from '@extensions/styles/custom-css/createIconSelectors';

describe('createIconSelectors', () => {
	const selectors = {
		icon: 'iconClassName',
	};

	it('Should create selectors', () => {
		expect(createIconSelectors(selectors)).toMatchSnapshot();
	});
});
