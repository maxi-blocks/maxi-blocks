import setTransitionToSelectors from '@extensions/styles/transitions/setTransitionToSelectors';

describe('setTransitionToSelectors', () => {
	it('Adds transition styles to non-hover selectors', () => {
		const selectors = {
			'.button': { color: 'blue' },
			'.button:hover': { color: 'red' },
			'.icon': { background: 'black' },
		};
		const transitionStyles = 'all 0.3s ease';

		const result = setTransitionToSelectors(selectors, transitionStyles);

		// Check non-hover selectors have transition
		expect(result['.button']).toEqual({
			color: 'blue',
			transition: transitionStyles,
		});
		expect(result['.icon']).toEqual({
			background: 'black',
			transition: transitionStyles,
		});

		// Check hover selector remains unchanged
		expect(result['.button:hover']).toEqual({
			color: 'red',
		});
	});

	it('Preserves existing styles while adding transition', () => {
		const selectors = {
			'.button': {
				color: 'blue',
				padding: '10px',
				margin: '5px',
			},
		};
		const transitionStyles = 'all 0.3s ease';

		const result = setTransitionToSelectors(selectors, transitionStyles);

		expect(result['.button']).toEqual({
			color: 'blue',
			padding: '10px',
			margin: '5px',
			transition: transitionStyles,
		});
	});

	it('Returns original selectors when no transition styles provided', () => {
		const selectors = {
			'.button': { color: 'blue' },
			'.button:hover': { color: 'red' },
		};

		const result = setTransitionToSelectors(selectors);

		expect(result).toEqual(selectors);
	});

	it('Handles empty selectors object', () => {
		const result = setTransitionToSelectors({}, 'all 0.3s ease');
		expect(result).toEqual({});
	});
});
