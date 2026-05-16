import { transformAdvancedCssCode } from '../utils';

describe('transformAdvancedCssCode', () => {
	it('wraps declaration-only CSS for validation', () => {
		expect(transformAdvancedCssCode('background: red;')).toBe(
			'body {background: red;}'
		);
	});

	it('does not wrap media query CSS for validation', () => {
		const css = `@media screen and (max-width:1160px) and (min-width:1025px) {
  .selector {
    background: red !important;
  }
}`;

		expect(transformAdvancedCssCode(css)).toBe(css);
	});

	it('wraps leading declarations before the first selector', () => {
		expect(
			transformAdvancedCssCode('background: red;\n.selector { color: blue; }')
		).toBe('body {background: red;}\n.selector { color: blue; }');
	});
});
