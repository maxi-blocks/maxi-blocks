/**
 * Accordion Logic Handler for AI Chat Panel
 * Handles accordion-specific settings and styling.
 */

const ACCORDION_PROPERTY_ALIASES = {
	accordionLayout: 'accordion_layout',
	autoPaneClose: 'accordion_auto_close',
	autoPaneClosed: 'accordion_auto_close',
	autoClose: 'accordion_auto_close',
	auto_close: 'accordion_auto_close',
	isCollapsible: 'accordion_collapsible',
	collapsible: 'accordion_collapsible',
	animationDuration: 'accordion_animation_duration',
	titleLevel: 'accordion_title_level',
	title_level: 'accordion_title_level',
	iconPosition: 'accordion_icon_position',
	icon_position: 'accordion_icon_position',
	iconSize: 'accordion_icon_size',
	icon_size: 'accordion_icon_size',
	iconWidth: 'accordion_icon_width',
	icon_width: 'accordion_icon_width',
	iconHeight: 'accordion_icon_height',
	icon_height: 'accordion_icon_height',
	iconColor: 'accordion_icon_color',
	icon_color: 'accordion_icon_color',
	iconFillColor: 'accordion_icon_fill_color',
	icon_fill_color: 'accordion_icon_fill_color',
	iconStrokeColor: 'accordion_icon_stroke_color',
	icon_stroke_color: 'accordion_icon_stroke_color',
	activeIconColor: 'accordion_active_icon_color',
	active_icon_color: 'accordion_active_icon_color',
	activeIconFillColor: 'accordion_active_icon_fill_color',
	active_icon_fill_color: 'accordion_active_icon_fill_color',
	activeIconStrokeColor: 'accordion_active_icon_stroke_color',
	active_icon_stroke_color: 'accordion_active_icon_stroke_color',
	activeIconSize: 'accordion_active_icon_size',
	active_icon_size: 'accordion_active_icon_size',
	activeIconWidth: 'accordion_active_icon_width',
	active_icon_width: 'accordion_active_icon_width',
	activeIconHeight: 'accordion_active_icon_height',
	active_icon_height: 'accordion_active_icon_height',
	titleColor: 'accordion_title_color',
	activeTitleColor: 'accordion_active_title_color',
	lineColor: 'accordion_line_color',
	headerLineColor: 'accordion_header_line_color',
	contentLineColor: 'accordion_content_line_color',
};

const normalizeAccordionProperty = property => {
	if (!property) return '';
	const normalized = String(property).replace(/-/g, '_');
	return (
		ACCORDION_PROPERTY_ALIASES[normalized] ||
		ACCORDION_PROPERTY_ALIASES[property] ||
		normalized
	);
};

const normalizeBoolean = value => {
	if (typeof value === 'boolean') return value;
	if (value === null || value === undefined) return null;
	const normalized = String(value).trim().toLowerCase();
	if (['true', 'yes', 'on', '1', 'enable', 'enabled'].includes(normalized)) {
		return true;
	}
	if (['false', 'no', 'off', '0', 'disable', 'disabled'].includes(normalized)) {
		return false;
	}
	return Boolean(value);
};

const normalizeHeadingLevel = value => {
	if (value === null || value === undefined) return null;
	const normalized = String(value).trim().toLowerCase();
	if (/^h[1-6]$/.test(normalized)) return normalized;
	const match = normalized.match(/(?:heading|h)\s*([1-6])/);
	if (match) return `h${match[1]}`;
	return null;
};

