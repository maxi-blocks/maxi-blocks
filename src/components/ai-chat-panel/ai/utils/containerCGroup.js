const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.width;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const normalizeCss = css => {
	if (!css) return '';
	const trimmed = String(css).trim();
	if (!trimmed) return '';
	return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
};

const splitDeclarations = css =>
	normalizeCss(css)
		.split(';')
		.map(part => String(part).trim())
		.filter(Boolean);

const parseDeclaration = declaration => {
	const raw = String(declaration || '').trim();
	const idx = raw.indexOf(':');
	if (idx === -1) return null;
	const prop = raw.slice(0, idx).trim();
	const value = raw.slice(idx + 1).trim();
	if (!prop) return null;
	return { prop, value };
};

const upsertCss = (baseCss, patchCss) => {
	const map = new Map();

	splitDeclarations(baseCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	splitDeclarations(patchCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	return Array.from(map.values())
		.map(({ prop, value }) => `${prop}: ${value};`)
		.join('\n')
		.trim();
};

const mergeCustomCss = (attributes, { css, category, index, breakpoint }) => {
	const bp = breakpoint || 'general';
	const key = `custom-css-${bp}`;
	const existing = attributes?.[key];
	const next = existing ? { ...existing } : {};
	const categoryKey = category || 'container';
	const indexKey = index || 'normal';
	const currentCss = next?.[categoryKey]?.[indexKey] || '';
	const merged = upsertCss(currentCss, css);

	if (!merged) return { [key]: next };

	const nextCategory = next[categoryKey] ? { ...next[categoryKey] } : {};
	nextCategory[indexKey] = merged;
	next[categoryKey] = nextCategory;
	return { [key]: next };
};

const mergeAdvancedCss = (attributes, css, breakpoint = 'general') => {
	if (!css) return null;
	const key = `advanced-css-${breakpoint}`;
	const existing = attributes?.[key];
	const trimmed = String(css).trim();
	if (!existing) return { [key]: trimmed };
	const existingTrimmed = String(existing).trim();
	if (existingTrimmed.includes(trimmed)) return { [key]: existingTrimmed };
	return { [key]: `${existingTrimmed}\n${trimmed}`.trim() };
};

const buildContextLoopAttributeChanges = (value = {}) => {
	if (!value || typeof value !== 'object') return null;

	const changes = {
		'cl-status': value.status === undefined ? true : Boolean(value.status),
		'cl-source': value.source,
		'cl-type': value.type,
		'cl-relation': value.relation,
		'cl-id': value.id,
		'cl-field': value.field,
		'cl-author': value.author,
		'cl-order-by': value.orderBy,
		'cl-order': value.order,
		'cl-pagination': value.pagination,
		'cl-limit-by-archive': value.limitByArchive,
		'cl-accumulator': value.accumulator,
		'cl-grandchild-accumulator': value.grandchildAccumulator,
		'cl-acf-group': value.acfGroup,
		'cl-acf-field-type': value.acfFieldType,
		'cl-acf-char-limit': value.acfCharLimit,
		'cl-pagination-show-page-list': value.showPageList,
		'cl-pagination-previous-text': value.previousText,
		'cl-pagination-next-text': value.nextText,
		'cl-pagination-total': value.paginationTotal,
		'cl-pagination-total-all': value.paginationTotalAll,
	};

	if (value.perPage !== undefined) {
		changes['cl-pagination-per-page'] = Number(value.perPage);
	}

	if (value.paginationPerPage !== undefined) {
		changes['cl-pagination-per-page'] = Number(value.paginationPerPage);
	}

	return Object.fromEntries(
		Object.entries(changes).filter(([, val]) => val !== undefined)
	);
};

const extractLoopPerPage = message =>
	extractNumericValue(message, [
		/(?:per\s*page|per\s*pages|per-page|perpage)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/(\d+(?:\.\d+)?)\s*(?:posts?|items?|products?)\s*per\s*page/i,
	]);

const extractLoopType = message => {
	const lower = String(message || '').toLowerCase();
	if (/(woocommerce|products?|shop\s*items?)/.test(lower)) {
		return { type: 'product', perPage: 8 };
	}
	if (/(posts?|blog|articles?|news)/.test(lower)) {
		return { type: 'post', perPage: 6 };
	}

	if (/(portfolio|case\s*stud(?:y|ies)|projects?)/.test(lower)) {
		return { type: 'portfolio' };
	}

	if (/(custom\s*post\s*type|post\s*type|cpt)/.test(lower)) {
		const quoted = extractQuotedText(message);
		if (quoted) return { type: quoted };
		const match = message.match(
			/(?:custom\s*post\s*type|post\s*type)\s*(?:to|=|:|is)?\s*([a-z0-9_-]+)/i
		);
		if (match && match[1]) return { type: match[1] };
		return { type: 'custom_post_type' };
	}

	return null;
};

const extractLoopStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(loop|query|context\s*loop|dynamic\s*content)/.test(lower)) return null;
	if (/(disable|stop|remove|turn\s*off)/.test(lower)) return false;
	if (/(enable|start|turn\s*on|activate)/.test(lower)) return true;
	return null;
};

