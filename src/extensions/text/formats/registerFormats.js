/**
 * WordPress dependencies
 */
import { registerFormatType } from '@wordpress/rich-text';

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
