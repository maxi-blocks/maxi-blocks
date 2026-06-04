/**
 * Internal dependencies
 */
import sanitizeLinkAttributes from '@extensions/link/sanitizeLinkAttributes';

const sanitizeLinkFormatValue = formatValue => {
	if (!formatValue?.formats) return formatValue;

	const sanitizedFormats = new WeakMap();
	const sanitizeFormat = format => {
		if (format?.type !== 'maxi-blocks/text-link') return format;

		if (sanitizedFormats.has(format)) return sanitizedFormats.get(format);

		const sanitizedFormat = {
			...format,
			attributes: sanitizeLinkAttributes(format.attributes),
		};

		sanitizedFormats.set(format, sanitizedFormat);

		return sanitizedFormat;
	};

	return {
		...formatValue,
		activeFormats: formatValue.activeFormats?.map(sanitizeFormat),
		formats: formatValue.formats.map(formatArray =>
			formatArray?.map(sanitizeFormat)
		),
	};
};

export default sanitizeLinkFormatValue;
