/**
 * Text Logic Handler for AI Chat Panel
 * Maps natural language to Text Maxi attributes.
 *
 * Upgrades included:
 * - Style Card enforcement (no hardcoded hex in defaults)
 * - True "3-option clarify" flow for vague/subjective requests
 * - Responsive automation for font-size + max-width (100/60/40) with sensible safeguards
 * - Property normalization (aliases -> canonical)
 * - Reset/off support for highlight/border/shadow/list
 * - Custom CSS dedupe + upsert (prevents CSS bloat and stale styles)
 * - Added flows: alignment, letter spacing, font family
 * - Basic color accessibility guardrails (rejects transparent/low-alpha text colors in flow)
 */

import { create } from '@wordpress/rich-text';
import { parseBorderStyle } from './utils';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import applyLinkFormat from '@extensions/text/formats/applyLinkFormat';
import { createLinkAttributes } from '@components/toolbar/components/text-link/utils';

/**
 * Breakpoints used by MaxiBlocks.
 *
 * @type {string[]}
 */
const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Scaling factors per breakpoint for the 100/60/40 rule.
 *
 * @param {string} breakpoint
 * @returns {number}
 */
const getScaleFactor = breakpoint => {
	if (breakpoint === 'm' || breakpoint === 's') return 0.6;
	if (breakpoint === 'xs') return 0.4;
	return 1; // general/xxl/xl/l
};

/**
 * Safely parses a unit value.
 *
 * @param {*} rawValue
 * @param {string} fallbackUnit
 * @returns {{value:number, unit:string}}
 */
const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit, breakpoint: null };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit, breakpoint: null };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.size ?? rawValue.value ?? rawValue.width ?? rawValue.height;
		const unit = rawValue.unit || fallbackUnit;
		const breakpoint = rawValue.breakpoint || null;
		return { value: Number(size) || 0, unit, breakpoint };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return {
			value: Number(match[1]),
			unit: match[2] || fallbackUnit,
			breakpoint: null,
		};
	}

	const parsed = Number.parseFloat(raw);
	return {
		value: Number.isNaN(parsed) ? 0 : parsed,
		unit: fallbackUnit,
		breakpoint: null,
	};
};

/**
 * Normalizes a CSS declaration block.
 *
 * @param {string} css
 * @returns {string}
 */
const normalizeCss = css => {
	if (!css) return '';
	const trimmed = String(css).trim();
	return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
};

/**
 * Splits CSS into declarations (prop:value) chunks.
 *
 * @param {string} css
 * @returns {string[]}
 */
const splitDeclarations = css =>
	normalizeCss(css)
		.split(';')
		.map(part => String(part).trim())
		.filter(Boolean);

/**
 * Parses "prop: value" into an object.
 *
 * @param {string} declaration
 * @returns {{prop: string, value: string} | null}
 */
const parseDeclaration = declaration => {
	const raw = String(declaration || '').trim();
	const idx = raw.indexOf(':');
	if (idx === -1) return null;

	const prop = raw.slice(0, idx).trim();
	const value = raw.slice(idx + 1).trim();
	if (!prop) return null;

	return { prop, value };
};

/**
 * Upserts declarations from patchCss into baseCss.
 * - Ensures 1 declaration per property (last wins)
 * - Prevents duplication/bloat
 *
 * @param {string} baseCss
 * @param {string} patchCss
 * @returns {string}
 */
const upsertCss = (baseCss, patchCss) => {
	const map = new Map();

	// Base first
	splitDeclarations(baseCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	// Patch overrides
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

/**
 * Merges CSS into custom-css-general[text][normal] via upsert.
 *
 * @param {Object} attributes
 * @param {string} category
 * @param {string} index
 * @param {string} cssPatch
 * @returns {Object}
 */
const mergeCustomCss = (attributes, category, index, cssPatch) => {
	const existing = attributes?.['custom-css-general'];
	const next = existing ? { ...existing } : {};
	const categoryObj = next[category] ? { ...next[category] } : {};
	const currentCss = categoryObj[index] || '';

	const updatedCss = upsertCss(currentCss, cssPatch);
	if (updatedCss) {
		categoryObj[index] = updatedCss;
		next[category] = categoryObj;
	} else {
		// Remove empty bucket
		delete categoryObj[index];
		if (Object.keys(categoryObj).length) next[category] = categoryObj;
		else delete next[category];
	}

	return { 'custom-css-general': next };
};

/**
 * Normalizes AI-layer property names to canonical names.
 *
 * @param {string} property
 * @returns {string}
 */
const normalizeTextProperty = property => {
	const map = {
		text_content: 'content',
		text_level: 'textLevel',
		textLevel: 'textLevel',
	};
	return map[property] || property;
};

/**
 * Detects risky text colors that reduce readability (transparent / low-alpha rgba).
 *
 * @param {*} colorValue
 * @returns {boolean}
 */
const isRiskyTextColor = colorValue => {
	if (typeof colorValue !== 'string') return false;

	const raw = colorValue.trim().toLowerCase();
	if (raw === 'transparent') return true;

	// rgba(r,g,b,a) with a < 0.5
	const rgbaMatch = raw.match(/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0?\.\d+|0)\s*\)$/i);
	if (!rgbaMatch) return false;

	const alpha = Number(rgbaMatch[1]);
	return Number.isFinite(alpha) && alpha < 0.5;
};

/**
 * Builds palette vs custom color changes for text.
 *
 * @param {*} colorValue
 * @returns {Object}
 */
const buildTextColorChanges = colorValue => {
	const isPalette = typeof colorValue === 'number';

	if (isPalette) {
		return {
			'palette-status-general': true,
			'palette-color-general': colorValue,
			'color-general': '',
		};
	}

	return {
		'palette-status-general': false,
		'color-general': colorValue,
		'palette-color-general': '',
	};
};

/**
 * Builds font-weight changes.
 *
 * @param {*} weightValue
 * @returns {Object}
 */