const normalizeIconPosition = value => {
	const normalized = String(value || '').trim().toLowerCase();
	if (['left', 'right', 'top', 'bottom'].includes(normalized)) return normalized;
	if (['start', 'before'].includes(normalized)) return 'left';
	if (['end', 'after'].includes(normalized)) return 'right';
	return null;
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue && typeof rawValue === 'object' && rawValue.value !== undefined) {
		return {
			value: rawValue.value,
			unit: rawValue.unit || fallbackUnit,
		};
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	const normalized = String(rawValue ?? '').trim();
	if (!normalized) return { value: '', unit: fallbackUnit };

	const match = normalized.match(/^(-?\d+(?:\.\d+)?)([a-z%]*)$/i);
	if (match) {
		return {
			value: Number(match[1]),
			unit: match[2] || fallbackUnit,
		};
	}

	const parsed = Number.parseFloat(normalized);
	return { value: Number.isNaN(parsed) ? '' : parsed, unit: fallbackUnit };
};

const parseDurationSeconds = rawValue => {
	if (rawValue === null || rawValue === undefined || rawValue === '') return null;
	if (typeof rawValue === 'number') return rawValue;
	if (typeof rawValue === 'object' && rawValue.value !== undefined) {
		const unit = String(rawValue.unit || '').toLowerCase();
		if (unit === 'ms') return Number(rawValue.value) / 1000;
		return Number(rawValue.value);
	}

	const normalized = String(rawValue).trim().toLowerCase();
	const match = normalized.match(/^(-?\d+(?:\.\d+)?)(ms|s)?$/);
	if (!match) return null;
	let value = Number.parseFloat(match[1]);
	if (Number.isNaN(value)) return null;
	if (match[2] === 'ms') value /= 1000;
	return value;
};

const normalizeColorValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.color !== undefined) return rawValue.color;
		if (rawValue.palette !== undefined) return rawValue.palette;
		if (rawValue.value !== undefined) return rawValue.value;
	}
	return rawValue;
};

const buildPaletteColorChanges = (prefix, rawValue) => {
	const colorValue = normalizeColorValue(rawValue);
	if (colorValue === null || colorValue === undefined || colorValue === '') return null;
	const isPalette = typeof colorValue === 'number';
	const keyPrefix = prefix.endsWith('-') ? prefix : `${prefix}-`;
	return {
		[`${keyPrefix}palette-status-general`]: isPalette,
		[`${keyPrefix}palette-color-general`]: isPalette ? colorValue : '',
		[`${keyPrefix}color-general`]: isPalette ? '' : colorValue,
	};
};

const normalizeIconColorTarget = (rawValue, fallbackTarget) => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		rawValue.target
	) {
		const target = String(rawValue.target).toLowerCase();
		if (target === 'stroke' || target === 'fill') return target;
	}
	return fallbackTarget;
};

const normalizeOpacityValue = rawValue => {
	if (rawValue === null || rawValue === undefined) return null;
	const num = Number(rawValue);
	if (!Number.isFinite(num)) return null;
	if (num > 1) return Math.min(Math.max(num / 100, 0), 1);
	return Math.min(Math.max(num, 0), 1);
};

const buildIconColorChanges = (prefix, rawValue, { defaultTarget = 'stroke' } = {}) => {
	const colorValue = normalizeColorValue(rawValue);
	if (colorValue === null || colorValue === undefined || colorValue === '') return null;
	const target = normalizeIconColorTarget(rawValue, defaultTarget);
	const isPalette = typeof colorValue === 'number';
	const keyPrefix = `${prefix}icon-${target}-`;
	const changes = {
		[`${keyPrefix}palette-status`]: isPalette,
		[`${keyPrefix}palette-color`]: isPalette ? colorValue : '',
		[`${keyPrefix}color`]: isPalette ? '' : colorValue,
		[`${prefix}icon-inherit`]: false,
	};

	if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
		const opacity = normalizeOpacityValue(
			rawValue.opacity ?? rawValue.paletteOpacity
		);
		if (isPalette && opacity !== null) {
			changes[`${keyPrefix}palette-opacity`] = opacity;
		}
		if (rawValue.scStatus !== undefined || rawValue.paletteScStatus !== undefined) {
			changes[`${keyPrefix}palette-sc-status`] = Boolean(
				rawValue.scStatus ?? rawValue.paletteScStatus
			);
		}
	}

	return changes;
};

