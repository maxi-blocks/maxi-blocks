import {
	getAdvancedCssChange,
	isValidAdvancedCss,
} from '@components/advanced-css-control/utils';

const transformCssCode = code => {
	if (!code) return '';

	const selectorRegex =
		/([@a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/;
	const matches = code.match(selectorRegex);

	if (matches?.index > 0) {
		return `body {${code.substring(0, matches.index)}}${code.substring(
			matches.index
		)}`;
	}

	if (!matches) return `body {${code}}`;

	return code;
};

describe('advanced-css-control utils', () => {
	it('validates declaration-only CSS', () => {
		expect(isValidAdvancedCss('background: red;', transformCssCode)).toBe(
			true
		);
	});

	it('validates mixed declaration and selector CSS', () => {
		expect(
			isValidAdvancedCss(
				`
					background: red;
					.wp-block-gallery .wp-block-image {
						outline: 2px solid blue !important;
					}
				`,
				transformCssCode
			)
		).toBe(true);
	});

	it('validates nested at-rule CSS', () => {
		expect(
			isValidAdvancedCss(
				`
					@media (min-width: 600px) {
						.wp-block-gallery {
							gap: 20px;
						}
					}
				`,
				transformCssCode
			)
		).toBe(true);
	});

	it('rejects a missing closing brace', () => {
		expect(
			isValidAdvancedCss(
				`
					.test {
						color: red;
				`,
				transformCssCode
			)
		).toBe(false);
	});

	it('rejects declarations without a property colon', () => {
		expect(
			isValidAdvancedCss(
				`
					.test {
						color red;
					}
				`,
				transformCssCode
			)
		).toBe(false);
	});

	it('allows braces and semicolons inside strings', () => {
		expect(
			isValidAdvancedCss(
				`
					.test::before {
						content: "{;}";
					}
				`,
				transformCssCode
			)
		).toBe(true);
	});

	it('persists valid Advanced CSS', () => {
		expect(
			getAdvancedCssChange({
				code: '.test { color: red; }',
				currentValue: '',
				transformCssCode,
			})
		).toEqual({
			isValid: true,
			notValidCode: undefined,
			valueToPersist: '.test { color: red; }',
			shouldUpdateAttribute: true,
		});
	});

	it('skips attribute updates when valid Advanced CSS is unchanged', () => {
		expect(
			getAdvancedCssChange({
				code: '.test { color: red; }',
				currentValue: '.test { color: red; }',
				transformCssCode,
			})
		).toEqual({
			isValid: true,
			notValidCode: undefined,
			valueToPersist: '.test { color: red; }',
			shouldUpdateAttribute: false,
		});
	});

	it('removes the saved attribute when Advanced CSS is empty', () => {
		expect(
			getAdvancedCssChange({
				code: '',
				currentValue: '.test { color: blue; }',
				transformCssCode,
			})
		).toEqual({
			isValid: true,
			notValidCode: undefined,
			valueToPersist: undefined,
			shouldUpdateAttribute: true,
		});
	});

	it('skips attribute updates when empty Advanced CSS is already unsaved', () => {
		expect(
			getAdvancedCssChange({
				code: '',
				currentValue: undefined,
				transformCssCode,
			})
		).toEqual({
			isValid: true,
			notValidCode: undefined,
			valueToPersist: undefined,
			shouldUpdateAttribute: false,
		});
	});

	it('keeps invalid Advanced CSS local without creating a saved attribute', () => {
		expect(
			getAdvancedCssChange({
				code: '.test { color: red;',
				currentValue: undefined,
				transformCssCode,
			})
		).toEqual({
			isValid: false,
			notValidCode: '.test { color: red;',
			valueToPersist: undefined,
			shouldUpdateAttribute: false,
		});
	});

	it('removes the saved attribute when an existing value becomes invalid', () => {
		expect(
			getAdvancedCssChange({
				code: '.test { color: red;',
				currentValue: '.test { color: blue; }',
				transformCssCode,
			})
		).toEqual({
			isValid: false,
			notValidCode: '.test { color: red;',
			valueToPersist: undefined,
			shouldUpdateAttribute: true,
		});
	});
});
