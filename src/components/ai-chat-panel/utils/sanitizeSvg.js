/**
 * SVG sanitization utility for AI-generated icon content.
 * Lightweight — no dependency on iconSearch or editor/library.
 */
import DOMPurify from 'dompurify';

/**
 * Sanitizes SVG markup to remove scripts, event handlers, and other
 * XSS vectors while preserving valid SVG elements including <use>.
 *
 * @param {string} svg Raw SVG string.
 * @returns {string} Sanitized SVG string.
 */
const sanitizeSvg = svg => {
	if (typeof svg !== 'string' || !svg) return '';
	return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true }, ADD_TAGS: ['use'] });
};

export default sanitizeSvg;
export { sanitizeSvg };