const buildIconSizeChanges = (prefix, rawValue, type = 'size') => {
	const parsed = parseUnitValue(rawValue, 'px');
	if (parsed.value === '' || parsed.value === null || parsed.value === undefined) {
		return null;
	}
	const valueString = String(parsed.value);
	const changes = {};

	if (type === 'size' || type === 'width') {
		changes[`${prefix}icon-width-general`] = valueString;
		changes[`${prefix}icon-width-unit-general`] = parsed.unit;
		changes[`${prefix}icon-width-fit-content-general`] = false;
	}
	if (type === 'size' || type === 'height') {
		changes[`${prefix}icon-height-general`] = valueString;
		changes[`${prefix}icon-height-unit-general`] = parsed.unit;
	}

	return changes;
};

const buildLineColorChanges = (colorValue, target = 'both') => {
	const buildForPrefix = prefix =>
		buildPaletteColorChanges(`${prefix}divider-border-`, colorValue);

	if (target === 'header') return buildForPrefix('header-');
	if (target === 'content') return buildForPrefix('content-');

	const headerChanges = buildForPrefix('header-');
	const contentChanges = buildForPrefix('content-');
	if (!headerChanges && !contentChanges) return null;
	return { ...headerChanges, ...contentChanges };
};

export const ACCORDION_PATTERNS = [
	{
		regex: /\baccordion\b.*\b(non[-\s]?collapsible|not\s*collapsible|disable\s*collaps(?:e|ible)|lock\s*open|always\s*open)\b|\b(non[-\s]?collapsible|not\s*collapsible|disable\s*collaps(?:e|ible)|lock\s*open|always\s*open)\b.*\baccordion\b/i,
		property: 'accordion_collapsible',
		value: false,
		selectionMsg: 'Accordion panes stay open.',
		pageMsg: 'Accordion panes stay open.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(collapsible|collapse|toggle)\b|\b(collapsible|collapse|toggle)\b.*\baccordion\b/i,
		property: 'accordion_collapsible',
		value: true,
		selectionMsg: 'Accordion panes are collapsible.',
		pageMsg: 'Accordion panes are collapsible.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(multiple|several)\b.*\bopen\b|\ballow\b.*\bmultiple\b.*\bpanes?\b|\bdisable\b.*\bauto\s*close\b|\bauto\s*close\b.*\b(off|disable|false)\b/i,
		property: 'accordion_auto_close',
		value: false,
		selectionMsg: 'Multiple panes can stay open.',
		pageMsg: 'Multiple panes can stay open.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(one|single)\b.*\b(open|pane)\b|\bone\b.*\bopen\b.*\baccordion\b|\bauto\s*close\b|\bclose\s*other\s*(panes|panels)\b/i,
		property: 'accordion_auto_close',
		value: true,
		selectionMsg: 'Only one pane stays open.',
		pageMsg: 'Only one pane stays open.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\bboxed\b|\bboxed\b.*\baccordion\b/i,
		property: 'accordion_layout',
		value: 'boxed',
		selectionMsg: 'Switched to boxed layout.',
		pageMsg: 'Switched to boxed layout.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(simple|minimal|plain)\b|\b(simple|minimal|plain)\b.*\baccordion\b/i,
		property: 'accordion_layout',
		value: 'simple',
		selectionMsg: 'Switched to simple layout.',
		pageMsg: 'Switched to simple layout.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(fast|faster|quick|snappy)\b.*\b(animation|transition|speed)\b|\b(animation|transition|speed)\b.*\b(fast|faster|quick|snappy)\b.*\baccordion\b/i,
		property: 'accordion_animation_duration',
		value: 0.2,
		selectionMsg: 'Sped up the accordion animation.',
		pageMsg: 'Sped up the accordion animation.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(slow|slower|smooth)\b.*\b(animation|transition|speed)\b|\b(animation|transition|speed)\b.*\b(slow|slower|smooth)\b.*\baccordion\b/i,
		property: 'accordion_animation_duration',
		value: 0.6,
		selectionMsg: 'Slowed down the accordion animation.',
		pageMsg: 'Slowed down the accordion animation.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(title|heading)\b.*\b(h1|heading\s*1)\b|\b(h1|heading\s*1)\b.*\baccordion\b.*\b(title|heading)\b/i,
		property: 'accordion_title_level',
		value: 'h1',
		selectionMsg: 'Accordion title set to H1.',
		pageMsg: 'Accordion title set to H1.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(title|heading)\b.*\b(h2|heading\s*2)\b|\b(h2|heading\s*2)\b.*\baccordion\b.*\b(title|heading)\b/i,
		property: 'accordion_title_level',
		value: 'h2',
		selectionMsg: 'Accordion title set to H2.',
		pageMsg: 'Accordion title set to H2.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(title|heading)\b.*\b(h3|heading\s*3)\b|\b(h3|heading\s*3)\b.*\baccordion\b.*\b(title|heading)\b/i,
		property: 'accordion_title_level',
		value: 'h3',
		selectionMsg: 'Accordion title set to H3.',
		pageMsg: 'Accordion title set to H3.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(title|heading)\b.*\b(h4|heading\s*4)\b|\b(h4|heading\s*4)\b.*\baccordion\b.*\b(title|heading)\b/i,
		property: 'accordion_title_level',
		value: 'h4',
		selectionMsg: 'Accordion title set to H4.',
		pageMsg: 'Accordion title set to H4.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(title|heading)\b.*\b(h5|heading\s*5)\b|\b(h5|heading\s*5)\b.*\baccordion\b.*\b(title|heading)\b/i,
		property: 'accordion_title_level',
		value: 'h5',
		selectionMsg: 'Accordion title set to H5.',
		pageMsg: 'Accordion title set to H5.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(title|heading)\b.*\b(h6|heading\s*6)\b|\b(h6|heading\s*6)\b.*\baccordion\b.*\b(title|heading)\b/i,
		property: 'accordion_title_level',
		value: 'h6',
		selectionMsg: 'Accordion title set to H6.',
		pageMsg: 'Accordion title set to H6.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\bicon\b.*\bleft\b|\bicon\b.*\bleft\b.*\baccordion\b/i,
		property: 'accordion_icon_position',
		value: 'left',
		selectionMsg: 'Moved accordion icon to the left.',
		pageMsg: 'Moved accordion icons to the left.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\bicon\b.*\bright\b|\bicon\b.*\bright\b.*\baccordion\b/i,
		property: 'accordion_icon_position',
		value: 'right',
		selectionMsg: 'Moved accordion icon to the right.',
		pageMsg: 'Moved accordion icons to the right.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\bicon\b.*\btop\b|\bicon\b.*\btop\b.*\baccordion\b/i,
		property: 'accordion_icon_position',
		value: 'top',
		selectionMsg: 'Moved accordion icon to the top.',
		pageMsg: 'Moved accordion icons to the top.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\bicon\b.*\bbottom\b|\bicon\b.*\bbottom\b.*\baccordion\b/i,
		property: 'accordion_icon_position',
		value: 'bottom',
		selectionMsg: 'Moved accordion icon to the bottom.',
		pageMsg: 'Moved accordion icons to the bottom.',
		target: 'accordion',
	},
	{
		regex: /\baccordion\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\baccordion\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the accordion background?',
		pageMsg: 'Which colour for the accordion background?',
		target: 'accordion',
		colorTarget: 'accordion',
	},
];

