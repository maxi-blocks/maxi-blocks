import { __, sprintf } from '@wordpress/i18n';

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

	return sprintf(
		// translators: 1: palette color label, 2: short usage description.
		__('%1$s: %2$s', 'maxi-blocks'),
		fallbackLabel,
		description
	);
};

export const colorToHex = color => {
	if (typeof color !== 'string') return '';

	const hexMatch = color
		.trim()
		.match(/^#([\da-f]{3}|[\da-f]{6})(?:[\da-f]{2})?$/i);

	if (hexMatch) {
		const hex = hexMatch[1];

		return `#${
			hex.length === 3
				? hex
						.split('')
						.map(character => character.repeat(2))
						.join('')
				: hex
		}`.toUpperCase();
	}

	const rgbMatch = color
		.trim()
		.match(
			/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i
		);

	if (!rgbMatch) return '';

	const channels = rgbMatch.slice(1, 4).map(Number);

	if (channels.some(channel => channel > 255)) return '';

	return `#${channels
		.map(channel => channel.toString(16).padStart(2, '0'))
		.join('')}`.toUpperCase();
};

export const getCustomColorLabel = (color, fallbackLabel) =>
	color?.name || colorToHex(color?.value) || fallbackLabel;
