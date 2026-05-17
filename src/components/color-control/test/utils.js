import {
	getStandardPaletteColorLabel,
	STANDARD_PALETTE_COLOR_DESCRIPTIONS,
} from '../utils';

describe('color control utils', () => {
	it('returns the short standard palette colour descriptions', () => {
		expect(STANDARD_PALETTE_COLOR_DESCRIPTIONS).toStrictEqual({
			1: 'backgrounds',
			2: 'backgrounds, borders',
			3: 'text, buttons',
			4: 'links, highlights',
			5: 'headings',
			6: 'hover',
			7: 'icon line',
			8: 'shadows',
		});
	});

	it('builds the standard palette colour label with the description', () => {
		expect(getStandardPaletteColorLabel(4, 'Colour 4')).toBe(
			'Colour 4: links, highlights'
		);
	});

	it('builds all short standard palette colour labels', () => {
		expect(
			[1, 2, 3, 4, 5, 6, 7, 8].map(item =>
				getStandardPaletteColorLabel(item, `Colour ${item}`)
			)
		).toStrictEqual([
			'Colour 1: backgrounds',
			'Colour 2: backgrounds, borders',
			'Colour 3: text, buttons',
			'Colour 4: links, highlights',
			'Colour 5: headings',
			'Colour 6: hover',
			'Colour 7: icon line',
			'Colour 8: shadows',
		]);
	});

	it('falls back to the provided label for unknown palette colours', () => {
		expect(
			getStandardPaletteColorLabel(9, 'Pallet box colour 9')
		).toBe('Pallet box colour 9');
	});
});
