import getAdvancedCssObject from '../getAdvancedCssObject';

describe('getAdvancedCssObject', () => {
	it('should handle basic CSS correctly', () => {
		const input = {
			'advanced-css': `
				background: red;
				.maxi-block-button {
					color: yellow;
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with no selectors', () => {
		const input = {
			'advanced-css': 'background: blue;',
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with multiple selectors', () => {
		const input = {
			'advanced-css': `
				background: green;
				.maxi-block-button {
					color: yellow;
				}
				.maxi-block-button,
				.maxi-block-button:hover {
					color: red;
				}
			`,
		};

		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with pseudo selectors', () => {
		const input = {
			'advanced-css': `
				background: green;
				.maxi-block-button {
					color: yellow;
				}
				.maxi-block-button:hover {
					color: red;
				}
				.maxi-block-button::before {
					content: 'before';
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	// Edge/invalid cases
	it('should handle CSS with missing closing brace', () => {
		const input = {
			'advanced-css': `
				background: yellow;
				p {
					text-align: center;
			`,
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with missing closing brace in nested braces', () => {
		const input = {
			'advanced-css': `
				background: yellow;
				p {
					text-align: center;

					div {
						color: red;
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with multiple unmatched braces', () => {
		const input = {
			'advanced-css': `
				background: teal;
				div {
					padding: 10px;
				p {
					margin: 5px;
			`,
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle empty CSS correctly', () => {
		const input = {
			'advanced-css': '',
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});
});
