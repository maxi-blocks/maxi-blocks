import { __ } from '@wordpress/i18n';

export const STANDARD_PALETTE_COLOR_DESCRIPTIONS = {
	1: __('backgrounds', 'maxi-blocks'),
	2: __('backgrounds, borders', 'maxi-blocks'),
	3: __('text, buttons', 'maxi-blocks'),
	4: __('links, highlights', 'maxi-blocks'),
	5: __('headings', 'maxi-blocks'),
	6: __('hover', 'maxi-blocks'),
	7: __('icon line', 'maxi-blocks'),
	8: __('shadows', 'maxi-blocks'),
};

export const getStandardPaletteColorLabel = (color, fallbackLabel) => {
	const description = STANDARD_PALETTE_COLOR_DESCRIPTIONS[color];

	if (!description) return fallbackLabel;

	return `${fallbackLabel}: ${description}`;
};
