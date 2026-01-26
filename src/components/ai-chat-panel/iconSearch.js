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
					per_page: limit.toString(),
					sort_by: 'post_date_int:desc',
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
	const results = await searchIcons(query, 1);

	if (results.length === 0) {
		return null;
	}

	const icon = results[0];
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
		/(?:change|swap|replace|use|add)\s+(?:the\s+)?icon\s*(?:to|with|as)?\s*([^,.;]+?)(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/\bicon\b\s*(?:to|with|as)\s*([^,.;]+?)(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library)\s+icon\s*(?:called|named)?\s*([^,.;]+)$/i,
	];

	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match?.[1]) {
			return match[1].trim();
		}
	}

	return message
		.replace(/\b(change|swap|replace|use|add|set)\b/gi, '')
		.replace(/\b(icon|icons|from|in|the|cloud|library|cloud library)\b/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
};
