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

const normalizeSvg = value =>
	String(value || '')
		.replace(/\s+/g, ' ')
		.trim();

const cleanIconQuery = value =>
	String(value || '')
		.replace(/\b(different|another|alternative|new|other)\b/gi, '')
		.replace(/\b(this|these|those|that|them|my|our|your|their)\b/gi, '')
		.replace(/\b(theme|themes)\b/gi, '')
		.replace(/\b(more|less)\b/gi, '')
		.replace(/\ball\b/gi, '')
		.replace(/\b(change|swap|replace|use|add|set|insert|make|give|apply)\b/gi, '')
		.replace(/\b(icon|icons|from|in|the|cloud|library|cloud library|for|of|called|named|to|a|an)\b/gi, '')
		.replace(/\s+/g, ' ')
		.trim();

const normalizeIconStyle = value => {
	const normalized = String(value || '').toLowerCase();
	if (/(filled|solid|fill)/.test(normalized)) return 'filled';
	if (/(line|outline|stroke)/.test(normalized)) return 'line';
	if (/(shape|shapes|geometric)/.test(normalized)) return 'shape';
	return '';
};

const getIconStyleTokens = icon => {
	const title = normalizeText(icon?.post_title || '');
	const categories = toList(icon?.svg_category).map(normalizeText).filter(Boolean);
	const tags = toList(icon?.svg_tag).map(normalizeText).filter(Boolean);
	const svgType = normalizeText(
		Array.isArray(icon?.svg_category) ? icon?.svg_category[0] : icon?.svg_category
	);
	const tokens = new Set(
		[title, svgType, ...categories, ...tags]
			.join(' ')
			.split(' ')
			.filter(Boolean)
	);
	return tokens;
};

const matchesIconStyle = (icon, style) => {
	const normalizedStyle = normalizeIconStyle(style);
	if (!normalizedStyle) return true;
	const tokens = getIconStyleTokens(icon);
	if (normalizedStyle === 'filled') {
		return (
			tokens.has('filled') ||
			tokens.has('fill') ||
			tokens.has('solid') ||
			tokens.has('filled-icon') ||
			tokens.has('solid-icon')
		);
	}
	if (normalizedStyle === 'line') {
		return (
			tokens.has('line') ||
			tokens.has('outline') ||
			tokens.has('stroke') ||
			tokens.has('outlined')
		);
	}
	if (normalizedStyle === 'shape') {
		return tokens.has('shape') || tokens.has('shapes') || tokens.has('geometric');
	}
	return true;
};

export const extractIconStyleIntent = message => {
	if (typeof message !== 'string') {
		return '';
	}
	const lower = message.toLowerCase();
	if (
		/\b(filled|solid|fill)\s+icons?\b/.test(lower) ||
		/\bicons?\b\s+(?:only\s+)?(filled|solid|fill)\b/.test(lower) ||
		/\bicons?\b\s+(?:in|with)\s+(?:a\s+)?(filled|solid|fill)\s+style\b/.test(lower)
	) {
		return 'filled';
	}
	if (
		/\b(line|outline|stroke)\s+icons?\b/.test(lower) ||
		/\bicons?\b\s+(?:only\s+)?(line|outline|stroke)\b/.test(lower) ||
		/\bicons?\b\s+(?:in|with)\s+(?:a\s+)?(line|outline|stroke)\s+style\b/.test(lower)
	) {
		return 'line';
	}
	if (
		/\b(shape|shapes|geometric)\s+icons?\b/.test(lower) ||
		/\bicons?\b\s+(?:only\s+)?(shape|shapes|geometric)\b/.test(lower) ||
		/\bicons?\b\s+(?:in|with)\s+(?:a\s+)?(shape|shapes|geometric)\s+style\b/.test(lower)
	) {
		return 'shape';
	}

	// Adjective-style phrasing ("Outline shopping cart icon")
	if (/\b(outline|outlined)\b(?=[^,.;]*\bicons?\b)/.test(lower)) {
		return 'line';
	}
	if (/\b(filled|solid)\b(?=[^,.;]*\bicons?\b)/.test(lower)) {
		return 'filled';
	}
	if (/\b(shape|shapes|geometric)\b(?=[^,.;]*\bicons?\b)/.test(lower)) {
		return 'shape';
	}
	return '';
};

