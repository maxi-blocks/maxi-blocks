import getAdvancedCssObject from '@extensions/styles/helpers/getAdvancedCssObject';
import { buildAdvancedCssMediaQueryTarget } from '@extensions/styles/advancedCssMediaQuery';

describe('getAdvancedCssObject', () => {
	it('should handle basic CSS correctly', () => {
		const input = {
			'advanced-css-general': `
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
			'advanced-css-general': 'background: blue;',
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with selectors with spaces', () => {
		const input = {
			'advanced-css-general': `
				background: green;
				.maxi-block-button button .maxi-block-button__content {
					color: yellow;
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle CSS with multiple selectors', () => {
		const input = {
			'advanced-css-general': `
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
			'advanced-css-general': `
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

	it('should handle media query selectors', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const input = {
			'advanced-css-general': `
				${mediaQuery} {
					.nav_search {
						background: red !important;
						color: white !important;
					}
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		const mediaTarget = buildAdvancedCssMediaQueryTarget(
			mediaQuery,
			' .nav_search'
		);

		expect(result[mediaTarget].advancedCss.general.css).toBe(
			'background: red !important; color: white !important;'
		);
		expect(result['']).toBeUndefined();
	});

	it('should scope media query selectors to the same block when they use a custom class', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const input = {
			extraClassName: 'nav_search',
			'advanced-css-general': `
				${mediaQuery} {
					.nav_search {
						background: red !important;
					}
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		const mediaTarget = buildAdvancedCssMediaQueryTarget(
			mediaQuery,
			'.nav_search'
		);

		expect(result[mediaTarget].advancedCss.general.css).toBe(
			'background: red !important;'
		);
		expect(
			result[
				buildAdvancedCssMediaQueryTarget(mediaQuery, ' .nav_search')
			]
		).toBeUndefined();
	});

	it('should not scope selectors that only prefix-match a custom class', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const input = {
			extraClassName: 'nav_search',
			'advanced-css-general': `
				${mediaQuery} {
					.nav_search_extra {
						background: red !important;
					}
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		const descendantTarget = buildAdvancedCssMediaQueryTarget(
			mediaQuery,
			' .nav_search_extra'
		);

		expect(result[descendantTarget].advancedCss.general.css).toBe(
			'background: red !important;'
		);
		expect(
			result[
				buildAdvancedCssMediaQueryTarget(mediaQuery, '.nav_search_extra')
			]
		).toBeUndefined();
	});

	it('should keep media query selectors separate from regular selectors', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const input = {
			'advanced-css-general': `
				${mediaQuery} {
					.nav_search {
						background: red !important;
					}
				}
				.nav_search {
					background: blue !important;
				}
			`,
		};
		const result = getAdvancedCssObject(input);
		const mediaTarget = buildAdvancedCssMediaQueryTarget(
			mediaQuery,
			' .nav_search'
		);

		expect(result[mediaTarget].advancedCss.general.css).toBe(
			'background: red !important;'
		);
		expect(result[' .nav_search'].advancedCss.general.css).toBe(
			'background: blue !important;'
		);
	});

	it('should handle all responsive breakpoints correctly', () => {
		const input = {
			'advanced-css-general': `
                .maxi-block-button {
                    background: white;
                }
            `,
			'advanced-css-xxl': `
                .maxi-block-button {
                    font-size: 24px;
                }
            `,
			'advanced-css-xl': `
                .maxi-block-button {
                    font-size: 22px;
                }
            `,
			'advanced-css-l': `
                .maxi-block-button {
                    font-size: 20px;
                }
            `,
			'advanced-css-m': `
                .maxi-block-button {
                    font-size: 18px;
                }
            `,
			'advanced-css-s': `
                .maxi-block-button {
                    font-size: 16px;
                }
            `,
			'advanced-css-xs': `
                .maxi-block-button {
                    font-size: 14px;
                }
            `,
		};

		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle a subset of responsive breakpoints correctly', () => {
		const input = {
			'advanced-css-general': `
                .maxi-block-button {
                    background: white;
                }
            `,
			'advanced-css-xxl': `
                .maxi-block-button {
                    font-size: 24px;
                }
            `,
			'advanced-css-m': `
                .maxi-block-button {
                    font-size: 18px;
                }
            `,
			'advanced-css-s': `
                .maxi-block-button {
                    font-size: 16px;
                }
            `,
		};

		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	it('should handle complex CSS structures across breakpoints', () => {
		const input = {
			'advanced-css-general': `
            	font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                .maxi-block-button {
                    display: block;
                    margin: 10px 0;
                    text-align: center;
                    transition: background-color 0.3s ease;
                }
            `,
			'advanced-css-xxl': `
                font-size: 18px;
                .maxi-block-button {
                    padding: 15px 25px;
                    border-radius: 5px;
                }
                .maxi-block-button:hover {
                    background-color: #eee;
                }
            `,
			'advanced-css-xl': `
				font-size: 16px;
                .maxi-block-button {
                    padding: 14px 23px;
                }
                .maxi-block-button::before {
                    content: 'XL';
                }
            `,
			'advanced-css-l': `
                font-size: 15px;
                .maxi-block-button {
                    padding: 13px 21px;
                }
                nav ul li {
                    display: inline-block;
                    margin-right: 20px;
                }
            `,
			'advanced-css-m': `
                font-size: 14px;
                .maxi-block-button {
                    padding: 12px 20px;
                }
                nav ul li {
                    display: block;
                    margin-bottom: 10px;
                }
            `,
			'advanced-css-s': `
                .maxi-block-button {
                    padding: 11px 18px;
                }
            `,
			'advanced-css-xs': `
                .maxi-block-button {
                    padding: 10px 15px;
                    font-size: 12px;
                }
            `,
		};

		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});

	// Edge/invalid cases
	it('should handle CSS with missing closing brace', () => {
		const input = {
			'advanced-css-general': `
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
			'advanced-css-general': `
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
			'advanced-css-general': `
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
			'advanced-css-general': '',
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
	});
});
