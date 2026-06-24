/**
 * CSS security utilities for AI-generated style values.
 *
 * Strips dangerous CSS constructs that could be used for XSS or
 * data exfiltration when injected into block stylesheets.
 */

/** Patterns that are never safe in user/AI-supplied CSS declarations. */
const DANGEROUS_CSS_PATTERNS = [
	/expression\s*\(/gi,
	/-moz-binding\s*:/gi,
	/behavior\s*:/gi,
	/@import\b/gi,
	/@charset\b/gi,
];

/**
 * Matches `url(...)` with a non-http protocol.
 * Allows `url(https://...)`, `url(http://...)`, `url(data:image/...)`,
 * but blocks `url(javascript:...)`, `url(vbscript:...)`, etc.
 *
 * Data URIs are restricted to image MIME types only.
 */
const UNSAFE_URL_RE = /url\s*\(\s*['"]?\s*(javascript|vbscript)\s*:/gi;
const DATA_NON_IMAGE_RE = /url\s*\(\s*['"]?\s*data\s*:\s*(?!image\/)/gi;

/**
 * Sanitizes a CSS value string by removing dangerous constructs.
 * Intended for advanced/custom CSS declarations from AI or user input.
 *
 * @param {string} css Raw CSS string (declarations, not selectors/rules).
 * @returns {string} Sanitized CSS with dangerous patterns removed.
 */
export const sanitizeCssValue = css => {
	if (typeof css !== 'string') return '';
	let result = css;

	for (const pattern of DANGEROUS_CSS_PATTERNS) {
		result = result.replace(pattern, '/* blocked */');
	}

	result = result.replace(UNSAFE_URL_RE, '/* blocked-url */(');
	result = result.replace(DATA_NON_IMAGE_RE, '/* blocked-data */(');

	return result;
};

export default sanitizeCssValue;
