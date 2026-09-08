/**
 * Number Counter Logic Handler for AI Chat Panel
 * Focused on number counter specific settings + flows.
 */

export const NUMBER_COUNTER_PATTERNS = [
	{
		regex: /\b(number\s*counter|counter)\b.*\b(background|bg)\b|\b(background|bg)\b.*\b(number\s*counter|counter)\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the counter background?',
		pageMsg: 'Which colour for the counter background?',
		target: 'number-counter',
		colorTarget: 'number-counter-circle-background',
	},
	{
		regex: /\b(number\s*counter|counter)\b.*\b(from)\b.*\b(to)\b|\bfrom\b.*\bto\b.*\b(number\s*counter|counter)\b/i,
		property: 'number_counter_range',
		value: 'use_prompt',
		selectionMsg: 'Updated counter range.',
		pageMsg: 'Updated counter ranges.',
		target: 'number-counter',
	},
	{
		regex: /\b(start\s*number|start\s*value|starting\s*number)\b.*\d|\bnumber\s*counter\b.*\bfrom\b.*\d/i,
		property: 'number_counter_start',
		value: 'use_prompt',
		selectionMsg: 'Updated start number.',
		pageMsg: 'Updated start numbers.',
		target: 'number-counter',
	},
	{
		regex: /\b(end\s*number|end\s*value|ending\s*number)\b.*\d|\bnumber\s*counter\b.*\bto\b.*\d/i,
		property: 'number_counter_end',
		value: 'use_prompt',
		selectionMsg: 'Updated end number.',
		pageMsg: 'Updated end numbers.',
		target: 'number-counter',
	},
	{
		regex: /\b(duration|animation\s*duration|count\s*duration)\b.*\d|\b(over|in)\b.*\d+(\.\d+)?\s*(s|sec|secs|second|seconds)\b/i,
		property: 'number_counter_duration',
		value: 'use_prompt',
		selectionMsg: 'Updated counter duration.',
		pageMsg: 'Updated counter duration.',
		target: 'number-counter',
	},
	{
		regex: /\b(stroke|thickness|line\s*width)\b.*\b(counter|circle)\b.*\d|\b(counter|circle)\b.*\b(stroke|thickness|line\s*width)\b.*\d/i,
		property: 'number_counter_stroke',
		value: 'use_prompt',
		selectionMsg: 'Updated counter stroke.',
		pageMsg: 'Updated counter stroke.',
		target: 'number-counter',
	},
	{
		regex: /\b(enable|show|turn\s*on)\b.*\bpreview\b/i,
		property: 'number_counter_preview',
		value: true,
		selectionMsg: 'Preview enabled.',
		pageMsg: 'Preview enabled.',
		target: 'number-counter',
	},
	{
		regex: /\b(disable|hide|turn\s*off)\b.*\bpreview\b|\bpreview\b.*\b(off|disabled)\b/i,
		property: 'number_counter_preview',
		value: false,
		selectionMsg: 'Preview disabled.',
		pageMsg: 'Preview disabled.',
		target: 'number-counter',
	},
	{
		regex: /\b(enable|show|add)\b.*\b(percent|percentage)\b|\b(percent|percentage)\b.*\b(on|enabled)\b/i,
		property: 'number_counter_percentage_sign',
		value: true,
		selectionMsg: 'Percentage sign enabled.',
		pageMsg: 'Percentage sign enabled.',
		target: 'number-counter',
	},
	{
		regex: /\b(disable|hide|remove)\b.*\b(percent|percentage)\b|\b(percent|percentage)\b.*\b(off|disabled)\b/i,
		property: 'number_counter_percentage_sign',
		value: false,
		selectionMsg: 'Percentage sign disabled.',
		pageMsg: 'Percentage sign disabled.',
		target: 'number-counter',
	},
	{
		regex: /\b(start\s*animation)\b.*\b(on\s*scroll|scroll)\b|\b(view\s*on\s*scroll)\b/i,
		property: 'number_counter_start_animation',
		value: 'view-scroll',
		selectionMsg: 'Start animation set to view on scroll.',
		pageMsg: 'Start animation set to view on scroll.',
		target: 'number-counter',
	},
	{
		regex: /\b(start\s*animation)\b.*\b(page\s*load|load)\b|\b(on\s*load)\b/i,
		property: 'number_counter_start_animation',
		value: 'page-load',
		selectionMsg: 'Start animation set to page load.',
		pageMsg: 'Start animation set to page load.',
		target: 'number-counter',
	},
	{
		regex: /\b(offset)\b.*\b(number\s*counter|counter)\b.*\d|\b(number\s*counter|counter)\b.*\boffset\b.*\d/i,
		property: 'number_counter_start_offset',
		value: 'use_prompt',
		selectionMsg: 'Updated counter scroll offset.',
		pageMsg: 'Updated counter scroll offset.',
		target: 'number-counter',
	},
	{
		regex: /\b(counter|number\s*counter)\b.*\b(text|number)\b.*\b(colou?r|color)\b|\b(colou?r|color)\b.*\b(counter|number\s*counter)\b.*\b(text|number)\b/i,
		property: 'number_counter_text_color',
		value: 'use_prompt',
		selectionMsg: 'Updated counter text colour.',
		pageMsg: 'Updated counter text colour.',
		target: 'number-counter',
	},
	{
		regex: /\b(title)\b.*\b(font\s*)?size\b.*\d|\b(counter)\b.*\btitle\b.*\bsize\b.*\d/i,
		property: 'number_counter_title_font_size',
		value: 'use_prompt',
		selectionMsg: 'Updated counter title font size.',
		pageMsg: 'Updated counter title font size.',
		target: 'number-counter',
	},
];

