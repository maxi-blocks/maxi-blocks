import { RESPONSIVE_BREAKPOINTS, extractBreakpointToken } from './attributeParsers';

const HEX_COLOR_REGEX =
	/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/;

const hasTextContext = message => {
	const lower = String(message || '').toLowerCase();
	return /(text|typography|label|copy|heading|title|paragraph)/.test(lower);
};

const normalizeValueWithUnit = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		return {
			value:
				rawValue.value ??
				rawValue.size ??
				rawValue.amount ??
				rawValue,
			unit: rawValue.unit || null,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
		const size =
			rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|em|rem|ch|vh|vw)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const buildResponsiveValueChanges = (keyBase, value, { breakpoint, isHover } = {}) => {
	if (value === null || value === undefined) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const suffix = isHover ? '-hover' : '';
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${keyBase}-${bp}${suffix}`] = value;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

const buildResponsiveUnitChanges = (
	keyBase,
	unitKeyBase,
	value,
	unit,
	{ breakpoint, isHover } = {}
) => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const suffix = isHover ? '-hover' : '';
	const changes = {};
	const safeUnit = unit || 'px';

	breakpoints.forEach(bp => {
		changes[`${keyBase}-${bp}${suffix}`] = numeric;
		changes[`${unitKeyBase}-${bp}${suffix}`] = safeUnit;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

const extractTextDecoration = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(text\s*decoration|underline|strikethrough|strike\s*through|line\s*through|overline)/.test(
			lower
		)
	) {
		return null;
	}

	if (
		/(remove|clear|disable|no)\b.*(underline|strikethrough|decoration|overline)/.test(
			lower
		) ||
		/\bno\s*decoration\b/.test(lower)
	) {
		return 'none';
	}

	if (/underline/.test(lower)) return 'underline';
	if (/strikethrough|strike\s*through|line\s*through/.test(lower))
		return 'line-through';
	if (/overline/.test(lower)) return 'overline';
	if (/\bnone\b/.test(lower)) return 'none';

	return null;
};

const extractTextDirection = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(text\s*direction|direction|rtl|ltr|right\s*to\s*left|left\s*to\s*right)/.test(
			lower
		)
	) {
		return null;
	}
	if (!hasTextContext(message) && !/text/.test(lower)) return null;

	if (/rtl|right\s*to\s*left/.test(lower)) return 'rtl';
	if (/ltr|left\s*to\s*right/.test(lower)) return 'ltr';
	if (/inherit|auto|initial|default/.test(lower)) return 'inherit';

	return null;
};

const extractTextIndent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/indent/.test(lower)) return null;
	if (!hasTextContext(message)) return null;

	if (/(remove|clear|disable|no)\b.*indent/.test(lower)) {
		return { value: 0, unit: 'px' };
	}

	const primaryMatch = message.match(
		/(?:text\s*)?indent(?:ation)?\s*(?:to|=|:|is|by)?\s*(-?\d+(?:\.\d+)?)(px|%|em|rem|ch)?/i
	);
	if (primaryMatch) {
		return {
			value: Number.parseFloat(primaryMatch[1]),
			unit: primaryMatch[2] || 'px',
		};
	}

	const altMatch = message.match(
		/(-?\d+(?:\.\d+)?)(px|%|em|rem|ch)?\s*text\s*indent/i
	);
	if (altMatch) {
		return {
			value: Number.parseFloat(altMatch[1]),
			unit: altMatch[2] || 'px',
		};
	}

	return null;
};

const extractTextOrientation = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(text\s*orientation|orientation|upright|sideways|mixed|vertical)/.test(lower)) {
		return null;
	}
	if (!hasTextContext(message) && !/text/.test(lower)) return null;

	if (/upright|vertical/.test(lower)) return 'upright';
	if (/sideways/.test(lower)) return 'sideways';
	if (/mixed/.test(lower)) return 'mixed';

	return null;
};

const extractTextWrap = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(text\s*wrap|wrap\s*text|nowrap|no\s*wrap|wrap|balance|pretty)/.test(lower)) {
		return null;
	}
	if (!hasTextContext(message) && !/text\s*wrap|wrap\s*text/.test(lower)) {
		return null;
	}

	if (/no\s*wrap|nowrap/.test(lower)) return 'nowrap';
	if (/balance/.test(lower)) return 'balance';
	if (/pretty/.test(lower)) return 'pretty';
	if (/wrap/.test(lower)) return 'wrap';

	return null;
};

const extractWhiteSpace = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(white\s*space|whitespace|pre[-\s]?wrap|pre[-\s]?line|break\s*spaces|preserve\s*whitespace|preformatted)/.test(
			lower
		)
	) {
		return null;
	}
	if (
		!hasTextContext(message) &&
		!/(white\s*space|whitespace|pre[-\s]?wrap|pre[-\s]?line|break\s*spaces|preserve\s*whitespace|preformatted)/.test(
			lower
		)
	) {
		return null;
	}

	if (/break\s*spaces/.test(lower)) return 'break-spaces';
	if (/pre[-\s]?wrap/.test(lower)) return 'pre-wrap';
	if (/pre[-\s]?line/.test(lower)) return 'pre-line';
	if (/preserve\s*whitespace|preformatted|\bpre\b/.test(lower)) return 'pre';
	if (/no\s*wrap|nowrap/.test(lower)) return 'nowrap';
	if (/\bnormal\b/.test(lower)) return 'normal';
	if (/\binherit\b/.test(lower)) return 'inherit';
	if (/\bunset\b|\bdefault\b|\breset\b|\binitial\b/.test(lower)) return 'unset';

	return null;
};

const extractVerticalAlign = message => {
	const lower = String(message || '').toLowerCase();
	const hasVerticalContext = /vertical\s*align|vertical\s*alignment|superscript|subscript/.test(
		lower
	);
	if (
		!(
			hasVerticalContext ||
			/text[-\s]?top|text[-\s]?bottom|\bbaseline\b|\bmiddle\b|\btop\b|\bbottom\b|\bsub\b|\bsuper\b/.test(
				lower
			)
		)
	) {
		return null;
	}
	if (!hasTextContext(message) && !hasVerticalContext) return null;

	if (/superscript|super\s*script/.test(lower)) return 'super';
	if (/subscript|sub\s*script/.test(lower)) return 'sub';
	if (/text[-\s]?top/.test(lower)) return 'text-top';
	if (/text[-\s]?bottom/.test(lower)) return 'text-bottom';
	if (/\bmiddle\b/.test(lower)) return 'middle';
	if (/\bbaseline\b/.test(lower)) return 'baseline';
	if (/\btop\b/.test(lower)) return 'top';
	if (/\bbottom\b/.test(lower)) return 'bottom';
	if (/\bunset\b|\bdefault\b|\breset\b|\binitial\b|\binherit\b/.test(lower))
		return 'baseline';

	return null;
};

const extractWordSpacing = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(word\s*spacing|spacing\s*between\s*words|space\s*between\s*words)/.test(
			lower
		)
	) {
		return null;
	}

	if (
		/(remove|clear|disable|no)\b.*(word\s*spacing|spacing\s*between\s*words|space\s*between\s*words)/.test(
			lower
		)
	) {
		return { value: 0, unit: 'px' };
	}

	const primaryMatch = message.match(
		/(?:word\s*spacing|spacing\s*between\s*words|space\s*between\s*words)\s*(?:to|=|:|is|by)?\s*(-?\d+(?:\.\d+)?)(px|%|em|rem|ch)?/i
	);
	if (primaryMatch) {
		return {
			value: Number.parseFloat(primaryMatch[1]),
			unit: primaryMatch[2] || 'px',
		};
	}

	const altMatch = message.match(
		/(-?\d+(?:\.\d+)?)(px|%|em|rem|ch)?\s*(?:word\s*spacing|spacing\s*between\s*words|space\s*between\s*words)/i
	);
	if (altMatch) {
		return {
			value: Number.parseFloat(altMatch[1]),
			unit: altMatch[2] || 'px',
		};
	}

	return null;
};

const extractTextShadowValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(text\s*shadow|shadow\s*text)/.test(lower)) return null;

	if (/(remove|clear|disable|no)\b.*shadow/.test(lower)) {
		return 'none';
	}

	const numberMatches = Array.from(
		String(message).matchAll(/(-?\d+(?:\.\d+)?)\s*px/gi)
	).map(match => Number.parseFloat(match[1]));
	const [x = 2, y = 4, blur = 6] = numberMatches;

	const hexMatch = String(message).match(HEX_COLOR_REGEX);
	const rgbaMatch = String(message).match(/rgba?\([^)]+\)/i);
	const color = hexMatch ? hexMatch[0] : rgbaMatch ? rgbaMatch[0] : 'rgba(0,0,0,0.35)';

	return `${x}px ${y}px ${blur}px ${color}`;
};

const buildTextStyleGroupAction = (
	message,
	{ scope = 'selection', targetBlock = null } = {}
) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' && targetBlock
			? { target_block: targetBlock }
			: {};
	const lower = String(message || '').toLowerCase();
	const isHover = /\bhover\b/.test(lower);
	const breakpoint = extractBreakpointToken(message);

	const textShadow = extractTextShadowValue(message);
	if (textShadow !== null) {
		return {
			action: actionType,
			property: isHover ? 'text_shadow_hover' : 'text_shadow',
			value: breakpoint ? { value: textShadow, breakpoint } : textShadow,
			message: 'Text shadow updated.',
			...actionTarget,
		};
	}

	const decoration = extractTextDecoration(message);
	if (decoration) {
		return {
			action: actionType,
			property: isHover ? 'text_decoration_hover' : 'text_decoration',
			value: breakpoint ? { value: decoration, breakpoint } : decoration,
			message: 'Text decoration updated.',
			...actionTarget,
		};
	}

	const direction = extractTextDirection(message);
	if (direction) {
		return {
			action: actionType,
			property: isHover ? 'text_direction_hover' : 'text_direction',
			value: breakpoint ? { value: direction, breakpoint } : direction,
			message: 'Text direction updated.',
			...actionTarget,
		};
	}

	const indent = extractTextIndent(message);
	if (indent) {
		const value = breakpoint ? { ...indent, breakpoint } : indent;
		return {
			action: actionType,
			property: isHover ? 'text_indent_hover' : 'text_indent',
			value,
			message: 'Text indent updated.',
			...actionTarget,
		};
	}

	const orientation = extractTextOrientation(message);
	if (orientation) {
		return {
			action: actionType,
			property: isHover ? 'text_orientation_hover' : 'text_orientation',
			value: breakpoint ? { value: orientation, breakpoint } : orientation,
			message: 'Text orientation updated.',
			...actionTarget,
		};
	}

	const whiteSpace = extractWhiteSpace(message);
	if (whiteSpace) {
		return {
			action: actionType,
			property: isHover ? 'text_white_space_hover' : 'text_white_space',
			value: breakpoint ? { value: whiteSpace, breakpoint } : whiteSpace,
			message: 'White space updated.',
			...actionTarget,
		};
	}

	const textWrap = extractTextWrap(message);
	if (textWrap) {
		return {
			action: actionType,
			property: isHover ? 'text_wrap_hover' : 'text_wrap',
			value: breakpoint ? { value: textWrap, breakpoint } : textWrap,
			message: 'Text wrap updated.',
			...actionTarget,
		};
	}

	const verticalAlign = extractVerticalAlign(message);
	if (verticalAlign) {
		return {
			action: actionType,
			property: isHover ? 'text_vertical_align_hover' : 'text_vertical_align',
			value: breakpoint ? { value: verticalAlign, breakpoint } : verticalAlign,
			message: 'Vertical alignment updated.',
			...actionTarget,
		};
	}

	const wordSpacing = extractWordSpacing(message);
	if (wordSpacing) {
		const value = breakpoint ? { ...wordSpacing, breakpoint } : wordSpacing;
		return {
			action: actionType,
			property: isHover ? 'text_word_spacing_hover' : 'text_word_spacing',
			value,
			message: 'Word spacing updated.',
			...actionTarget,
		};
	}

	return null;
};

const normalizeKeywordValue = rawValue => {
	if (rawValue === null || rawValue === undefined) return null;
	if (typeof rawValue === 'string') return rawValue.toLowerCase();
	return rawValue;
};

const buildTextStyleGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	const isHover = normalized.endsWith('_hover');
	const base = isHover ? normalized.replace(/_hover$/, '') : normalized;
	const { value: rawValue, unit, breakpoint } = normalizeValueWithUnit(value);

	switch (base) {
		case 'text_decoration': {
			const nextValue = normalizeKeywordValue(rawValue);
			return buildResponsiveValueChanges('text-decoration', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_direction': {
			const nextValue = normalizeKeywordValue(rawValue);
			return buildResponsiveValueChanges('text-direction', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_indent': {
			const normalizedValue =
				typeof rawValue === 'string' &&
				/(none|off|reset|remove)/i.test(rawValue)
					? { value: 0, unit: unit || 'px' }
					: rawValue;
			const parsed = parseUnitValue(
				normalizedValue,
				unit || 'px'
			);
			return buildResponsiveUnitChanges(
				'text-indent',
				'text-indent-unit',
				parsed.value,
				parsed.unit,
				{
					breakpoint,
					isHover,
				}
			);
		}
		case 'text_orientation': {
			const nextValue = normalizeKeywordValue(rawValue);
			return buildResponsiveValueChanges('text-orientation', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_shadow': {
			const nextValue = rawValue;
			return buildResponsiveValueChanges('text-shadow', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_wrap': {
			const nextValue = normalizeKeywordValue(rawValue);
			return buildResponsiveValueChanges('text-wrap', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_white_space': {
			const nextValue = normalizeKeywordValue(rawValue);
			return buildResponsiveValueChanges('white-space', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_vertical_align': {
			const nextValue = normalizeKeywordValue(rawValue);
			return buildResponsiveValueChanges('vertical-align', nextValue, {
				breakpoint,
				isHover,
			});
		}
		case 'text_word_spacing': {
			const parsed = parseUnitValue(rawValue, unit || 'px');
			return buildResponsiveUnitChanges(
				'word-spacing',
				'word-spacing-unit',
				parsed.value,
				parsed.unit,
				{
					breakpoint,
					isHover,
				}
			);
		}
		default:
			return null;
	}
};

const TEXT_STYLE_PROPERTIES = new Set([
	'text_decoration',
	'text_decoration_hover',
	'text_direction',
	'text_direction_hover',
	'text_indent',
	'text_indent_hover',
	'text_orientation',
	'text_orientation_hover',
	'text_shadow',
	'text_shadow_hover',
	'text_wrap',
	'text_wrap_hover',
	'text_white_space',
	'text_white_space_hover',
	'text_vertical_align',
	'text_vertical_align_hover',
	'text_word_spacing',
	'text_word_spacing_hover',
]);

const getTextStyleGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (TEXT_STYLE_PROPERTIES.has(normalized)) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	return null;
};

export {
	buildTextStyleGroupAction,
	buildTextStyleGroupAttributeChanges,
	getTextStyleGroupSidebarTarget,
};
