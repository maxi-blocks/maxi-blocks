import { normalizeColorValue } from '../ai/color/color.normalize';

describe('color.normalize', () => {
	test('prefers tokens when possible', () => {
		const result = normalizeColorValue('primary');
		expect(result.ok).toBe(true);
		expect(result.value).toContain('maxi');
	});

	test('normalizes hex values', () => {
		const result = normalizeColorValue('#fff');
		expect(result.ok).toBe(true);
		expect(result.value).toBeTruthy();
	});

	test('rejects invalid values', () => {
		const result = normalizeColorValue('');
		expect(result.ok).toBe(false);
	});
});
