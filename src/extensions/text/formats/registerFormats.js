/**
 * WordPress dependencies
 */
const { registerFormatType } = wp.richText;

/**
 * Formats
 */
import formats from './formats';

/**
 * Register formats
 */
formats.forEach(({ name, ...settings }) => {
	registerFormatType(name, settings);
});
