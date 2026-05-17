import { __ } from '@wordpress/i18n';
import {
	getStandardPaletteColorLabel,
	STANDARD_PALETTE_COLOR_DESCRIPTIONS,
} from '../utils';

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => `translated ${text}`),
}));

describe('color control utils', () => {
	it('returns translated short standard palette colour descriptions', () => {
		expect(STANDARD_PALETTE_COLOR_DESCRIPTIONS).toStrictEqual({
			1: 'translated backgrounds',
			2: 'translated backgrounds, borders',
			3: 'translated text, buttons',
			4: 'translated links, highlights',
			5: 'translated headings',
			6: 'translated hover',
			7: 'translated icon line',
			8: 'translated shadows',
		});
		expect(__).toHaveBeenCalledWith('icon line', 'maxi-blocks');
	});

	it('builds the standard palette colour label with the description', () => {
		expect(getStandardPaletteColorLabel(4, 'Colour 4')).toBe(
			'Colour 4: translated links, highlights'
		);
	});

	it('builds all short standard palette colour labels', () => {
		expect(
			[1, 2, 3, 4, 5, 6, 7, 8].map(item =>
				getStandardPaletteColorLabel(item, `Colour ${item}`)
			)
		).toStrictEqual([
			'Colour 1: translated backgrounds',
			'Colour 2: translated backgrounds, borders',
			'Colour 3: translated text, buttons',
			'Colour 4: translated links, highlights',
			'Colour 5: translated headings',
			'Colour 6: translated hover',
			'Colour 7: translated icon line',
			'Colour 8: translated shadows',
		]);
	});

	it('falls back to the provided label for unknown palette colours', () => {
		expect(
			getStandardPaletteColorLabel(9, 'Pallet box colour 9')
		).toBe('Pallet box colour 9');
	});
});
