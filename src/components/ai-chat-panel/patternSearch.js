/**
 * Pattern Search Module
 * 
 * Provides Typesense search functionality for the AI Chat to find
 * and insert patterns from the Cloud Library.
 */

/**
 * Search the Cloud Library for patterns matching a query.
 * Uses the same Typesense instance as the Cloud Library modal.
 * 
 * @param {string} query - Natural language search query (e.g., "pricing table")
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of pattern hits with gutenberg_code
 */
export const searchPatterns = async (query, limit = 5) => {
	const trimmedQuery = typeof query === 'string' ? query.trim() : '';
	const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
	const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;

	// NOTE: This key is bundled client-side; use a search-only key scoped to maxi_patterns.
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
			`https://${apiHost}/collections/maxi_patterns/documents/search?` +
				new URLSearchParams({
					q: trimmedQuery,
					query_by: 'post_title,category.lvl0,category.lvl1',
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
			throw new Error(`Typesense search failed: ${response.status}`);
		}

		const data = await response.json();
		return data.hits?.map(hit => hit.document) || [];
	} catch (error) {
		console.error('[Maxi AI] Pattern search error:', error);
		return [];
	} finally {
		clearTimeout(timeoutId);
	}
};

/**
 * Find the best matching pattern for a given intent.
 * Returns the top result with gutenberg_code for insertion.
 * 
 * @param {string} query - Search query
 * @returns {Promise<Object|null>} Best matching pattern or null
 */
export const findBestPattern = async query => {
	const results = await searchPatterns(query, 1);
	
	if (results.length === 0) {
		return null;
	}

	const pattern = results[0];
	
	return {
		title: pattern.post_title,
		gutenbergCode: pattern.gutenberg_code,
		category: pattern.category?.[0] || 'Pattern',
		isPro: pattern.cost?.[0] === 'Pro',
		previewUrl: pattern.demo_url,
	};
};

/**
 * Extract a search query from a natural language create request.
 * 
 * @param {string} message - User's message (e.g., "Create a pricing table with 3 tiers")
 * @returns {string} Extracted search query
 */
/**
 * Strip Cloud / library phrasing to get a Typesense query (e.g. "pure image").
 *
 * @param {string} message User message or chip label.
 * @returns {string} Search string; may be empty for generic "browse library".
 */
export const extractCloudSearchQuery = message => {
	if ( typeof message !== 'string' ) {
		return '';
	}
	let q = message.trim();
	if ( ! q ) {
		return '';
	}
	q = q
		.replace(
			/^(open|show|launch|browse|search|explore|import|get|add)\s+(the\s+|a\s+|an\s+)?/gi,
			''
		)
		// "from cloud" / "from the cloud" before stripping the word "cloud" alone
		.replace( /\bfrom\s+the\s+cloud\b/gi, ' ' )
		.replace( /\bfrom\s+cloud\b/gi, ' ' )
		.replace(
			/\b(the\s+|a\s+|an\s+)?(maxi\s*blocks?\s+)?cloud\s*(library)?\b/gi,
			' '
		)
		.replace( /\b(pattern|patterns|page|pages|template|templates)\b/gi, ' ' )
		// Light/Dark are Cloud Library sidebar refinements (InstantSearch menu), not search keywords.
		.replace( /\b(dark|light)\b/gi, ' ' )
		// Free/Pro drive the cost filter button, not the search box.
		.replace( /\b(free|pro)\b/gi, ' ' )
		.replace( /\bfor\s+me\b/gi, ' ' )
		.replace( /\s+/g, ' ' )
		.trim();
	q = q.replace( /^(and|or|to|from)\s+/i, '' ).trim();
	// Leftover trailing glue words after removals, e.g. "pure image from"
	q = q
		.replace(
			/\s+\b(from|to|in|for|the|a|an|and|or)\b\s*$/gi,
			''
		)
		.trim();
	return q;
};

export const extractPatternQuery = message => {
	// Remove common prefixes
	let query = message.toLowerCase()
		.replace(/^(create|make|add|insert|build|generate)\s*(a|an|the|me|us)?\s*/, '')
		.replace(/\s*(using|with|in)\s*maxi(blocks)?$/i, '')
		.replace(/\s*for\s*(me|us)$/i, '')
		.trim();

	// Remove tier/column/row counts for cleaner search
	query = query.replace(/\s*with\s*\d+\s*(tiers?|columns?|rows?|items?|cards?)/i, '');

	return query;
};
