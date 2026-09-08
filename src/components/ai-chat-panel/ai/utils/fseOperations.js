/**
 * Client-side routing for FSE (Full Site Editing) operations.
 *
 * Handles: add_template_part, remove_template_part, save_as_reusable,
 *          detach_reusable, add_wp_pattern.
 *
 * Returns a RouteResult of type 'fse_operation', or null if no FSE intent
 * is detected so the router can continue to the next section.
 */

// ── Intent regexes ────────────────────────────────────────────────────────────

const ADD_TEMPLATE_PART_INTENTS = [
	// "add the header", "add a footer template part", "insert the navigation"
	/\b(?:add|insert|place|include)\s+(?:a\s+|the\s+)?(?:header|footer|navigation|nav|sidebar|search|archive|top\s*bar|topbar)\b/i,
	// "add the <anything> template part"
	/\b(?:add|insert|place|include)\s+(?:a\s+|the\s+)?(.+?)\s+template\s+part\b/i,
	// "template part … add" / "add … template part"
	/\btemplate\s+part\b.*\b(?:add|insert)\b|\b(?:add|insert)\b.*\btemplate\s+part\b/i,
];

const REMOVE_TEMPLATE_PART_INTENTS = [
	// "remove the header", "delete the footer", "hide the navigation"
	/\b(?:remove|delete|hide)\s+(?:the\s+)?(?:header|footer|navigation|nav|sidebar|search|archive|top\s*bar|topbar)\b/i,
	// "remove the <anything> template part"
	/\b(?:remove|delete|hide)\s+(?:the\s+)?(.+?)\s+template\s+part\b/i,
	// "template part … remove"
	/\btemplate\s+part\b.*\b(?:remove|delete)\b|\b(?:remove|delete)\b.*\btemplate\s+part\b/i,
];

const SAVE_AS_REUSABLE_INTENTS = [
	/\bsave\s+(?:this|it|the\s+block)?\s*as\s+(?:a\s+)?(?:reusable|synced\s+pattern)\b/i,
	/\bcreate\s+(?:a\s+)?(?:reusable\s+block|synced\s+pattern)\b/i,
	/\bmake\s+(?:this|it)\s+(?:a\s+)?(?:reusable|synced\s+pattern|reusable\s+block)\b/i,
	/\badd\s+(?:it\s+|this\s+)?(?:block\s+)?to\s+reusable\s+blocks\b/i,
	/\bconvert\s+(?:this\s+|it\s+)?(?:block\s+)?to\s+(?:a\s+)?(?:reusable|synced\s+pattern)\b/i,
];

const DETACH_REUSABLE_INTENTS = [
	/\bdetach\s+(?:this\s+)?(?:reusable|synced\s+pattern|reusable\s+block)\b/i,
	/\bconvert\s+(?:this\s+)?(?:reusable\s+block\s+)?to\s+(?:regular|normal|static|standard)\s+blocks?\b/i,
	/\bunlink\s+(?:this\s+)?(?:reusable|synced\s+pattern)\b/i,
	/\bdetach\s+(?:from\s+)?(?:reusable|synced)\b/i,
];

const ADD_WP_PATTERN_INTENTS = [
	// "add a wordpress/core pattern" — bare qualifier, no extra keyword
	/\b(?:add|insert|use)\s+(?:a\s+)?(?:wp|wordpress|gutenberg|theme|core)\s+pattern\b/i,
	// "add a core hero pattern", "add a gutenberg gallery pattern" — qualifier + keyword
	/\b(?:add|insert|use)\s+(?:a\s+)?(?:wp|wordpress|gutenberg|theme|core)\s+\S+\s+pattern\b/i,
	// "add a <keyword> pattern" — specific common pattern categories
	/\b(?:add|insert|use)\s+(?:a\s+)?(?:newsletter|testimonial|pricing|call[\s-]to[\s-]action|cta|team|gallery|hero|contact|about|faq|features?|services?|portfolio)\s+pattern\b/i,
];

// ── Hint extraction ────────────────────────────────────────────────────────────

/**
 * Extracts the template part area/name hint from a message.
 * Returns the most specific term found, lower-cased.
 *
 * @param {string} message
 * @returns {string|null}
 */
