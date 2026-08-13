import { __, sprintf } from '@wordpress/i18n';
import {
	colorToHex,
	getCustomColorLabel,
	getStandardPaletteColorLabel,
	STANDARD_PALETTE_COLOR_DESCRIPTIONS,
} from '../utils';

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => `translated ${text}`),
	sprintf: jest.fn((text, ...args) =>
		args.reduce(
			(output, value, index) =>
				output.replace(`%${index + 1}$s`, value),
			text
		)
	),
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
			'translated Colour 4: translated links, highlights'
		);
		expect(__).toHaveBeenCalledWith('%1$s: %2$s', 'maxi-blocks');
		expect(sprintf).toHaveBeenCalledWith(
			'translated %1$s: %2$s',
			'Colour 4',
			'translated links, highlights'
		);
	});

	it('builds all short standard palette colour labels', () => {
		expect(
			[1, 2, 3, 4, 5, 6, 7, 8].map(item =>
				getStandardPaletteColorLabel(item, `Colour ${item}`)
			)
		).toStrictEqual([
			'translated Colour 1: translated backgrounds',
			'translated Colour 2: translated backgrounds, borders',
			'translated Colour 3: translated text, buttons',
			'translated Colour 4: translated links, highlights',
			'translated Colour 5: translated headings',
			'translated Colour 6: translated hover',
			'translated Colour 7: translated icon line',
			'translated Colour 8: translated shadows',
		]);
	});

	it('falls back to the provided label for unknown palette colours', () => {
		expect(
			getStandardPaletteColorLabel(9, 'Pallet box colour 9')
		).toBe('Pallet box colour 9');
	});

	it('converts RGB and RGBA colours to uppercase hex labels', () => {
		expect(colorToHex('rgb(15, 160, 255)')).toBe('#0FA0FF');
		expect(colorToHex('rgba(120, 45, 80, 0.5)')).toBe('#782D50');
	});

	it('normalizes existing hex colours and ignores their alpha channel', () => {
		expect(colorToHex('#abc')).toBe('#AABBCC');
		expect(colorToHex('#12ab34cc')).toBe('#12AB34');
	});

	it('returns an empty label for invalid colours', () => {
		expect(colorToHex('transparent')).toBe('');
		expect(colorToHex('rgb(256, 0, 0)')).toBe('');
		expect(colorToHex()).toBe('');
	});

	it('uses the custom colour name before its generated hex label', () => {
		expect(
			getCustomColorLabel(
				{ name: 'Brand colour', value: 'rgb(15, 160, 255)' },
				'Custom Colour'
			)
		).toBe('Brand colour');
	});

	it('uses a hex label for an unnamed custom colour', () => {
		expect(
			getCustomColorLabel(
				{ name: '', value: 'rgba(120, 45, 80, 1)' },
				'Custom Colour'
			)
		).toBe('#782D50');
	});

	it('uses the fallback label when the custom colour cannot be converted', () => {
		expect(
			getCustomColorLabel(
				{ name: '', value: 'transparent' },
				'Custom Colour'
			)
		).toBe('Custom Colour');
	});
});
