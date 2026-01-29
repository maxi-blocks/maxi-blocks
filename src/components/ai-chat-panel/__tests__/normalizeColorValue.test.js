import normalizeColorValue from '../ai/color/color.normalize';

describe('normalizeColorValue', () => {
	test('returns token vars for named colors', () => {
		const result = normalizeColorValue('primary');
		expect(result.ok).toBe(true);
		expect(result.value).toContain('var(--maxi-primary-color)');
		expect(result.kind).toBe('token');
	});

	test('normalizes hex to tokens when available', () => {
		const result = normalizeColorValue('#fff');
		expect(result.ok).toBe(true);
		expect(result.value).toContain('var(--maxi-white)');
	});

	test('accepts maxi css variables', () => {
		const result = normalizeColorValue('var(--maxi-primary-color)');
		expect(result.ok).toBe(true);
		expect(result.value).toBe('var(--maxi-primary-color)');
		expect(result.kind).toBe('var');
	});

	test('rejects empty values', () => {
		const result = normalizeColorValue('');
		expect(result.ok).toBe(false);
		expect(result.value).toBeNull();
	});
});

