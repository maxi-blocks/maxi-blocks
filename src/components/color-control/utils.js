export const STANDARD_PALETTE_COLOR_DESCRIPTIONS = {
	1: 'backgrounds',
	2: 'backgrounds, borders',
	3: 'text, buttons',
	4: 'links, highlights',
	5: 'headings',
	6: 'hover',
	7: 'icons',
	8: 'shadows',
};

export const getStandardPaletteColorLabel = (color, fallbackLabel) => {
	const description = STANDARD_PALETTE_COLOR_DESCRIPTIONS[color];

	if (!description) return fallbackLabel;

	return `${fallbackLabel}: ${description}`;
};
