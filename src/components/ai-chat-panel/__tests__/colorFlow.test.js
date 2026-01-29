import { normalizeColorValue } from '../ai/color/color.normalize';

describe('color flow', () => {
	test('prefers Maxi tokens', () => {
		const result = normalizeColorValue('primary');
		expect(result.ok).toBe(true);
		expect(result.value).toContain('maxi');
	});

	test('normalizes explicit hex', () => {
		const result = normalizeColorValue('#ff0000');
		expect(result.ok).toBe(true);
		expect(result.value).toBe('#ff0000');
	});
});