const extractLoopRelation = message => {
	const lower = String(message || '').toLowerCase();
	if (/related/.test(lower)) return 'related';
	return null;
};

const extractLoopOrder = message => {
	const lower = String(message || '').toLowerCase();
	if (/newest|latest|recent/.test(lower)) {
		return { orderBy: 'date', order: 'desc' };
	}
	if (/oldest/.test(lower)) {
		return { orderBy: 'date', order: 'asc' };
	}
	if (/random|shuffle/.test(lower)) {
		return { orderBy: 'rand', order: 'desc' };
	}
	if (/\b(a\s*-\s*z|a\s*to\s*z|alphabetical)\b/.test(lower)) {
		return { orderBy: 'title', order: 'asc' };
	}
	if (/\b(z\s*-\s*a|z\s*to\s*a)\b/.test(lower)) {
		return { orderBy: 'title', order: 'desc' };
	}
	return null;
};

const extractPaginationStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination')) return null;
	if (/(remove|disable|hide|turn\s*off)/.test(lower)) return false;
	if (/(add|enable|show|turn\s*on)/.test(lower)) return true;
	return null;
};

const extractPaginationPageList = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination') && !lower.includes('page')) return null;
	if (/load\s*more|infinite/.test(lower)) return false;
	if (/page\s*numbers?|numbers?\s*only/.test(lower)) return true;
	return null;
};

const extractPaginationStyle = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination') && !lower.includes('page numbers')) return null;
	if (/(pill|pills|capsule|rounded)/.test(lower)) return 'pills';
	if (/(button|buttons|boxed|box|square)/.test(lower)) return 'boxed';
	if (/(minimal|simple|text\s*links?)/.test(lower)) return 'minimal';
	return null;
};

const extractPaginationSpacing = message =>
	extractValueFromPatterns(message, [
		/(?:pagination|page\s*numbers?).*?(?:gap|spacing|space)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/(?:gap|spacing)\s*(?:between|for)\s*(?:pagination|page\s*numbers?)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/\bspace\s*out\s*(?:the\s*)?(?:pagination|page\s*numbers?)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
	]);

const extractPaginationText = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination') && !lower.includes('page')) return null;

	const prev = extractValueFromPatterns(message, [
		/(?:previous|prev)\s*(?:text|label)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
	]);
	const next = extractValueFromPatterns(message, [
		/(?:next)\s*(?:text|label)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
	]);

	if (!prev && !next) return null;

	return {
		...(prev ? { previousText: prev } : {}),
		...(next ? { nextText: next } : {}),
	};
};

const buildPaginationSpacingChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue(rawValue, 'px');
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};
	breakpoints.forEach(bp => {
		changes[`cl-pagination-column-gap-${bp}`] = parsed.value;
		changes[`cl-pagination-column-gap-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

const buildPaginationStyleChanges = (preset, attributes) => {
	const style = String(preset || '').toLowerCase();
	const base = {
		'cl-pagination': true,
		'cl-pagination-show-page-list': true,
		'cl-pagination-font-weight-general': '600',
		'cl-pagination-font-size-general': 14,
		'cl-pagination-font-size-unit-general': 'px',
		'cl-pagination-text-decoration-general': 'none',
		'cl-pagination-align-items-general': 'center',
		'cl-pagination-justify-content-general': 'center',
		'cl-pagination-column-gap-general': 10,
		'cl-pagination-column-gap-unit-general': 'px',
		'cl-pagination-row-gap-general': 0,
		'cl-pagination-row-gap-unit-general': 'px',
		'cl-pagination-link-hover-palette-status': true,
		'cl-pagination-link-hover-palette-color': 3,
		'cl-pagination-link-hover-palette-opacity': 100,
		'cl-pagination-link-hover-palette-sc-status': false,
		'cl-pagination-link-current-palette-status': true,
		'cl-pagination-link-current-palette-color': 5,
		'cl-pagination-link-current-palette-opacity': 100,
		'cl-pagination-link-current-palette-sc-status': false,
	};

	let advancedCss = '';

	if (style === 'boxed') {
		base['cl-pagination-column-gap-general'] = 12;
		advancedCss = [
			'.maxi-pagination a { padding: 8px 14px; border: 1px solid var(--p); border-radius: 6px; text-decoration: none; }',
			'.maxi-pagination a:hover { background: var(--bg-2); }',
			'.maxi-pagination .maxi-pagination__link--current { background: var(--highlight); color: var(--bg-1); border-color: var(--highlight); }',
		].join('\n');
	} else if (style === 'pills') {
		base['cl-pagination-column-gap-general'] = 14;
		advancedCss = [
			'.maxi-pagination a { padding: 8px 16px; border: 1px solid var(--p); border-radius: 999px; text-decoration: none; }',
			'.maxi-pagination a:hover { background: var(--bg-2); }',
			'.maxi-pagination .maxi-pagination__link--current { background: var(--highlight); color: var(--bg-1); border-color: var(--highlight); }',
		].join('\n');
	} else {
		// Minimal
		base['cl-pagination-column-gap-general'] = 10;
		base['cl-pagination-font-weight-general'] = '500';
		base['cl-pagination-link-hover-palette-color'] = 4;
		base['cl-pagination-link-current-palette-color'] = 5;
	}

	const changes = { ...base };

	if (advancedCss) {
		const advancedChanges = mergeAdvancedCss(attributes, advancedCss, 'general');
		if (advancedChanges) Object.assign(changes, advancedChanges);
	}

	return changes;
};

const buildColumnGapChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue(rawValue, 'px');
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};
	breakpoints.forEach(bp => {
		changes[`column-gap-${bp}`] = parsed.value;
		changes[`column-gap-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

const buildCustomLabelChanges = value => {
	const label = typeof value === 'string' ? value : String(value ?? '');
	return { customLabel: label };
};

const buildCustomCssChanges = (value, attributes) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: { css: rawValue };

	const css = normalizeCss(config.css || config.value || '');
	if (!css || /[{}]/.test(css)) return null;

	const category = config.category || 'container';
	const index = config.index || 'normal';
	const bp = config.breakpoint || breakpoint || 'general';

	return mergeCustomCss(attributes, { css, category, index, breakpoint: bp });
};

const buildClAttributeChanges = value => {
	if (!value || typeof value !== 'object') return null;
	const changes = {};

	if (value.key && value.value !== undefined) {
		const normalizedKey = String(value.key).replace(/_/g, '-');
		changes[normalizedKey] = value.value;
	} else {
		Object.entries(value).forEach(([key, val]) => {
			if (!key) return;
			const normalizedKey = String(key).replace(/_/g, '-');
			if (!normalizedKey.startsWith('cl-')) return;
			changes[normalizedKey] = val;
		});
	}

	return Object.keys(changes).length ? changes : null;
};

export const buildContainerCGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	const quotedLabel = extractQuotedText(message);
	const labelMatch =
		quotedLabel ||
		extractValueFromPatterns(message, [
			/(?:custom\s*label|block\s*label|rename\s*(?:this)?\s*container)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
		]);
	if (labelMatch && /(label|rename|named)/i.test(message || '')) {
		return {
			action: actionType,
			property: 'custom_label',
			value: labelMatch,
			message: 'Custom label updated.',
			...actionTarget,
		};
	}

	const paginationStyle = extractPaginationStyle(message);
	if (paginationStyle) {
		return {
			action: actionType,
			property: 'pagination_style',
			value: paginationStyle,
			message: 'Pagination style updated.',
			...actionTarget,
		};
	}

	const paginationSpacing = extractPaginationSpacing(message);
	if (paginationSpacing) {
		return {
			action: actionType,
			property: 'pagination_spacing',
			value: paginationSpacing,
			message: 'Pagination spacing updated.',
			...actionTarget,
		};
	}

	const paginationText = extractPaginationText(message);
	if (paginationText) {
		return {
			action: actionType,
			property: 'pagination_text',
			value: paginationText,
			message: 'Pagination labels updated.',
			...actionTarget,
		};
	}

	const loopStatus = extractLoopStatus(message);
	const loopType = extractLoopType(message);
	const loopOrder = extractLoopOrder(message);
	const loopRelation = extractLoopRelation(message);
	const perPage = extractLoopPerPage(message);
	const paginationStatus = extractPaginationStatus(message);
	const paginationShowPages = extractPaginationPageList(message);

	const contextLoop = {};
	if (loopStatus !== null) contextLoop.status = loopStatus;
	if (loopType) {
		contextLoop.type = loopType.type;
		if (loopType.perPage && perPage === null) {
			contextLoop.perPage = loopType.perPage;
		}
	}
	if (perPage !== null) contextLoop.perPage = perPage;
	if (loopOrder) {
		contextLoop.orderBy = loopOrder.orderBy;
		contextLoop.order = loopOrder.order;
	}
	if (loopRelation) contextLoop.relation = loopRelation;

	const hasLoopIntent = Object.keys(contextLoop).length > 0;
	if (hasLoopIntent) {
		if (paginationStatus !== null) contextLoop.pagination = paginationStatus;
		if (paginationShowPages !== null)
			contextLoop.showPageList = paginationShowPages;
		return {
			action: actionType,
			property: 'context_loop',
			value: contextLoop,
			message: 'Context loop updated.',
			...actionTarget,
		};
	}

	if (paginationShowPages !== null) {
		return {
			action: actionType,
			property: 'pagination_show_pages',
			value: paginationShowPages,
			message: 'Pagination page list updated.',
			...actionTarget,
		};
	}

	if (paginationStatus !== null) {
		return {
			action: actionType,
			property: 'pagination',
			value: paginationStatus,
			message: paginationStatus ? 'Pagination enabled.' : 'Pagination disabled.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerCGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		normalized.startsWith('cl_') &&
		![
			'cl_attributes',
			'cl_attribute',
			'context_loop_attributes',
			'context_loop_attribute',
		].includes(normalized)
	) {
		const key = normalized.replace(/_/g, '-');
		return { [key]: value };
	}

	switch (normalized) {
		case 'context_loop':
			return buildContextLoopAttributeChanges(value);
		case 'pagination':
			return { 'cl-pagination': Boolean(value) };
		case 'pagination_show_pages':
			return { 'cl-pagination-show-page-list': Boolean(value) };
		case 'pagination_text': {
			const textValue = value && typeof value === 'object' ? value : {};
			return Object.fromEntries(
				Object.entries({
					'cl-pagination-previous-text': textValue.previousText || textValue.previous,
					'cl-pagination-next-text': textValue.nextText || textValue.next,
				}).filter(([, val]) => val !== undefined)
			);
		}
		case 'pagination_spacing':
			return buildPaginationSpacingChanges(value);
		case 'pagination_style':
			return buildPaginationStyleChanges(value, attributes);
		case 'column_gap':
			return buildColumnGapChanges(value);
		case 'custom_label':
			return buildCustomLabelChanges(value);
		case 'custom_css':
			return buildCustomCssChanges(value, attributes);
		case 'cl_attributes':
		case 'cl_attribute':
		case 'context_loop_attributes':
		case 'context_loop_attribute':
			return buildClAttributeChanges(value);
		default:
			return null;
	}
};

export const getContainerCGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		normalized === 'context_loop' ||
		normalized === 'pagination' ||
		normalized === 'pagination_style' ||
		normalized === 'pagination_spacing' ||
		normalized === 'pagination_text' ||
		normalized === 'pagination_show_pages' ||
		normalized === 'cl_attributes' ||
		normalized.startsWith('cl_')
	) {
		return { tabIndex: 0, accordion: 'context loop' };
	}

	if (normalized === 'column_gap') {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	if (normalized === 'custom_css') {
		return { tabIndex: 1, accordion: 'custom css' };
	}

	if (normalized === 'custom_label') {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	return null;
};

export default {
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
};
