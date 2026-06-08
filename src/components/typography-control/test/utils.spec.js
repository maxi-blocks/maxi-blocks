import {
	getClosestAvailableFontWeight,
	getToggledFontStyle,
	shouldUseBlockTypographyFallback,
} from '@components/typography-control/utils';
import { select } from '@wordpress/data';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getFont: jest.fn(() => ({
					files: {
						100: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap',
						300: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap',
						400: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap',
						800: 'https://fonts.googleapis.com/css2?family=Roboto:wght@800&display=swap',
					},
				})),
			};
		}),
	};
});

describe('getClosestAvailableFontWeight', () => {
	it('should return the closest available font weight', () => {
		const targetWeight = '400';
		const font = 'Roboto';

		const result = getClosestAvailableFontWeight(font, targetWeight);

		expect(result).toBe('400');
	});

	it('should return the lower closest value', () => {
		const targetWeight = '200';
		const font = 'Roboto';

		const result = getClosestAvailableFontWeight(font, targetWeight);

		expect(result).toBe('100');
	});

	it('Should use the default weight if the target weight is not available', () => {
		select.mockImplementation(() => ({
			getFont: () => ({
				files: {},
			}),
		}));

		const targetWeight = '900';
		const font = 'Roboto';

		const result = getClosestAvailableFontWeight(font, targetWeight);

		expect(result).toBe(900);
	});
});

describe('shouldUseBlockTypographyFallback', () => {
	it('uses block typography when an opted-in caption control has no RichText format', () => {
		const result = shouldUseBlockTypographyFallback({
			useBlockLevelFallback: true,
			formatValue: {},
			onChangeTextFormat: jest.fn(),
		});

		expect(result).toBe(true);
	});

	it('keeps RichText formatting when an opted-in caption control has an active formatter', () => {
		const result = shouldUseBlockTypographyFallback({
			useBlockLevelFallback: true,
			isRichTextActive: true,
			formatValue: {
				start: 0,
				end: 7,
				formats: [],
				text: 'Caption',
			},
			onChangeTextFormat: jest.fn(),
		});

		expect(result).toBe(false);
	});

	it('uses block typography when the image is selected and caption RichText state is stale', () => {
		const result = shouldUseBlockTypographyFallback({
			useBlockLevelFallback: true,
			isRichTextActive: false,
			formatValue: {
				start: 0,
				end: 7,
				formats: [],
				text: 'Caption',
			},
			onChangeTextFormat: jest.fn(),
		});

		expect(result).toBe(true);
	});

	it('does not change existing typography controls unless they opt in', () => {
		const result = shouldUseBlockTypographyFallback({
			useBlockLevelFallback: false,
			formatValue: {},
			onChangeTextFormat: jest.fn(),
		});

		expect(result).toBe(false);
	});
});

describe('getToggledFontStyle', () => {
	it('returns italic when the current style is not italic', () => {
		expect(getToggledFontStyle('normal')).toBe('italic');
		expect(getToggledFontStyle(undefined)).toBe('italic');
	});

	it('returns normal when the current style is italic', () => {
		expect(getToggledFontStyle('italic')).toBe('normal');
	});
});
