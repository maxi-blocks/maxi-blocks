/**
 * Icon Search Module
 *
 * Provides Typesense search functionality for Cloud Library SVG icons.
 */

import { svgAttributesReplacer } from '../../editor/library/util';

/**
 * Search the Cloud Library for SVG icons matching a query.
 *
 * @param {string} query - Natural language icon search query (e.g., "star")
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of icon hits with svg_code
 */
export const searchIcons = async (query, limit = 5) => {
	const trimmedQuery = typeof query === 'string' ? query.trim() : '';
	const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
	const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;

	// NOTE: This key is bundled client-side; use a search-only key scoped to svg_icon.
	if (!apiKey || !apiHost) {
		console.error('[Maxi AI] Typesense credentials not configured');
		return [];
	}

	if (!trimmedQuery) {
		return [];
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 8000);

	try {
		const response = await fetch(
			`https://${apiHost}/collections/svg_icon/documents/search?` +
				new URLSearchParams({
					q: trimmedQuery,
					query_by: 'post_title,svg_tag.lvl0,svg_tag.lvl1,svg_tag.lvl2,svg_category',
					query_by_weights: '4,2,2,1,1',
					per_page: limit.toString(),
					sort_by: '_text_match:desc,post_date_int:desc',
				}),
			{
				method: 'GET',
				headers: {
					'X-TYPESENSE-API-KEY': apiKey,
				},
				signal: controller.signal,
			}
		);

		if (!response.ok) {
			throw new Error(`Typesense icon search failed: ${response.status}`);
		}

		const data = await response.json();
		return data.hits?.map(hit => hit.document) || [];
	} catch (error) {
		console.error('[Maxi AI] Icon search error:', error);
		return [];
	} finally {
		clearTimeout(timeoutId);
	}
};

const normalizeText = value =>
	String(value || '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();

const toList = value => {
	if (!value) return [];
	if (Array.isArray(value)) return value.flat(Infinity).filter(Boolean);
	if (typeof value === 'object') return Object.values(value).flat(Infinity).filter(Boolean);
	return [value];
};

const scoreTextMatch = (needle, haystack) => {
	if (!needle || !haystack) return 0;
	if (haystack === needle) return 100;
	if (haystack.startsWith(needle)) return 70;
	if (haystack.includes(needle)) return 40;
	return 0;
};

const scoreListMatch = (needle, list) =>
	list.reduce((best, item) => Math.max(best, scoreTextMatch(needle, item)), 0);

const scoreIconMatch = (query, icon) => {
	const normalizedQuery = normalizeText(query);
	if (!normalizedQuery) return 0;

	const title = normalizeText(icon?.post_title || '');
	const tags = toList(icon?.svg_tag).map(normalizeText).filter(Boolean);
	const categories = toList(icon?.svg_category).map(normalizeText).filter(Boolean);

	let score = 0;
	score += scoreTextMatch(normalizedQuery, title);
	score += scoreListMatch(normalizedQuery, tags) * 0.7;
	score += scoreListMatch(normalizedQuery, categories) * 0.5;

	const tokens = normalizedQuery.split(' ').filter(Boolean);
	for (const token of tokens) {
		if (title.includes(token)) score += 8;
		if (tags.some(tag => tag.includes(token))) score += 4;
		if (categories.some(cat => cat.includes(token))) score += 2;
	}

	return score;
};

/**
 * Find the best matching SVG icon for a given intent.
 *
 * @param {string} query - Search query
 * @param {Object} options - Extra options
 * @param {string} options.target - svgAttributesReplacer target ('icon' | 'svg' | 'shape')
 * @returns {Promise<Object|null>} Best matching icon or null
 */
export const findBestIcon = async (query, options = {}) => {
	const { target = 'icon' } = options;
	const results = await searchIcons(query, 12);

	if (results.length === 0) {
		return null;
	}

	const scored = results.map(icon => ({
		icon,
		score: scoreIconMatch(query, icon),
		isPro: icon.cost?.[0] === 'Pro',
	}));

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.isPro !== b.isPro) return a.isPro ? 1 : -1;
		return 0;
	});

	const best = scored[0];
	const nonProMatch = scored.find(item => !item.isPro && item.score > 0);
	const picked = nonProMatch || best;
	const icon = picked?.icon || results[0];
	const svgType = Array.isArray(icon.svg_category)
		? icon.svg_category[0]
		: icon.svg_category;
	const rawSvg = icon.svg_code || '';
	const svgCode = rawSvg ? svgAttributesReplacer(rawSvg, target) : '';

	return {
		title: icon.post_title,
		svgCode,
		svgType: svgType || 'Line',
		isPro: icon.cost?.[0] === 'Pro',
	};
};

/**
 * Extract a search query from a natural language icon request.
 *
 * @param {string} message - User's message (e.g., "Change the icon to a star from the cloud")
 * @returns {string} Extracted search query
 */
export const extractIconQuery = message => {
	if (typeof message !== 'string') {
		return '';
	}

	const quoted = message.match(/["']([^"']+)["']/);
	if (quoted?.[1]) {
		return quoted[1].trim();
	}

	const patterns = [
		/(?:change|swap|replace|use|set|add|insert|make)\s+(?:the\s+)?icon\s*(?:to|with|as|of|for|called|named)?\s*([^,.;]+?)(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/\bicon\b\s*(?:to|with|as|of|for|called|named)\s*([^,.;]+?)(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/(?:change|swap|replace|use|set|add|insert|make)\s+(?:the\s+|a\s+|an\s+)?([^,.;]+?)\s+icon\b(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library)\s+icon\s*(?:called|named)?\s*([^,.;]+)$/i,
	];

	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match?.[1]) {
			return match[1].trim();
		}
	}

	return message
		.replace(/\b(change|swap|replace|use|add|set|insert|make)\b/gi, '')
		.replace(/\b(icon|icons|from|in|the|cloud|library|cloud library|for|of|called|named)\b/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
};
