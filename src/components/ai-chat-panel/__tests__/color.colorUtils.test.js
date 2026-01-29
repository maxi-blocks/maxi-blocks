import { isHexColor, normalizeColorInput, normalizeHex } from '../ai/color/colorUtils';

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