export const stripIconStylePhrases = message => {
	if (typeof message !== 'string') {
		return '';
	}
	return message
		.replace(/\b(filled|solid|fill)\s+icons?\b(\s+only)?/gi, 'icons')
		.replace(/\b(line|outline|stroke)\s+icons?\b(\s+only)?/gi, 'icons')
		.replace(/\b(shape|shapes|geometric)\s+icons?\b(\s+only)?/gi, 'icons')
		.replace(/\bicons?\b\s+(?:only\s+)?(filled|solid|fill|line|outline|stroke|shape|shapes|geometric)\b/gi, 'icons')
		.replace(/\bicons?\b\s+(?:in|with)\s+(?:a\s+)?(filled|solid|fill|line|outline|stroke|shape|shapes|geometric)\s+style\b/gi, 'icons')
		.replace(/\b(outline|outlined)\b(?=[^,.;]*\bicons?\b)/gi, '')
		.replace(/\b(filled|solid)\b(?=[^,.;]*\bicons?\b)/gi, '')
		.replace(/\b(shape|shapes|geometric)\b(?=[^,.;]*\bicons?\b)/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
};

const isProIcon = icon => icon?.cost?.[0] === 'Pro';

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

const getMatchStats = (query, icon) => {
	const normalizedQuery = normalizeText(query);
	if (!normalizedQuery) {
		return {
			score: 0,
			tokenMatches: 0,
			tokenCount: 0,
			strongMatch: false,
		};
	}

	const title = normalizeText(icon?.post_title || '');
	const tags = toList(icon?.svg_tag).map(normalizeText).filter(Boolean);
	const categories = toList(icon?.svg_category).map(normalizeText).filter(Boolean);

	let score = 0;
	const titleScore = scoreTextMatch(normalizedQuery, title);
	const tagScore = scoreListMatch(normalizedQuery, tags);
	const categoryScore = scoreListMatch(normalizedQuery, categories);
	score += titleScore;
	score += tagScore * 0.7;
	score += categoryScore * 0.5;

	const tokens = normalizedQuery.split(' ').filter(Boolean);
	let tokenMatches = 0;
	for (const token of tokens) {
		let matched = false;
		if (title.includes(token)) {
			score += 8;
			matched = true;
		}
		if (tags.some(tag => tag.includes(token))) {
			score += 4;
			matched = true;
		}
		if (categories.some(cat => cat.includes(token))) {
			score += 2;
			matched = true;
		}
		if (matched) {
			tokenMatches += 1;
		}
	}

	const requiredTokens = tokens.length >= 2 ? 2 : 1;
	const strongMatch =
		titleScore >= 40 ||
		tagScore >= 40 ||
		categoryScore >= 40 ||
		(tokenMatches >= requiredTokens && tokens.length > 0);

	return {
		score,
		tokenMatches,
		tokenCount: tokens.length,
		strongMatch,
	};
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
	const {
		target = 'icon',
		excludeSvgCodes = [],
		preferDifferent = false,
		requireStrongMatch = false,
		style = '',
		requireStyleMatch = false,
	} = options;
	const results = await searchIcons(query, 12);
	const total = results.length;
	const normalizedStyle = normalizeIconStyle(style);

	if (total === 0) {
		return { total: 0 };
	}

	const excludeSet = new Set(excludeSvgCodes.map(normalizeSvg).filter(Boolean));
	const scored = results
		.map(icon => {
			const svgType = Array.isArray(icon.svg_category)
				? icon.svg_category[0]
				: icon.svg_category;
			const rawSvg = icon.svg_code || '';
			const svgCode = rawSvg ? svgAttributesReplacer(rawSvg, target) : '';
			const matchStats = getMatchStats(query, icon);
			const styleMatch = normalizedStyle
				? matchesIconStyle(icon, normalizedStyle)
				: true;
			return {
				icon,
				svgType,
				svgCode,
				score: matchStats.score,
				strongMatch: matchStats.strongMatch,
				isPro: isProIcon(icon),
				isExcluded: excludeSet.has(normalizeSvg(svgCode)),
				styleMatch,
			};
		})
		.filter(item => item.svgCode);

	if (scored.length === 0) {
		return { total: 0 };
	}

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.isPro !== b.isPro) return a.isPro ? 1 : -1;
		return 0;
	});

	let picked = null;
	const eligible = requireStrongMatch
		? scored.filter(item => item.strongMatch)
		: scored;
	const styleEligible = normalizedStyle
		? eligible.filter(item => item.styleMatch)
		: eligible;

	if (normalizedStyle && requireStyleMatch && styleEligible.length === 0) {
		return { total, noStyleMatch: true };
	}

	const finalPool =
		normalizedStyle && styleEligible.length > 0 ? styleEligible : eligible;
	if (preferDifferent) {
		picked =
			finalPool.find(item => !item.isExcluded && !item.isPro) ||
			finalPool.find(item => !item.isExcluded) ||
			null;
	} else {
		picked = finalPool.find(item => !item.isPro) || finalPool[0];
	}

	if (!picked) {
		return {
			total,
			noAlternative: true,
			noStrongMatch: requireStrongMatch,
			noStyleMatch: normalizedStyle ? true : false,
		};
	}

	return {
		title: picked.icon?.post_title,
		svgCode: picked.svgCode,
		svgType: picked.svgType || 'Line',
		isPro: picked.isPro,
		total,
		strongMatch: picked.strongMatch,
		styleMatch: picked.styleMatch,
	};
};

