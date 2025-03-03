import createTransitionObj from '@extensions/styles/transitions/createTransitionObj';

describe('createTransitionObj', () => {
	it('Creates default transition object', () => {
		const result = createTransitionObj();

		expect(result).toMatchSnapshot();
	});
});
