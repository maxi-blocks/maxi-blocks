import { isHexColor, normalizeColorInput, normalizeHex } from '../ai/color/colorUtils';
import { normalizeColorValue } from '../ai/color/color.normalize';

describe('color utils', () => {
	test('detects hex colors', () => {
		expect(isHexColor('#fff')).toBe(true);
		expect(isHexColor('#ffffff')).toBe(true);
		expect(isHexColor('red')).toBe(false);
	});

	test('normalizes hex colors', () => {
		expect(normalizeHex('#fff')).toBe('#ffffff');
	});

	test('prefers tokens for known hex values', () => {
		const result = normalizeColorInput('#ffffff');
		expect(result.value).toContain('maxi');
	});
});

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
