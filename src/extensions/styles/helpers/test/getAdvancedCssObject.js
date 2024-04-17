import getAdvancedCssObject from '../getAdvancedCssObject';

/**
 * PHP snapshots
 */
import handleBasicCssCorrectly from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_basic_css_correctly__1.json';
import handleCssWithNoSelectors from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_no_selectors__1.json';
import handleCssWithSelectorsWithSpaces from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_selectors_with_spaces__1.json';
import handleCssWithMultipleSelectors from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_multiple_selectors__1.json';
import handleCssWithPseudoSelectors from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_pseudo_selectors__1.json';
import handleAllResponsiveBreakpointsCorrectly from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_all_responsive_breakpoints_correctly__1.json';
import handleSubsetOfResponsiveBreakpointsCorrectly from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_a_subset_of_responsive_breakpoints_correctly__1.json';
import handleComplexCssStructuresAcrossBreakpoints from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_complex_css_structures_across_breakpoints__1.json';
import handleCssWithMissingClosingBrace from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_missing_closing_brace__1.json';
import handleCssWithMissingClosingBraceInNestedBraces from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_missing_closing_brace_in_nested_braces__1.json';
import handleCssWithMultipleUnmatchedBraces from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_css_with_multiple_unmatched_braces__1.json';
import handleEmptyCssCorrectly from '../../../../../tests/__snapshots__/Get_Advanced_Css_Object_Test__test_should_handle_empty_css_correctly__1.json';

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
		expect(result).toEqual(handleBasicCssCorrectly);
	});

	it('should handle CSS with no selectors', () => {
		const input = {
			'advanced-css-general': 'background: blue;',
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(handleCssWithNoSelectors);
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
		expect(result).toEqual(handleCssWithSelectorsWithSpaces);
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
		expect(result).toEqual(handleCssWithMultipleSelectors);
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
		expect(result).toEqual(handleCssWithPseudoSelectors);
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
		expect(result).toEqual(handleAllResponsiveBreakpointsCorrectly);
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
		expect(result).toEqual(handleSubsetOfResponsiveBreakpointsCorrectly);
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
		expect(result).toEqual(handleComplexCssStructuresAcrossBreakpoints);
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
		expect(result).toEqual(handleCssWithMissingClosingBrace);
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
		expect(result).toEqual(handleCssWithMissingClosingBraceInNestedBraces);
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
		expect(result).toEqual(handleCssWithMultipleUnmatchedBraces);
	});

	it('should handle empty CSS correctly', () => {
		const input = {
			'advanced-css-general': '',
		};
		const result = getAdvancedCssObject(input);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(handleEmptyCssCorrectly);
	});
});