const extractTemplatePartHint = message => {
	const lower = String(message || '').toLowerCase();

	// Known area names (checked first so "header template part" → "header")
	const areaNames = [
		'header', 'footer', 'navigation', 'nav', 'sidebar',
		'search', 'archive', 'topbar', 'top-bar', 'top bar',
	];
	for (const area of areaNames) {
		if (lower.includes(area)) return area.replace(/[\s-]+/g, '');
	}

	// Custom slug pattern: "<action> the/a <hint> template part"
	// Capture group must be more than a bare article (a/the/an).
	const customMatch = message.match(
		/\b(?:add|insert|place|include|remove|delete|hide)\s+(?:a\s+|the\s+|an\s+)?(.+?)\s+template\s+part\b/i
	);
	if (customMatch) {
		const raw = customMatch[1].trim().toLowerCase();
		// Skip if the "hint" is just an article
		if (raw && !/^(?:a|an|the)$/.test(raw)) {
			return raw.replace(/\s+/g, '-');
		}
	}

	return null;
};

/**
 * Extracts an inline title from messages like:
 *   "save as reusable called My Hero"
 *   "create reusable block 'Banner'"
 *   'make this a reusable named "Card Layout"'
 *
 * @param {string} message
 * @returns {string|null}
 */
const extractInlineTitle = message => {
	// After "called", "named", "titled", or "as" (followed by non-command text)
	const patterns = [
		/\b(?:called|named|titled)\s+["']?([^"'\n]{1,60})["']?/i,
		/\bas\s+(?:reusable\s+(?:block\s+)?)?["']([^"'\n]{1,60})["']/i,
	];
	for (const re of patterns) {
		const m = message.match(re);
		if (m) {
			const candidate = m[1].trim().replace(/['"]+$/, '');
			if (candidate.length > 0) return candidate;
		}
	}
	return null;
};

/**
 * Extracts the pattern search keyword from a message like
 * "add a newsletter pattern" → "newsletter".
 *
 * @param {string} message
 * @returns {string}
 */
const extractPatternQuery = message => {
	// "add a <keyword> pattern" or "insert <keyword> pattern"
	const m = message.match(
		/\b(?:add|insert|use)\s+(?:a\s+)?(.+?)\s+pattern\b/i
	);
	if (m) {
		const candidate = m[1]
			.replace(/\b(?:wp|wordpress|gutenberg|theme|core)\b/gi, '')
			.trim()
			.toLowerCase();
		if (candidate.length > 0) return candidate;
	}
	return '';
};

// ── Main router ────────────────────────────────────────────────────────────────

/**
 * Attempts to route the raw message to an FSE operation.
 *
 * @param {string} rawMessage
 * @returns {{ type: 'fse_operation', params: Object } | null}
 */
const routeFSEOperations = rawMessage => {
	const lower = String(rawMessage || '').toLowerCase();

	// Guard: none of these trigger words → fast exit
	const hasFseKeyword =
		/\btemplate\s+part\b/.test(lower) ||
		/\b(?:header|footer|navigation|nav|sidebar|topbar|top[\s-]bar)\b/.test(lower) ||
		/\breusable\b/.test(lower) ||
		/\bsynced\s+pattern\b/.test(lower) ||
		/\bdetach\b/.test(lower) ||
		/\bunlink\b/.test(lower) ||
		/\bpattern\b/.test(lower) ||
		/\b(?:static|regular|normal)\s+blocks?\b/.test(lower);

	if (!hasFseKeyword) return null;

	// ── detach_reusable (check before save_as_reusable to avoid mis-routing) ──
	if (DETACH_REUSABLE_INTENTS.some(re => re.test(rawMessage))) {
		return { type: 'fse_operation', params: { operation: 'detach_reusable' } };
	}

	// ── save_as_reusable ────────────────────────────────────────────────────────
	if (SAVE_AS_REUSABLE_INTENTS.some(re => re.test(rawMessage))) {
		return {
			type: 'fse_operation',
			params: {
				operation: 'save_as_reusable',
				title: extractInlineTitle(rawMessage),
			},
		};
	}

	// ── remove_template_part ───────────────────────────────────────────────────
	if (REMOVE_TEMPLATE_PART_INTENTS.some(re => re.test(rawMessage))) {
		return {
			type: 'fse_operation',
			params: {
				operation: 'remove_template_part',
				hint: extractTemplatePartHint(rawMessage),
			},
		};
	}

	// ── add_template_part ─────────────────────────────────────────────────────
	if (ADD_TEMPLATE_PART_INTENTS.some(re => re.test(rawMessage))) {
		return {
			type: 'fse_operation',
			params: {
				operation: 'add_template_part',
				hint: extractTemplatePartHint(rawMessage),
			},
		};
	}

	// ── add_wp_pattern ────────────────────────────────────────────────────────
	if (ADD_WP_PATTERN_INTENTS.some(re => re.test(rawMessage))) {
		return {
			type: 'fse_operation',
			params: {
				operation: 'add_wp_pattern',
				query: extractPatternQuery(rawMessage),
			},
		};
	}

	return null;
};

export {
	routeFSEOperations,
	extractTemplatePartHint,
	extractInlineTitle,
	extractPatternQuery,
};
