/**
 * English anchor words — high-frequency English function words and domain-specific
 * verbs/nouns used in the AI chat. If ANY of these appear in a Latin-script message,
 * it is treated as English and routed through the normal client-side pipeline.
 *
 * Keep this list conservative: only add words that are unambiguously English
 * and would not appear as a loanword in common European languages.
 */
const ENGLISH_ANCHORS = new Set([
	// Function words
	'the', 'a', 'an', 'and', 'or', 'is', 'are', 'was', 'were', 'be', 'been',
	'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
	'should', 'can', 'may', 'might', 'must', 'shall',
	'i', 'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its',
	'this', 'that', 'these', 'those',
	'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
	'please', 'want', 'need', 'just', 'also',
	// Common AI chat verbs
	'add', 'make', 'set', 'change', 'update', 'remove', 'delete', 'reset',
	'create', 'insert', 'build', 'generate', 'give', 'turn', 'use', 'get',
	'put', 'apply', 'open', 'close', 'show', 'hide', 'toggle', 'enable',
	'disable', 'publish', 'save', 'draft', 'schedule', 'preview',
	// Domain-specific nouns
	'button', 'text', 'image', 'icon', 'container', 'section', 'column',
	'row', 'block', 'page', 'heading', 'title', 'divider', 'slider', 'video',
	'background', 'border', 'shadow', 'color', 'colour', 'font', 'padding',
	'margin', 'width', 'height', 'size', 'spacing', 'layout', 'style',
	'theme', 'card', 'hero', 'footer', 'header', 'nav', 'grid', 'gallery',
	'full', 'side', 'stack', 'center', 'align', 'hover', 'click', 'mobile',
	'desktop', 'tablet', 'dark', 'light', 'free', 'pro', 'expand', 'collapse',
	'open', 'close', 'shadow', 'rounded', 'transparent', 'opacity',
]);

/**
 * Returns true when the message is confidently non-English.
 *
 * Conservative by design: false negatives (treating non-English as English)
 * are safe — the client router will fail to match and fall through to the LLM
 * passthrough anyway. False positives (treating English as non-English) are
 * also safe but wasteful (costs one extra API call).
 *
 * Algorithm (three tiers):
 * 1. Language-agnostic inputs (numeric, hex, URL-only) → false, let router handle.
 * 2. Any non-ASCII character → true (Cyrillic, Arabic, CJK, Hebrew, Devanagari…).
 * 3. ASCII-only with no English anchor word → true (Latin-script foreign languages).
 *
 * @param {string} rawMessage
 * @returns {boolean}
 */
export function detectNonEnglish(rawMessage) {
	if (typeof rawMessage !== 'string') return false;
	const trimmed = rawMessage.trim();
	if (!trimmed) return false;

	// Tier 1: language-agnostic tokens — numeric values, hex colours, URLs, CSS units.
	// Single-token messages like "#ff0000", "40px", "1200" are handled fine by the
	// client router regardless of the user's language.
	if (/^[#\d\s%px.emvhw,/:?=&\-+*()[\]_]+$/i.test(trimmed)) return false;

	// Tier 2: non-ASCII character → definitively non-English (or non-Latin-script).
	if (/[^\x00-\x7F]/.test(trimmed)) return true;

	// Tier 3: pure ASCII. Tokenise on non-word characters and check against anchors.
	// A single anchor word is sufficient to classify as English.
	const tokens = trimmed.toLowerCase().split(/\W+/).filter(Boolean);

	// Very short messages (1 word) with no anchor may just be a name or number —
	// be conservative and treat as English so the router gets a chance.
	if (tokens.length <= 1) return false;

	for (const token of tokens) {
		if (ENGLISH_ANCHORS.has(token)) return false;
	}

	// Latin-script message with multiple tokens and no English anchor word found.
	return true;
}