export const findIconCandidates = async (query, options = {}) => {
	const { target = 'icon', limit = 24, style = '', requireStyleMatch = false } = options;
	const results = await searchIcons(query, limit);
	const total = results.length;
	const normalizedStyle = normalizeIconStyle(style);

	if (total === 0) {
		return { icons: [], total, hasOnlyPro: false };
	}

	const scored = results
		.map(icon => {
			const svgType = Array.isArray(icon.svg_category)
				? icon.svg_category[0]
				: icon.svg_category;
			const rawSvg = icon.svg_code || '';
			const svgCode = rawSvg ? svgAttributesReplacer(rawSvg, target) : '';
			const matchStats = getMatchStats(query, icon);
			const styleMatch = normalizedStyle
				? matchesIconStyle(icon, normalizedStyle)
				: true;
			return {
				icon,
				svgType,
				svgCode,
				score: matchStats.score,
				isPro: isProIcon(icon),
				normalizedSvg: normalizeSvg(svgCode),
				styleMatch,
			};
		})
		.filter(item => item.svgCode);

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.isPro !== b.isPro) return a.isPro ? 1 : -1;
		return 0;
	});

	const stylePool = normalizedStyle
		? scored.filter(item => item.styleMatch)
		: scored;

	if (normalizedStyle && requireStyleMatch && stylePool.length === 0) {
		return { icons: [], total, hasOnlyPro: false, noStyleMatch: true };
	}

	const icons = [];
	const seen = new Set();
	const pool = normalizedStyle && stylePool.length > 0 ? stylePool : scored;
	for (const item of pool) {
		if (item.isPro) {
			continue;
		}
		if (item.score <= 0) {
			continue;
		}
		if (!item.normalizedSvg || seen.has(item.normalizedSvg)) {
			continue;
		}
		seen.add(item.normalizedSvg);
		icons.push({
			title: item.icon?.post_title,
			svgCode: item.svgCode,
			svgType: item.svgType || 'Line',
		});
	}

	const hasOnlyPro =
		icons.length === 0 && pool.some(item => item.isPro);
	return { icons, total, hasOnlyPro };
};

export const extractIconQueries = message => {
	if (typeof message !== 'string') {
		return [];
	}

	const listPatterns = [
		/(?:change|swap|replace|use|set|add|insert|make|give|apply)\s+(?:all\s+)?(?:the\s+)?icons?\s*(?:to|with|as|of|for|called|named)?\s*([^.;]+)$/i,
		/\bicons?\b\s*(?:to|with|as|of|for|called|named)\s*([^.;]+)$/i,
	];

	let listText = '';
	for (const pattern of listPatterns) {
		const match = message.match(pattern);
		if (match?.[1]) {
			listText = match[1];
			break;
		}
	}

	if (!listText) {
		return [];
	}

	if (!/[,&]|\band\b/i.test(listText)) {
		return [];
	}

	const normalized = listText.replace(/\s*&\s*/g, ' and ');
	const parts = [];
	normalized.split(',').forEach(chunk => {
		chunk.split(/\band\b/i).forEach(part => {
			const cleaned = cleanIconQuery(part);
			if (cleaned) {
				parts.push(cleaned);
			}
		});
	});

	if (parts.length < 2) {
		return [];
	}

	const unique = [];
	const seen = new Set();
	for (const part of parts) {
		if (seen.has(part)) continue;
		seen.add(part);
		unique.push(part);
	}

	return unique;
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
		/(?:change|swap|replace|use|set|add|insert|make|give|apply)\s+(?:all\s+)?(?:the\s+)?icons?\s*(?:to|with|as|of|for|called|named)?\s*([^,.;]+?)(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/\bicons?\b\s*(?:to|with|as|of|for|called|named)\s*([^,.;]+?)(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/\bicons?\b\s*(?:are|look|feel|more|very)?\s*([^,.;]+)$/i,
		/(?:change|swap|replace|use|set|add|insert|make|give|apply)\s+(?:to\s+)?(?:a\s+|an\s+|the\s+)?(?:different|another|alternative|new|other)\s+([^,.;]+)$/i,
		/(?:change|swap|replace|use|set|add|insert|make|give|apply)\s+(?:the\s+|a\s+|an\s+)?([^,.;]+?)\s+icons?\b(?:\s+(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library))?$/i,
		/(?:from|in)\s+(?:the\s+)?(?:cloud|cloud library|library)\s+icon\s*(?:called|named)?\s*([^,.;]+)$/i,
	];

	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match?.[1]) {
			const cleaned = cleanIconQuery(match[1]);
			if (cleaned) {
				return cleaned;
			}
		}
	}

	return cleanIconQuery(message);
};