export const handleNumberCounterUpdate = (block, property, value, prefix, context = {}) => {
	const isCounter = block?.name?.includes('number-counter');
	if (!isCounter) return null;

	const normalized = String(property || '').replace(/-/g, '_');

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

	const asNumber = raw => {
		const numeric = typeof raw === 'number' ? raw : Number(raw);
		return Number.isFinite(numeric) ? numeric : null;
	};

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

	if (normalized === 'number_counter_range') {
		const startRaw = value?.start ?? value?.from ?? value?.min;
		const endRaw = value?.end ?? value?.to ?? value?.max;
		const start = asNumber(startRaw);
		const end = asNumber(endRaw);
		if (start === null || end === null) return null;
		return { 'number-counter-start': start, 'number-counter-end': end };
	}

	if (normalized === 'number_counter_start') {
		const start = asNumber(value);
		if (start === null) return null;
		return { 'number-counter-start': start };
	}

	if (normalized === 'number_counter_end') {
		const end = asNumber(value);
		if (end === null) return null;
		return { 'number-counter-end': end };
	}

	if (normalized === 'number_counter_duration') {
		const duration = asNumber(value);
		if (duration === null) return null;
		return { 'number-counter-duration': duration };
	}

	if (normalized === 'number_counter_stroke') {
		const stroke = asNumber(value);
		if (stroke === null) return null;
		return { 'number-counter-stroke': stroke };
	}

	if (normalized === 'number_counter_preview') {
		return { 'number-counter-preview': Boolean(value) };
	}

	if (normalized === 'number_counter_percentage_sign') {
		return { 'number-counter-percentage-sign-status': Boolean(value) };
	}

	if (normalized === 'number_counter_start_animation') {
		const lower = String(value || '').toLowerCase();
		const mode = lower.includes('scroll') ? 'view-scroll' : 'page-load';
		return { 'number-counter-start-animation': mode };
	}

	if (normalized === 'number_counter_start_offset') {
		const offset = asNumber(value);
		if (offset === null) return null;
		return { 'number-counter-start-animation-offset': clamp(offset, 50, 100) };
	}

	if (normalized === 'number_counter_text_color') {
		const isPalette = typeof value === 'number';
		return {
			'number-counter-text-palette-status-general': isPalette,
			'number-counter-text-palette-color-general': isPalette ? value : '',
			'number-counter-text-color-general': isPalette ? '' : String(value || ''),
		};
	}

	if (normalized === 'number_counter_circle_background_color') {
		const isPalette = typeof value === 'number';
		return {
			'number-counter-circle-background-palette-status': isPalette,
			'number-counter-circle-background-palette-sc-status': isPalette,
			'number-counter-circle-background-palette-color': isPalette ? value : '',
			'number-counter-circle-background-color': isPalette ? '' : String(value || ''),
		};
	}

	if (normalized === 'number_counter_title_font_size') {
		const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
		const size = asNumber(rawValue);
		if (size === null) return null;
		const key = `number-counter-title-font-size-${breakpoint || 'general'}`;
		return { [key]: size };
	}

	return null;
};

export const getNumberCounterSidebarTarget = property => {
	const normalized = String(property || '').replace(/-/g, '_');
	if (!normalized) return null;

	const numberProps = new Set([
		'number_counter_range',
		'number_counter_start',
		'number_counter_end',
		'number_counter_duration',
		'number_counter_stroke',
		'number_counter_preview',
		'number_counter_percentage_sign',
		'number_counter_start_animation',
		'number_counter_start_offset',
		'number_counter_text_color',
		'number_counter_circle_background_color',
		'number_counter_title_font_size',
		'width',
		'height',
		'width_fit_content',
		'height_fit_content',
	]);

	if (numberProps.has(normalized)) {
		return { tabIndex: 0, accordion: 'number' };
	}

	const borderProps = new Set(['border', 'border_radius', 'border_hover', 'border_radius_hover']);
	if (borderProps.has(normalized)) {
		return { tabIndex: 0, accordion: 'border' };
	}

	const boxShadowProps = new Set(['box_shadow', 'box_shadow_hover', 'hover_glow']);
	if (boxShadowProps.has(normalized)) {
		return { tabIndex: 0, accordion: 'box shadow' };
	}

	const spacingProps = new Set([
		'padding',
		'padding_top',
		'padding_bottom',
		'padding_left',
		'padding_right',
		'margin',
		'margin_top',
		'margin_bottom',
		'margin_left',
		'margin_right',
	]);
	if (spacingProps.has(normalized)) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	const backgroundProps = new Set([
		'background_color',
		'background_palette_color',
		'background_palette_status',
		'background_palette_opacity',
		'background',
		'background_layers',
		'background_layers_hover',
		'block_background_status_hover',
	]);
	if (backgroundProps.has(normalized)) {
		return { tabIndex: 1, accordion: 'background / layer' };
	}

	return null;
};