const buildFontWeightChanges = (weightValue, { breakpoint = null, isHover = false } = {}) => {
	const weightMap = {
		thin: 100,
		'extra-light': 200,
		extralight: 200,
		light: 300,
		normal: 400,
		regular: 400,
		medium: 600,
		'semi-bold': 600,
		semibold: 600,
		bold: 700,
		'extra-bold': 800,
		extrabold: 800,
		heavy: 800,
		black: 900,
	};
	const normalized = String(weightValue ?? '').toLowerCase();
	const weight = weightMap[normalized] ?? weightValue;

	const breakpoints = breakpoint ? [breakpoint] : BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`font-weight${suffix}`] = String(weight);
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

/**
 * Builds text transform changes.
 * Handles small-caps by setting font-variant through Advanced CSS (deduped/upserted).
 *
 * @param {Object} attributes
 * @param {*} transformValue
 * @returns {Object}
 */
const buildTextTransformChanges = (attributes, transformValue) => {
	const normalized = String(transformValue || '').toLowerCase();

	if (normalized === 'small-caps') {
		return {
			'text-transform-general': 'none',
			...mergeCustomCss(attributes, 'text', 'normal', 'font-variant: small-caps;'),
		};
	}

	return {
		'text-transform-general': normalized || 'none',
		...mergeCustomCss(attributes, 'text', 'normal', 'font-variant: normal;'),
	};
};

/**
 * Highlight styles (Style Card compliant: uses vars, no hex).
 *
 * Includes resets so switching styles does not leave stale properties behind.
 *
 * @param {Object} attributes
 * @param {*} highlightStyle
 * @returns {Object|null}
 */
const buildTextHighlightChanges = (attributes, highlightStyle) => {
	const style = String(highlightStyle || '').toLowerCase();

	const styleMap = {
		// Uses brand var instead of hardcoded #fffa00
		marker:
			'background: linear-gradient(to top, var(--highlight) 50%, transparent 50%);' +
			' border-bottom: none;' +
			' padding: 0;' +
			' border-radius: 0;' +
			' display: inline;' +
			' color: inherit;',
		underline:
			'border-bottom: 3px solid var(--highlight);' +
			' background: none;' +
			' padding: 0;' +
			' border-radius: 0;' +
			' display: inline;' +
			' color: inherit;',
		badge:
			'background: var(--highlight);' +
			' color: var(--bg-1);' +
			' padding: 4px 8px;' +
			' border-radius: 4px;' +
			' display: inline-block;' +
			' border-bottom: none;',
		// Off/reset
		off:
			'background: none;' +
			' border-bottom: none;' +
			' padding: 0;' +
			' border-radius: 0;' +
			' display: inline;' +
			' color: inherit;',
		none:
			'background: none;' +
			' border-bottom: none;' +
			' padding: 0;' +
			' border-radius: 0;' +
			' display: inline;' +
			' color: inherit;',
		remove:
			'background: none;' +
			' border-bottom: none;' +
			' padding: 0;' +
			' border-radius: 0;' +
			' display: inline;' +
			' color: inherit;',
	};

	const css = styleMap[style];
	if (!css) return null;

	return mergeCustomCss(attributes, 'text', 'normal', css);
};
/**
 * Builds list changes.
 *
 * @param {*} listValue
 * @returns {Object}
 */
const buildTextListChanges = listValue => {
	if (listValue === 'off' || listValue === 'none' || listValue === false) {
		return { isList: false };
	}

	const config = typeof listValue === 'object' && listValue ? listValue : {};

	return {
		isList: config.isList ?? true,
		typeOfList: config.typeOfList ?? 'ul',
		listStyle: config.listStyle ?? 'disc',
		listStyleCustom: config.listStyleCustom ?? '',
	};
};

/**
 * Text level changes.
 *
 * @param {*} levelValue
 * @returns {Object}
 */
const buildTextLevelChanges = levelValue => ({
	textLevel: String(levelValue || 'p'),
	isList: false,
});

/**
 * Builds dynamic content changes.
 *
 * @param {*} fieldValue
 * @returns {Object}
 */
const buildTextDynamicChanges = fieldValue => {
	if (!fieldValue || fieldValue === 'off') {
		return { 'dc-status': false };
	}

	const fieldMap = {
		'post-title': 'title',
		'post-date': 'date',
		'author-name': 'author',
	};
	const normalizedField = fieldMap[fieldValue] || fieldValue;

	return {
		'dc-status': true,
		'dc-source': 'wp',
		'dc-type': 'posts',
		'dc-relation': 'current',
		'dc-show': 'current',
		'dc-field': normalizedField,
		...(normalizedField === 'author' ? { 'dc-sub-field': 'name' } : {}),
	};
};

/**
 * Builds text link changes.
 *
 * @param {Object} block
 * @param {*} linkValue
 * @returns {Object|null}
 */
const buildTextLinkChanges = (block, linkValue) => {
	const incoming =
		typeof linkValue === 'object' && linkValue ? linkValue : { url: linkValue };
	const url = incoming?.url ? String(incoming.url) : '';
	if (!url) return null;

	const content = block?.attributes?.content || '';
	if (!content) return null;

	const rel = String(incoming.rel || '');
	const opensInNewTab =
		incoming.opensInNewTab === true || incoming.target === '_blank';
	const noFollow =
		incoming.noFollow === true || /nofollow/i.test(rel);
	const sponsored =
		incoming.sponsored === true || /sponsored/i.test(rel);
	const ugc = incoming.ugc === true || /\bugc\b/i.test(rel);

	const linkAttributes = createLinkAttributes({
		url,
		opensInNewTab,
		noFollow,
		sponsored,
		ugc,
		title: incoming.title || '',
		linkValue: {},
	});

	const formatValue = create({ html: content });
	formatValue.start = 0;
	formatValue.end = formatValue.formats ? formatValue.formats.length : 0;

	const typography = {
		...getGroupAttributes(block.attributes, 'typography'),
	};

	const applied = applyLinkFormat({
		formatValue,
		typography,
		linkAttributes,
		isList: block.attributes?.isList,
		textLevel: block.attributes?.textLevel,
		returnFormatValue: true,
	});

	const { formatValue: _unused, ...changes } = applied || {};
	return changes || null;
};

/**
 * Builds alignment changes across breakpoints.
 *
 * @param {*} alignValue
 * @returns {Object}
 */
