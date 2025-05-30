/**
 * Extract RGB values from a color string to use in CSS variables or other contexts
 *
 * @param {string|object} colorInput - The color string (rgba, hex, etc.) or object with value property
 * @return {string} The RGB values as a comma-separated string
 */
const extractRGBValues = colorInput => {
	if (!colorInput) return '0, 0, 0';

	// Handle color objects
	const colorValue =
		typeof colorInput === 'object' && colorInput.value
			? colorInput.value
			: colorInput;

	// Check if it's an rgba format with numbers
	const rgbaMatch = colorValue.match(
		/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
	);
	if (rgbaMatch) {
		return `${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}`;
	}

	// Check if it's an rgb/rgba format with percentages
	const rgbaPercentMatch = colorValue.match(
		/rgba?\((\d+)%,\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/
	);
	if (rgbaPercentMatch) {
		// Convert percentages to 0-255 values
		const r = Math.round((parseInt(rgbaPercentMatch[1], 10) / 100) * 255);
		const g = Math.round((parseInt(rgbaPercentMatch[2], 10) / 100) * 255);
		const b = Math.round((parseInt(rgbaPercentMatch[3], 10) / 100) * 255);
		return `${r}, ${g}, ${b}`;
	}

	// If it's a hex color, handle different formats
	if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
		const hex = colorValue.replace('#', '');

		// Handle shorthand 3-digit hex (#RGB)
		if (hex.length === 3) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			return `${r}, ${g}, ${b}`;
		}

		// Handle shorthand 4-digit hex with alpha (#RGBA)
		if (hex.length === 4) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			// Alpha value at hex[3] is ignored for RGB output
			return `${r}, ${g}, ${b}`;
		}

		// Handle standard 6-digit hex (#RRGGBB)
		if (hex.length === 6) {
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			return `${r}, ${g}, ${b}`;
		}

		// Handle 8-digit hex with alpha (#RRGGBBAA)
		if (hex.length === 8) {
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			// Alpha value at positions 6-7 is ignored for RGB output
			return `${r}, ${g}, ${b}`;
		}
	}

	// Handle named colors by creating a temporary element to get computed values
	if (
		typeof colorValue === 'string' &&
		!colorValue.includes(',') &&
		!colorValue.startsWith('#')
	) {
		try {
			const tempElement = document.createElement('div');
			tempElement.style.color = colorValue;
			document.body.appendChild(tempElement);
			const computedColor = getComputedStyle(tempElement).color;
			document.body.removeChild(tempElement);

			// Extract RGB from computed color (should be in rgb/rgba format)
			const computedMatch = computedColor.match(
				/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
			);
			if (computedMatch) {
				return `${computedMatch[1]}, ${computedMatch[2]}, ${computedMatch[3]}`;
			}
		} catch (e) {
			// Silent fail if browser doesn't support this approach
		}
	}

	// Default fallback - ensure we don't return values with # or other non-RGB characters
	// Return a safe default instead of potentially breaking CSS
	return '0, 0, 0';
};

export default extractRGBValues;