export const getAccordionSidebarTarget = property => {
	if (!property) return null;
	const normalized = normalizeAccordionProperty(property);

	if (
		[
			'accordion_layout',
			'accordion_collapsible',
			'accordion_auto_close',
			'accordion_animation_duration',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'accordion settings' };
	}

	if (
		[
			'accordion_title_level',
			'accordion_title_color',
			'accordion_active_title_color',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'title' };
	}

	if (
		[
			'accordion_icon_position',
			'accordion_icon_size',
			'accordion_icon_width',
			'accordion_icon_height',
			'accordion_icon_color',
			'accordion_icon_fill_color',
			'accordion_icon_stroke_color',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'icon' };
	}

	if (
		[
			'accordion_active_icon_color',
			'accordion_active_icon_fill_color',
			'accordion_active_icon_stroke_color',
			'accordion_active_icon_size',
			'accordion_active_icon_width',
			'accordion_active_icon_height',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'active icon' };
	}

	if (
		[
			'accordion_line_color',
			'accordion_header_line_color',
			'accordion_content_line_color',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'line settings' };
	}

	return null;
};

export const handleAccordionUpdate = (block, property, value, prefix, context = {}) => {
	const isAccordion = block?.name?.includes('accordion');
	if (!isAccordion) return null;

	const normalizedProperty = normalizeAccordionProperty(property);

	switch (normalizedProperty) {
		case 'accordion_layout': {
			const layout = String(value || '').trim().toLowerCase();
			if (!layout) return null;
			const nextLayout = layout === 'boxed' ? 'boxed' : 'simple';
			return { accordionLayout: nextLayout };
		}
		case 'accordion_collapsible': {
			const enabled = normalizeBoolean(value);
			if (enabled === null) return null;
			return { isCollapsible: enabled };
		}
		case 'accordion_auto_close': {
			const enabled = normalizeBoolean(value);
			if (enabled === null) return null;
			return { autoPaneClose: enabled };
		}
		case 'accordion_animation_duration': {
			const duration = parseDurationSeconds(value);
			if (duration === null) return null;
			return { animationDuration: duration };
		}
		case 'accordion_title_level': {
			const level = normalizeHeadingLevel(value);
			if (!level) return null;
			return { titleLevel: level };
		}
		case 'accordion_title_color': {
			return buildPaletteColorChanges('title-', value);
		}
		case 'accordion_active_title_color': {
			const changes = buildPaletteColorChanges('active-title-', value);
			if (!changes) return null;
			return {
				...changes,
				'title-typography-status-active': true,
			};
		}
		case 'accordion_icon_position': {
			const position = normalizeIconPosition(value);
			if (!position) return null;
			return { 'icon-position': position };
		}
		case 'accordion_icon_size':
			return buildIconSizeChanges('', value, 'size');
		case 'accordion_icon_width':
			return buildIconSizeChanges('', value, 'width');
		case 'accordion_icon_height':
			return buildIconSizeChanges('', value, 'height');
		case 'accordion_active_icon_size':
			return buildIconSizeChanges('active-', value, 'size');
		case 'accordion_active_icon_width':
			return buildIconSizeChanges('active-', value, 'width');
		case 'accordion_active_icon_height':
			return buildIconSizeChanges('active-', value, 'height');
		case 'accordion_icon_color':
			return buildIconColorChanges('', value, { defaultTarget: 'stroke' });
		case 'accordion_icon_fill_color':
			return buildIconColorChanges('', value, { defaultTarget: 'fill' });
		case 'accordion_icon_stroke_color':
			return buildIconColorChanges('', value, { defaultTarget: 'stroke' });
		case 'accordion_active_icon_color':
			return buildIconColorChanges('active-', value, { defaultTarget: 'stroke' });
		case 'accordion_active_icon_fill_color':
			return buildIconColorChanges('active-', value, { defaultTarget: 'fill' });
		case 'accordion_active_icon_stroke_color':
			return buildIconColorChanges('active-', value, { defaultTarget: 'stroke' });
		case 'accordion_line_color':
			return buildLineColorChanges(value, 'both');
		case 'accordion_header_line_color':
			return buildLineColorChanges(value, 'header');
		case 'accordion_content_line_color':
			return buildLineColorChanges(value, 'content');
		default:
			return null;
	}
};