const buildTextAlignChanges = (alignValue, block) => {
	const raw = String(alignValue || '').toLowerCase();
	const normalized = raw === 'centre' ? 'center' : raw;
	const cleaned = normalized === 'justified' ? 'justify' : normalized;

	const allowed = new Set(['left', 'center', 'right', 'justify']);
	const value = allowed.has(cleaned) ? cleaned : 'left';

	const changes = {};
	BREAKPOINTS.forEach(bp => {
		changes[`text-alignment-${bp}`] = value;
	});
	if (block?.name?.startsWith('core/')) {
		changes.textAlign = value;
	}

	return changes;
};

/**
 * Builds letter spacing changes across breakpoints.
 *
 * @param {*} spacingValue
 * @returns {Object}
 */
const buildTextLetterSpacingChanges = (spacingValue, { isHover = false } = {}) => {
	const raw = String(spacingValue ?? '').trim().toLowerCase();
	const parsed =
		raw === 'normal' || raw === 'reset' || raw === 'off' || raw === 'none'
			? { value: 0, unit: 'em' }
			: parseUnitValue(spacingValue, 'em');

	const unit = parsed.unit === '-' ? 'em' : parsed.unit;
	const changes = {};
	const suffix = isHover ? '-hover' : '';
	BREAKPOINTS.forEach(bp => {
		changes[`letter-spacing-${bp}${suffix}`] = parsed.value;
		changes[`letter-spacing-unit-${bp}${suffix}`] = unit;
	});
	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

/**
 * Builds font-family changes across breakpoints (brand-safe generic options).
 *
 * @param {*} familyValue
 * @returns {Object}
 */
const buildTextFontFamilyChanges = (familyValue, { breakpoint = null, isHover = false } = {}) => {
	const raw = String(familyValue || '').trim();
	const normalized = raw.toLowerCase();

	const familyMap = {
		sans: 'sans-serif',
		'sans-serif': 'sans-serif',
		serif: 'serif',
		mono: 'monospace',
		monospace: 'monospace',
		inherit: 'inherit',
		reset: 'inherit',
		off: 'inherit',
		system: 'system-ui',
	};

	const family = familyMap[normalized] || raw || 'inherit';
	const changes = {};

	const breakpoints = breakpoint ? [breakpoint] : BREAKPOINTS;
	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`font-family${suffix}`] = family;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

/**
 * Builds font-style changes across breakpoints.
 *
 * @param {*} styleValue
 * @param {Object} options
 * @param {string|null} options.breakpoint
 * @param {boolean} options.isHover
 * @returns {Object}
 */
const buildTextFontStyleChanges = (styleValue, { breakpoint = null, isHover = false } = {}) => {
	const normalized = String(styleValue || '').trim().toLowerCase();
	const styleMap = {
		italic: 'italic',
		oblique: 'oblique',
		normal: 'normal',
		regular: 'normal',
		upright: 'normal',
		roman: 'normal',
		none: 'normal',
		reset: 'normal',
		off: 'normal',
	};

	const style = styleMap[normalized] || normalized || 'normal';
	const changes = {};
	const breakpoints = breakpoint ? [breakpoint] : BREAKPOINTS;

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`font-style${suffix}`] = style;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

/**
 * Builds a responsive change-set for numeric dimension attributes (100/60/40),
 * with optional scaling safeguards.
 *
 * @param {Object} params
 * @param {string} params.keyBase e.g. "font-size"
 * @param {string} params.unitKeyBase e.g. "font-size-unit"
 * @param {number} params.value
 * @param {string} params.unit
 * @param {boolean} params.scale
 * @param {string} params.kind "fontSize" | "maxWidth"
 * @returns {Object}
 */
const buildResponsiveNumericChanges = ({
	keyBase,
	unitKeyBase,
	value,
	unit,
	scale,
	kind,
	breakpoint = null,
	isHover = false,
}) => {
	const changes = {};

	// Decide if scaling makes sense for this unit/kind.
	const shouldScaleUnit =
		!['-', '%', 'ch'].includes(String(unit || '').toLowerCase());

	const shouldScale =
		Boolean(scale) &&
		shouldScaleUnit &&
		!(
			kind === 'maxWidth' &&
			String(unit).toLowerCase() === 'px' &&
			Number(value) > 0 &&
			Number(value) < 480
		);

	// Helper to clamp font sizes so mobile does not go microscopic.
	const clamp = (nextValue, breakpoint) => {
		if (kind !== 'fontSize') return nextValue;

		const u = String(unit || '').toLowerCase();
		if (u === 'px') {
			// Min readable ~12px
			return Math.max(12, nextValue);
		}
		if (u === 'rem' || u === 'em') {
			// Min readable ~0.75rem/em
			return Math.max(0.75, nextValue);
		}
		return nextValue;
	};

	// Rounded outputs keep attributes cleaner.
	const round = num => {
		const n = Number(num);
		if (!Number.isFinite(n)) return 0;
		return Math.round(n * 100) / 100;
	};

	const targetBreakpoints = breakpoint ? [breakpoint] : BREAKPOINTS;

	targetBreakpoints.forEach(bp => {
		const factor = breakpoint ? 1 : shouldScale ? getScaleFactor(bp) : 1;
		const nextValue = clamp(round(value * factor), bp);

		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`${keyBase}${suffix}`] = nextValue;
		changes[`${unitKeyBase}${suffix}`] = unit;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

/**
 * Builds border reset changes across breakpoints.
 *
 * @param {string} prefix
 * @returns {Object}
 */
const buildTextBorderResetChanges = prefix => {
	const changes = {};
	BREAKPOINTS.forEach(bp => {
		changes[`${prefix}border-style-${bp}`] = 'none';
		changes[`${prefix}border-top-width-${bp}`] = 0;
		changes[`${prefix}border-bottom-width-${bp}`] = 0;
		changes[`${prefix}border-left-width-${bp}`] = 0;
		changes[`${prefix}border-right-width-${bp}`] = 0;
		changes[`${prefix}border-sync-width-${bp}`] = 'all';
		changes[`${prefix}border-unit-width-${bp}`] = 'px';

		changes[`${prefix}border-palette-status-${bp}`] = false;
		changes[`${prefix}border-palette-color-${bp}`] = '';
		changes[`${prefix}border-color-${bp}`] = '';
	});

	return changes;
};

/**
 * Builds shadow reset changes across breakpoints.
 *
 * @param {string} prefix
 * @returns {Object}
 */
const buildTextShadowResetChanges = prefix => {
	const changes = {};
	BREAKPOINTS.forEach(bp => {
		changes[`${prefix}box-shadow-status-${bp}`] = false;
		changes[`${prefix}box-shadow-horizontal-${bp}`] = 0;
		changes[`${prefix}box-shadow-vertical-${bp}`] = 0;
		changes[`${prefix}box-shadow-blur-${bp}`] = 0;
		changes[`${prefix}box-shadow-spread-${bp}`] = 0;
		changes[`${prefix}box-shadow-inset-${bp}`] = false;

		changes[`${prefix}box-shadow-palette-status-${bp}`] = false;
		changes[`${prefix}box-shadow-palette-color-${bp}`] = '';
		changes[`${prefix}box-shadow-color-${bp}`] = '';
	});

	return changes;
};
export const TEXT_PATTERNS = [
	// ============================================================
	// GROUP 0: PRIORITY DIRECT REMOVALS (must come before flows)
	// ============================================================
	{
		regex: /\b(remove|disable|clear|off|no)\b.*\b(highlight|marker|highlighter|badge|pill)\b/i,
		property: 'text_highlight',
		value: 'off',
		selectionMsg: 'Removed text highlight.',
		pageMsg: 'Removed text highlight.',
		target: 'text',
	},
	{
		regex: /\b(remove|disable|clear|off|no)\b.*\b(border|bordr|outline|frame|stroke)\b/i,
		property: 'text_border',
		value: 'off',
		selectionMsg: 'Removed text border.',
		pageMsg: 'Removed text border.',
		target: 'text',
	},
	{
		regex: /\b(remove|disable|clear|off|no)\b.*\b(shadow|glow|drop\s*shadow|text\s*shadow)\b/i,
		property: 'text_shadow',
		value: 'off',
		selectionMsg: 'Removed text shadow.',
		pageMsg: 'Removed text shadow.',
		target: 'text',
	},
	{
		regex: /\b(remove|disable|clear|off|no)\b.*\b(list|bullets?|bullet\s*points?|numbered|checkmarks?)\b/i,
		property: 'text_list',
		value: 'off',
		selectionMsg: 'Removed list formatting.',
		pageMsg: 'Removed list formatting.',
		target: 'text',
	},

	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Clarifications)
	// ============================================================
	{
		regex: /\b(improve|polish|refine|tidy|clean\s*up|make\s*(it\s*)?(better|nicer|cleaner|more\s*modern))\b.*\b(text|typography|heading|title|paragraph)\b|\b(text|typography|heading|title|paragraph)\b.*\b(improve|polish|refine|tidy|clean\s*up)\b/i,
		property: 'flow_text_polish',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Polished text style.',
		target: 'text',
	},
	{
		regex: /\b(text|font)\b.*\b(size|sizing)\b|\b(make|increase|decrease|bigger|larger|smaller)\b.*\b(text|font)\b/i,
		property: 'flow_text_size',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text size.',
		target: 'text',
	},
	{
		regex: /\b(bold|bolder|font\s*weight|heavier|stronger)\b/i,
		property: 'flow_text_weight',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text weight.',
		target: 'text',
	},
	{
		regex: /\b(text|font|heading)\b.*\b(colou?r|color)\b|\b(colou?r|color)\b.*\b(text|font|heading)\b|stand\s*out.*text/i,
		property: 'flow_text_color',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text color.',
		target: 'text',
	},
	{
		regex: /\b(align|alignment|center(?:ed)?|centre(?:d)?|left(?:-aligned)?|right(?:-aligned)?|justify(?:ied)?)\b.*\b(text|heading|title|paragraph)\b|\b(text|heading|title|paragraph)\b.*\b(center(?:ed)?|centre(?:d)?|left|right|justify(?:ied)?)\b/i,
		property: 'flow_text_align',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text alignment.',
		target: 'text',
	},
	{
		regex: /\b(letter\s*spacing|tracking|space\s*out\s*letters|kerning)\b/i,
		property: 'flow_text_letter_spacing',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated letter spacing.',
		target: 'text',
	},
	{
		regex: /\b(font\s*family|typeface|serif|sans\s*serif|monospace)\b.*\b(text|heading|title|paragraph)\b|\b(text|heading|title|paragraph)\b.*\b(serif|sans\s*serif|monospace)\b/i,
		property: 'flow_text_font_family',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated font family.',
		target: 'text',
	},
	{
		regex: /\b(border|bordr|outline|frame|stroke)\b|\b(text|heading|title|paragraph)\b.*\b(border|bordr|outline|frame|stroke)\b/i,
		property: 'flow_border',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text border.',
		target: 'text',
	},
	{
		regex: /\bshadow|glow|drop\s*shadow|text\s*shadow|depth|lift|elevat(ed|e)?\b/i,
		property: 'flow_shadow',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text shadow.',
		target: 'text',
	},
	{
		regex: /\b(line\s*height|line\s*spacing|readab(le|ility)|easy\s*to\s*read)\b/i,
		property: 'flow_text_line_height',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated line spacing.',
		target: 'text',
	},
	{
		regex: /\b(narrow|narrower|shorter)\b.*\b(text|column|width)\b|reading\s*width|text\s*column\s*width/i,
		property: 'flow_text_width',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text width.',
		target: 'text',
	},
	{
		regex: /\b(uppercase|lowercase|all\s*caps|small\s*caps|caps)\b/i,
		property: 'flow_text_transform',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text casing.',
		target: 'text',
	},
	{
		regex: /\b(highlight|marker|highlighter|badge|pill)\b/i,
		property: 'flow_text_highlight',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text highlight.',
		target: 'text',
	},
	{
		regex: /\b(list|bullets?|bullet\s*points?|numbered|checkmarks?)\b/i,
		property: 'flow_text_list',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated list style.',
		target: 'text',
	},
	{
		regex: /\b(make|set|change|turn)\b.*\b(heading|title|subheading|headline|paragraph|body\s*text)\b/i,
		property: 'flow_text_level',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text level.',
		target: 'text',
	},
	{
		regex: /\b(text\s*decoration|underline|strikethrough|line\s*through)\b/i,
		property: 'flow_text_decoration',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text decoration.',
		target: 'text',
	},
	{
		regex: /\b(dynamic\s*content|post\s*data|cms)\b/i,
		property: 'flow_text_dynamic',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated dynamic content.',
		target: 'text',
	},
	{
		regex: /\b(make|add|set)\b.*\blink\b|link\s*to|make\s*clickable/i,
		property: 'flow_text_link',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated text link.',
		target: 'text',
	},

	// ============================================================
	// GROUP 2: DIRECT ACTIONS
	// ============================================================
	{
		regex: /\b(invert|reverse)\b.*\btext\b.*\b(colou?r|color)\b/i,
		property: 'text_color',
		// Style Card compliant: no hex
		value: 'var(--bg-1)',
		selectionMsg: 'Inverted text color.',
		pageMsg: 'Inverted text color.',
		target: 'text',
	},
	{ regex: /\bh1\b|heading\s*1|title\s*1/i, property: 'textLevel', value: 'h1', selectionMsg: 'Set to H1.', pageMsg: 'Set to H1.', target: 'text' },
	{ regex: /\bh2\b|heading\s*2|title\s*2|subheading/i, property: 'textLevel', value: 'h2', selectionMsg: 'Set to H2.', pageMsg: 'Set to H2.', target: 'text' },
	{ regex: /\bparagraph\b|body\s*text\b/i, property: 'textLevel', value: 'p', selectionMsg: 'Set to paragraph.', pageMsg: 'Set to paragraph.', target: 'text' },
	{ regex: /\b(post\s*title|dynamic\s*title)\b/i, property: 'text_dynamic', value: 'title', selectionMsg: 'Dynamic title enabled.', pageMsg: 'Dynamic title enabled.', target: 'text' },
	{ regex: /\b(post\s*date|publish(ed)?\s*date|dynamic\s*date)\b/i, property: 'text_dynamic', value: 'date', selectionMsg: 'Dynamic date enabled.', pageMsg: 'Dynamic date enabled.', target: 'text' },
	{ regex: /\b(author\s*name|post\s*author|dynamic\s*author)\b/i, property: 'text_dynamic', value: 'author', selectionMsg: 'Dynamic author enabled.', pageMsg: 'Dynamic author enabled.', target: 'text' },
	{ regex: /\b(remove|disable)\b.*\bdynamic\b/i, property: 'text_dynamic', value: 'off', selectionMsg: 'Dynamic content removed.', pageMsg: 'Dynamic content removed.', target: 'text' },
];
export const handleTextUpdate = (block, property, value, prefix, context = {}) => {
	let changes = null;

	const normalizedProperty = normalizeTextProperty(property);
	const isHover = normalizedProperty.endsWith('_hover');
	const baseProperty = isHover
		? normalizedProperty.replace(/_hover$/, '')
		: normalizedProperty;

	const isText =
		block?.name?.includes('text') || block?.name?.includes('heading');
	if (!isText) return null;

	// === INTERACTION FLOWS ===
if (baseProperty === 'flow_text_polish') {
		if (context.text_polish === undefined) {
			return {
				action: 'ask_options',
				target: 'text_polish',
				msg: 'How should I polish the typography?',
				options: [
					{ label: 'Standard / Safe (readability-first)', value: 'standard' },
					{ label: 'Modern / Clean (crisper hierarchy)', value: 'modern' },
					{ label: 'Bold / Full (high-impact emphasis)', value: 'bold' },
				],
			};
		}

		const mode = String(context.text_polish || '').toLowerCase();

		// Shared safe polish baseline (non-destructive).
		const baseLineHeight = {
			...buildResponsiveNumericChanges({
				keyBase: 'line-height',
				unitKeyBase: 'line-height-unit',
				value: 1.5,
				unit: '-',
				scale: false,
				kind: 'lineHeight',
			}),
		};

		if (mode === 'standard') {
			changes = {
				...baseLineHeight,
				...buildFontWeightChanges(400),
				...buildTextColorChanges('var(--p)'),
				'text-decoration-general': 'none',
				...buildTextHighlightChanges(block.attributes, 'off'),
				...buildTextLetterSpacingChanges('normal'),
			};
			return { action: 'apply', attributes: changes, done: true, message: 'Applied a safe, readable text polish.' };
		}

		if (mode === 'modern') {
			changes = {
				...baseLineHeight,
				...buildFontWeightChanges(600),
				...buildTextColorChanges('var(--h1)'),
				'text-decoration-general': 'none',
				...buildTextHighlightChanges(block.attributes, 'off'),
				...buildTextLetterSpacingChanges('normal'),
			};
			return { action: 'apply', attributes: changes, done: true, message: 'Applied a modern, clean typographic polish.' };
		}

		// Bold / Full
		changes = {
			...baseLineHeight,
			...buildFontWeightChanges(700),
			...buildTextColorChanges('var(--highlight)'),
			'text-decoration-general': 'none',
			...buildTextHighlightChanges(block.attributes, 'underline'),
			...buildTextLetterSpacingChanges('normal'),
		};
		return { action: 'apply', attributes: changes, done: true, message: 'Applied a bold, high-impact text polish.' };
	}

if (baseProperty === 'flow_text_size') {
		if (context.text_size === undefined) {
			return {
				action: 'ask_options',
				target: 'text_size',
				msg: 'Choose a text size:',
				options: [
					{ label: 'Subtitle (1.25rem)', value: { size: 1.25, unit: 'rem' } },
					{ label: 'Title (2.5rem)', value: { size: 2.5, unit: 'rem' } },
					{ label: 'Display (4rem)', value: { size: 4, unit: 'rem' } },
				],
			};
		}

		const sizeValue = parseUnitValue(context.text_size, 'rem');

		changes = buildResponsiveNumericChanges({
			keyBase: 'font-size',
			unitKeyBase: 'font-size-unit',
			value: sizeValue.value,
			unit: sizeValue.unit,
			scale: true,
			kind: 'fontSize',
			breakpoint: sizeValue.breakpoint,
		});

		return { action: 'apply', attributes: changes, done: true, message: 'Updated text size (responsive 100/60/40).' };
	}

if (baseProperty === 'flow_text_weight') {
		if (context.text_weight === undefined) {
			return {
				action: 'ask_options',
				target: 'text_weight',
				msg: 'Choose a font weight:',
				options: [
					{ label: 'Regular (400)', value: 400 },
					{ label: 'Medium (600)', value: 600 },
					{ label: 'Heavy (800)', value: 800 },
				],
			};
		}

		changes = buildFontWeightChanges(context.text_weight);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text weight.' };
	}

if (baseProperty === 'flow_text_color') {
		if (context.text_color === undefined) {
			return {
				action: 'ask_options',
				target: 'text_color',
				msg: 'Choose a text color:',
				options: [
					{ label: 'Brand (var(--highlight))', value: 'var(--highlight)' },
					{ label: 'Dark (var(--h1))', value: 'var(--h1)' },
					{ label: 'Subtle (var(--p))', value: 'var(--p)' },
				],
			};
		}

		// Accessibility guardrail: reject transparent/low-alpha colors in flow.
		if (isRiskyTextColor(context.text_color)) {
			return {
				action: 'ask_options',
				target: 'text_color',
				msg: 'That color may reduce readability. Choose a safer option:',
				options: [
					{ label: 'Brand (var(--highlight))', value: 'var(--highlight)' },
					{ label: 'Dark (var(--h1))', value: 'var(--h1)' },
					{ label: 'Subtle (var(--p))', value: 'var(--p)' },
				],
			};
		}

		changes = buildTextColorChanges(context.text_color);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text color.' };
	}

if (baseProperty === 'flow_text_align') {
		if (context.text_align === undefined) {
			return {
				action: 'ask_options',
				target: 'text_align',
				msg: 'Choose text alignment:',
				options: [
					{ label: 'Left', value: 'left' },
					{ label: 'Center', value: 'center' },
					{ label: 'Right', value: 'right' },
					{ label: 'Justify', value: 'justify' },
				],
			};
		}

		changes = buildTextAlignChanges(context.text_align, block);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text alignment.' };
	}

if (baseProperty === 'flow_text_letter_spacing') {
		if (context.text_letter_spacing === undefined) {
			return {
				action: 'ask_options',
				target: 'text_letter_spacing',
				msg: 'Choose letter spacing (tracking):',
				options: [
					{ label: 'Tight (-0.02em)', value: { value: -0.02, unit: 'em' } },
					{ label: 'Normal', value: 'normal' },
					{ label: 'Wide (0.05em)', value: { value: 0.05, unit: 'em' } },
					{ label: 'Extra (0.1em)', value: { value: 0.1, unit: 'em' } },
				],
			};
		}

		changes = buildTextLetterSpacingChanges(context.text_letter_spacing);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated letter spacing.' };
	}

if (baseProperty === 'flow_text_font_family') {
		if (context.text_font_family === undefined) {
			return {
				action: 'ask_options',
				target: 'text_font_family',
				msg: 'Choose a font family style:',
				options: [
					{ label: 'Inherit (theme default)', value: 'inherit' },
					{ label: 'Sans-serif', value: 'sans-serif' },
					{ label: 'Serif', value: 'serif' },
					{ label: 'Monospace', value: 'monospace' },
				],
			};
		}

		changes = buildTextFontFamilyChanges(context.text_font_family);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated font family.' };
	}

	if (normalizedProperty === 'flow_border') {
		// Ask style first (allows Off without color selection)
		if (!context.border_style) {
			return {
				action: 'ask_options',
				target: 'border_style',
				msg: 'Which border style?',
				options: [
					{ label: 'None (remove border)', value: 'off' },
					{ label: 'Solid Thin', value: 'solid-1px' },
					{ label: 'Solid Medium', value: 'solid-2px' },
					{ label: 'Solid Thick', value: 'solid-4px' },
					{ label: 'Dashed', value: 'dashed-2px' },
					{ label: 'Dotted', value: 'dotted-2px' },
				],
			};
		}

		if (context.border_style === 'off' || context.border_style === 'none') {
			changes = buildTextBorderResetChanges(prefix);
			return { action: 'apply', attributes: changes, done: true, message: 'Removed text border.' };
		}

		if (!context.border_color) {
			return { action: 'ask_palette', target: 'border_color', msg: 'Which colour for the border?' };
		}

		const borderConfig = parseBorderStyle(context.border_style);
		if (!borderConfig) {
			return {
				action: 'ask_options',
				target: 'border_style',
				msg: 'Which border style?',
				options: [
					{ label: 'None (remove border)', value: 'off' },
					{ label: 'Solid Thin', value: 'solid-1px' },
					{ label: 'Solid Medium', value: 'solid-2px' },
					{ label: 'Solid Thick', value: 'solid-4px' },
					{ label: 'Dashed', value: 'dashed-2px' },
					{ label: 'Dotted', value: 'dotted-2px' },
				],
			};
		}

		const { style, width } = borderConfig;
		const color = context.border_color;
		const isPalette = typeof color === 'number';

		changes = {};
		BREAKPOINTS.forEach(bp => {
			changes[`${prefix}border-style-${bp}`] = style;
			changes[`${prefix}border-top-width-${bp}`] = width;
			changes[`${prefix}border-bottom-width-${bp}`] = width;
			changes[`${prefix}border-left-width-${bp}`] = width;
			changes[`${prefix}border-right-width-${bp}`] = width;
			changes[`${prefix}border-sync-width-${bp}`] = 'all';
			changes[`${prefix}border-unit-width-${bp}`] = 'px';

			if (isPalette) {
				changes[`${prefix}border-palette-status-${bp}`] = true;
				changes[`${prefix}border-palette-color-${bp}`] = color;
				changes[`${prefix}border-color-${bp}`] = '';
			} else {
				changes[`${prefix}border-color-${bp}`] = color;
				changes[`${prefix}border-palette-status-${bp}`] = false;
				changes[`${prefix}border-palette-color-${bp}`] = '';
			}
		});

		return { action: 'apply', attributes: changes, done: true, message: 'Applied border to text.' };
	}

	if (normalizedProperty === 'flow_shadow') {
		// Ask intensity first (allows Off without color selection)
		if (!context.shadow_intensity) {
			return {
				action: 'ask_options',
				target: 'shadow_intensity',
				msg: 'Choose intensity:',
				options: [
					{ label: 'None (remove shadow)', value: 'off' },
					{ label: 'Soft', value: 'soft' },
					{ label: 'Crisp', value: 'crisp' },
					{ label: 'Bold', value: 'bold' },
					{ label: 'Glow', value: 'glow' },
				],
			};
		}

		if (context.shadow_intensity === 'off') {
			changes = buildTextShadowResetChanges(prefix);
			return { action: 'apply', attributes: changes, done: true, message: 'Removed text shadow.' };
		}

		if (!context.shadow_color) {
			return { action: 'ask_palette', target: 'shadow_color', msg: 'Which colour for the shadow?' };
		}

		const color = context.shadow_color;
		const intensity = context.shadow_intensity;

		let x = 0;
		let y = 4;
		let blur = 10;
		let spread = 0;
		if (intensity === 'soft') { x = 0; y = 10; blur = 30; spread = 0; }
		if (intensity === 'crisp') { x = 0; y = 2; blur = 4; spread = 0; }
		if (intensity === 'bold') { x = 0; y = 20; blur = 25; spread = -5; }
		if (intensity === 'glow') { x = 0; y = 0; blur = 15; spread = 2; }

		// Apply across breakpoints for consistency
		changes = {};
		BREAKPOINTS.forEach(bp => {
			changes[`${prefix}box-shadow-status-${bp}`] = true;
			changes[`${prefix}box-shadow-horizontal-${bp}`] = x;
			changes[`${prefix}box-shadow-vertical-${bp}`] = y;
			changes[`${prefix}box-shadow-blur-${bp}`] = blur;
			changes[`${prefix}box-shadow-spread-${bp}`] = spread;
			changes[`${prefix}box-shadow-inset-${bp}`] = false;

			if (typeof color === 'number') {
				changes[`${prefix}box-shadow-palette-status-${bp}`] = true;
				changes[`${prefix}box-shadow-palette-color-${bp}`] = color;
				changes[`${prefix}box-shadow-color-${bp}`] = '';
			} else {
				changes[`${prefix}box-shadow-color-${bp}`] = color;
				changes[`${prefix}box-shadow-palette-status-${bp}`] = false;
				changes[`${prefix}box-shadow-palette-color-${bp}`] = '';
			}
		});

		const intensityLabel = {
			soft: 'Soft',
			crisp: 'Crisp',
			bold: 'Bold',
			glow: 'Glow',
		}[intensity] || 'Custom';

		return { action: 'apply', attributes: changes, done: true, message: `Applied ${intensityLabel} shadow to text.` };
	}

if (baseProperty === 'flow_text_line_height') {
		if (context.text_line_height === undefined) {
			return {
				action: 'ask_options',
				target: 'text_line_height',
				msg: 'Choose line spacing:',
				options: [
					{ label: 'Compact (1.1)', value: { value: 1.1, unit: '-' } },
					{ label: 'Standard (1.5)', value: { value: 1.5, unit: '-' } },
					{ label: 'Loose (1.8)', value: { value: 1.8, unit: '-' } },
				],
			};
		}

		const lineValue = parseUnitValue(context.text_line_height, '-');

		// Do not scale line-height; apply consistently.
		changes = buildResponsiveNumericChanges({
			keyBase: 'line-height',
			unitKeyBase: 'line-height-unit',
			value: lineValue.value,
			unit: lineValue.unit || '-',
			scale: false,
			kind: 'lineHeight',
		});

		return { action: 'apply', attributes: changes, done: true, message: 'Updated line spacing.' };
	}

if (baseProperty === 'flow_text_width') {
		if (context.text_max_width === undefined) {
			return {
				action: 'ask_options',
				target: 'text_max_width',
				msg: 'Choose a text width:',
				options: [
					{ label: 'Reading (65ch)', value: { size: 65, unit: 'ch' } },
					{ label: 'Card (300px)', value: { size: 300, unit: 'px' } },
					{ label: 'Full (1200px)', value: { size: 1200, unit: 'px' } },
				],
			};
		}

		const widthValue = parseUnitValue(context.text_max_width, 'px');

		changes = {
			...buildResponsiveNumericChanges({
				keyBase: 'max-width',
				unitKeyBase: 'max-width-unit',
				value: widthValue.value,
				unit: widthValue.unit,
				scale: true,
				kind: 'maxWidth',
			}),
			'size-advanced-options': true,
		};

		return { action: 'apply', attributes: changes, done: true, message: 'Updated text width (responsive 100/60/40 where appropriate).' };
	}

if (baseProperty === 'flow_text_transform') {
		if (context.text_transform === undefined) {
			return {
				action: 'ask_options',
				target: 'text_transform',
				msg: 'Choose casing:',
				options: [
					{ label: 'Uppercase', value: 'uppercase' },
					{ label: 'Small caps', value: 'small-caps' },
					{ label: 'Lowercase', value: 'lowercase' },
				],
			};
		}

		changes = buildTextTransformChanges(block.attributes, context.text_transform);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text casing.' };
	}

if (baseProperty === 'flow_text_highlight') {
		if (context.text_highlight === undefined) {
			return {
				action: 'ask_options',
				target: 'text_highlight',
				msg: 'Choose a highlight style:',
				options: [
					{ label: 'None (remove highlight)', value: 'off' },
					{ label: 'Marker (var(--highlight))', value: 'marker' },
					{ label: 'Brand underline', value: 'underline' },
					{ label: 'Badge', value: 'badge' },
				],
			};
		}

		changes = buildTextHighlightChanges(block.attributes, context.text_highlight);
		return { action: 'apply', attributes: changes || {}, done: true, message: 'Updated text highlight.' };
	}

if (baseProperty === 'flow_text_list') {
		if (context.text_list === undefined) {
			return {
				action: 'ask_options',
				target: 'text_list',
				msg: 'Choose list style:',
				options: [
					{ label: 'None (remove list)', value: 'off' },
					{ label: 'Bullets', value: { isList: true, typeOfList: 'ul', listStyle: 'disc' } },
					{ label: 'Numbered', value: { isList: true, typeOfList: 'ol', listStyle: 'decimal' } },
					{ label: 'Checkmarks', value: { isList: true, typeOfList: 'ul', listStyle: 'custom', listStyleCustom: 'check-circle' } },
				],
			};
		}

		changes = buildTextListChanges(context.text_list);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated list style.' };
	}

if (baseProperty === 'flow_text_level') {
		if (context.text_level === undefined) {
			return {
				action: 'ask_options',
				target: 'text_level',
				msg: 'Choose a text level:',
				options: [
					{ label: 'Main title (H1)', value: 'h1' },
					{ label: 'Section heading (H2)', value: 'h2' },
					{ label: 'Body text (P)', value: 'p' },
				],
			};
		}

		changes = buildTextLevelChanges(context.text_level);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text level.' };
	}

if (baseProperty === 'flow_text_decoration') {
		if (context.text_decoration === undefined) {
			return {
				action: 'ask_options',
				target: 'text_decoration',
				msg: 'Choose text decoration:',
				options: [
					{ label: 'None', value: 'none' },
					{ label: 'Underline', value: 'underline' },
					{ label: 'Line-through', value: 'line-through' },
				],
			};
		}

		changes = { 'text-decoration-general': context.text_decoration };
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text decoration.' };
	}

if (baseProperty === 'flow_text_dynamic') {
		if (context.text_dynamic === undefined) {
			return {
				action: 'ask_options',
				target: 'text_dynamic',
				msg: 'Which dynamic field should I use?',
				options: [
					{ label: 'Post title', value: 'title' },
					{ label: 'Post date', value: 'date' },
					{ label: 'Author name', value: 'author' },
					{ label: 'None (remove dynamic)', value: 'off' },
				],
			};
		}

		changes = buildTextDynamicChanges(context.text_dynamic);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated dynamic content.' };
	}

if (baseProperty === 'flow_text_link') {
		if (context.text_link === undefined) {
			return {
				action: 'ask_options',
				target: 'text_link',
				msg: 'I can make this text a link. Paste the URL you want to use.',
				options: [],
			};
		}

		changes = buildTextLinkChanges(block, context.text_link);
		return { action: 'apply', attributes: changes || {}, done: true, message: 'Updated text link.' };
	}

	// === STANDARD ACTIONS ===
switch (baseProperty) {
		case 'text_color':
			changes = buildTextColorChanges(value);
			break;

	case 'text_font_size': {
		const sizeValue = parseUnitValue(value, 'px');

		changes = buildResponsiveNumericChanges({
			keyBase: 'font-size',
			unitKeyBase: 'font-size-unit',
			value: sizeValue.value,
			unit: sizeValue.unit,
			scale: true,
			kind: 'fontSize',
			breakpoint: sizeValue.breakpoint,
			isHover,
		});
		break;
	}

		case 'text_line_height': {
			const lineValue = parseUnitValue(value, '-');

			changes = buildResponsiveNumericChanges({
				keyBase: 'line-height',
				unitKeyBase: 'line-height-unit',
				value: lineValue.value,
				unit: lineValue.unit || '-',
				scale: false,
				kind: 'lineHeight',
			});
			break;
		}

		case 'text_max_width': {
			const widthValue = parseUnitValue(value, 'px');

			changes = {
				...buildResponsiveNumericChanges({
					keyBase: 'max-width',
					unitKeyBase: 'max-width-unit',
					value: widthValue.value,
					unit: widthValue.unit,
					scale: true,
					kind: 'maxWidth',
				}),
				'size-advanced-options': true,
			};
			break;
		}

		case 'text_weight': {
			const weightValue =
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				Object.prototype.hasOwnProperty.call(value, 'value')
					? value.value
					: value;
			const breakpoint =
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value.breakpoint
					? value.breakpoint
					: null;
			changes = buildFontWeightChanges(weightValue, {
				breakpoint,
				isHover,
			});
			break;
		}

		case 'text_transform':
			changes = buildTextTransformChanges(block.attributes, value);
			break;

		case 'text_highlight':
			changes = buildTextHighlightChanges(block.attributes, value);
			break;

		case 'text_list':
			changes = buildTextListChanges(value);
			break;

		case 'textLevel':
			changes = buildTextLevelChanges(value);
			break;

		case 'text_dynamic':
			changes = buildTextDynamicChanges(value);
			break;

		case 'content':
			changes = { content: String(value || '') };
			break;

		case 'text_link':
			changes = buildTextLinkChanges(block, value);
			break;

		case 'text_decoration':
			changes = { 'text-decoration-general': value };
			break;

		case 'text_align':
			changes = buildTextAlignChanges(value, block);
			break;

		case 'text_letter_spacing':
			changes = buildTextLetterSpacingChanges(value, { isHover });
			break;

		case 'text_font_family': {
			const familyValue =
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				Object.prototype.hasOwnProperty.call(value, 'value')
					? value.value
					: value;
			const breakpoint =
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value.breakpoint
					? value.breakpoint
					: null;
			changes = buildTextFontFamilyChanges(familyValue, {
				breakpoint,
				isHover,
			});
			break;
		}

		case 'text_font_style': {
			const styleValue =
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				Object.prototype.hasOwnProperty.call(value, 'value')
					? value.value
					: value;
			const breakpoint =
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value.breakpoint
					? value.breakpoint
					: null;
			changes = buildTextFontStyleChanges(styleValue, {
				breakpoint,
				isHover,
			});
			break;
		}

		case 'text_border':
			if (value === 'off' || value === 'none' || value === false) {
				changes = buildTextBorderResetChanges(prefix);
			}
			break;

		case 'text_shadow':
			if (value === 'off' || value === 'none' || value === false) {
				changes = buildTextShadowResetChanges(prefix);
			}
			break;
	}

	if (!changes && typeof normalizedProperty === 'string' && normalizedProperty.startsWith('dc-')) {
		changes = { [normalizedProperty]: value };
	}

	return changes;
};
