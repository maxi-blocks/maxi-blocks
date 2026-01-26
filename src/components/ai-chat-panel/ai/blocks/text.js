/**
 * Text Logic Handler for AI Chat Panel
 * Maps natural language to Text Maxi attributes.
 */

import { parseBorderStyle } from './utils';

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.size ?? rawValue.value ?? rawValue.width ?? rawValue.height;
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
	return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
};

const combineCss = (baseCss, nextCss) => {
	const normalizedNext = normalizeCss(nextCss);
	if (!normalizedNext) return baseCss || '';
	const normalizedBase = normalizeCss(baseCss);
	return normalizedBase ? `${normalizedBase}\n${normalizedNext}` : normalizedNext;
};

const mergeCustomCss = (attributes, category, index, css) => {
	const existing = attributes?.['custom-css-general'];
	const next = existing ? { ...existing } : {};
	const categoryObj = next[category] ? { ...next[category] } : {};
	const currentCss = categoryObj[index];

	if (css) {
		categoryObj[index] = combineCss(currentCss, css);
		next[category] = categoryObj;
	} else {
		delete categoryObj[index];
		if (Object.keys(categoryObj).length) next[category] = categoryObj;
		else delete next[category];
	}

	return { 'custom-css-general': next };
};

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

const buildFontWeightChanges = weightValue => {
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

	return { 'font-weight-general': String(weight) };
};

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

const buildTextHighlightChanges = (attributes, highlightStyle) => {
	const style = String(highlightStyle || '').toLowerCase();
	const styleMap = {
		marker: 'background: linear-gradient(to top, #fffa00 50%, transparent 50%); border-bottom: none;',
		underline: 'border-bottom: 3px solid var(--highlight); background: none; padding: 0; border-radius: 0;',
		badge: 'background: var(--highlight); color: #ffffff; padding: 4px 8px; border-radius: 4px; display: inline-block; border-bottom: none;',
	};

	const css = styleMap[style];
	if (!css) return null;

	return mergeCustomCss(attributes, 'text', 'normal', css);
};

const buildTextListChanges = listValue => {
	if (listValue === 'off') {
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

const buildTextLevelChanges = levelValue => ({
	textLevel: String(levelValue || 'p'),
	isList: false,
});

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

const buildTextLinkChanges = (block, linkValue) => {
	const url =
		typeof linkValue === 'object' && linkValue
			? linkValue.url
			: linkValue;

	if (!url) return null;

	const target =
		typeof linkValue === 'object' && linkValue?.target
			? linkValue.target
			: '_self';

	return {
		linkSettings: {
			...(block.attributes?.linkSettings || {}),
			url: String(url),
			opensInNewTab: target === '_blank',
		},
	};
};

export const TEXT_PATTERNS = [
	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Clarifications)
	// ============================================================
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
		value: '#ffffff',
		selectionMsg: 'Inverted text color.',
		pageMsg: 'Inverted text color.',
		target: 'text',
	},
	{ regex: /\bh1\b|heading\s*1|title\s*1/i, property: 'text_level', value: 'h1', selectionMsg: 'Set to H1.', pageMsg: 'Set to H1.', target: 'text' },
	{ regex: /\bh2\b|heading\s*2|title\s*2|subheading/i, property: 'text_level', value: 'h2', selectionMsg: 'Set to H2.', pageMsg: 'Set to H2.', target: 'text' },
	{ regex: /\bparagraph\b|body\s*text\b/i, property: 'text_level', value: 'p', selectionMsg: 'Set to paragraph.', pageMsg: 'Set to paragraph.', target: 'text' },
	{ regex: /\b(post\s*title|dynamic\s*title)\b/i, property: 'text_dynamic', value: 'title', selectionMsg: 'Dynamic title enabled.', pageMsg: 'Dynamic title enabled.', target: 'text' },
	{ regex: /\b(post\s*date|publish(ed)?\s*date|dynamic\s*date)\b/i, property: 'text_dynamic', value: 'date', selectionMsg: 'Dynamic date enabled.', pageMsg: 'Dynamic date enabled.', target: 'text' },
	{ regex: /\b(author\s*name|post\s*author|dynamic\s*author)\b/i, property: 'text_dynamic', value: 'author', selectionMsg: 'Dynamic author enabled.', pageMsg: 'Dynamic author enabled.', target: 'text' },
	{ regex: /\b(remove|disable)\b.*\bdynamic\b/i, property: 'text_dynamic', value: 'off', selectionMsg: 'Dynamic content removed.', pageMsg: 'Dynamic content removed.', target: 'text' },
];

export const handleTextUpdate = (block, property, value, prefix, context = {}) => {
	let changes = null;
	const isText =
		block?.name?.includes('text') || block?.name?.includes('heading');
	if (!isText) return null;

	// === INTERACTION FLOWS ===
	if (property === 'flow_text_size') {
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
		changes = {
			'font-size-general': sizeValue.value,
			'font-size-unit-general': sizeValue.unit,
		};
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text size.' };
	}

	if (property === 'flow_text_weight') {
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

	if (property === 'flow_text_color') {
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

		changes = buildTextColorChanges(context.text_color);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text color.' };
	}

	if (property === 'flow_border') {
		if (!context.border_color) {
			return { action: 'ask_palette', target: 'border_color', msg: 'Which colour for the border?' };
		}
		if (!context.border_style) {
			return {
				action: 'ask_options',
				target: 'border_style',
				msg: 'Which border style?',
				options: [
					{ label: 'Solid Thin', value: 'solid-1px' },
					{ label: 'Solid Medium', value: 'solid-2px' },
					{ label: 'Solid Thick', value: 'solid-4px' },
					{ label: 'Dashed', value: 'dashed-2px' },
					{ label: 'Dotted', value: 'dotted-2px' },
				],
			};
		}

		const borderConfig = parseBorderStyle(context.border_style);
		if (!borderConfig) {
			return {
				action: 'ask_options',
				target: 'border_style',
				msg: 'Which border style?',
				options: [
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
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

		changes = {};
		breakpoints.forEach(bp => {
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
			} else {
				changes[`${prefix}border-color-${bp}`] = color;
				changes[`${prefix}border-palette-status-${bp}`] = false;
			}
		});

		return { action: 'apply', attributes: changes, done: true, message: 'Applied border to text.' };
	}

	if (property === 'flow_shadow') {
		if (!context.shadow_color) {
			return { action: 'ask_palette', target: 'shadow_color', msg: 'Which colour for the shadow?' };
		}
		if (!context.shadow_intensity) {
			return {
				action: 'ask_options',
				target: 'shadow_intensity',
				msg: 'Choose intensity:',
				options: [
					{ label: 'Soft', value: 'soft' },
					{ label: 'Crisp', value: 'crisp' },
					{ label: 'Bold', value: 'bold' },
					{ label: 'Glow', value: 'glow' },
				],
			};
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

		const baseShadow = {
			[`${prefix}box-shadow-status-general`]: true,
			[`${prefix}box-shadow-horizontal-general`]: x,
			[`${prefix}box-shadow-vertical-general`]: y,
			[`${prefix}box-shadow-blur-general`]: blur,
			[`${prefix}box-shadow-spread-general`]: spread,
			[`${prefix}box-shadow-inset-general`]: false,
		};

		const colorAttr = typeof color === 'number'
			? { [`${prefix}box-shadow-palette-status-general`]: true, [`${prefix}box-shadow-palette-color-general`]: color }
			: { [`${prefix}box-shadow-color-general`]: color, [`${prefix}box-shadow-palette-status-general`]: false };

		const intensityLabel = {
			soft: 'Soft',
			crisp: 'Crisp',
			bold: 'Bold',
			glow: 'Glow',
		}[intensity] || 'Custom';

		changes = { ...baseShadow, ...colorAttr };
		return { action: 'apply', attributes: changes, done: true, message: `Applied ${intensityLabel} shadow to text.` };
	}

	if (property === 'flow_text_line_height') {
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
		changes = {
			'line-height-general': lineValue.value,
			'line-height-unit-general': lineValue.unit || '-',
		};
		return { action: 'apply', attributes: changes, done: true, message: 'Updated line spacing.' };
	}

	if (property === 'flow_text_width') {
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
			'max-width-general': widthValue.value,
			'max-width-unit-general': widthValue.unit,
			'size-advanced-options': true,
		};
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text width.' };
	}

	if (property === 'flow_text_transform') {
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

	if (property === 'flow_text_highlight') {
		if (context.text_highlight === undefined) {
			return {
				action: 'ask_options',
				target: 'text_highlight',
				msg: 'Choose a highlight style:',
				options: [
					{ label: 'Yellow marker', value: 'marker' },
					{ label: 'Brand underline', value: 'underline' },
					{ label: 'Badge', value: 'badge' },
				],
			};
		}

		changes = buildTextHighlightChanges(block.attributes, context.text_highlight);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated text highlight.' };
	}

	if (property === 'flow_text_list') {
		if (context.text_list === undefined) {
			return {
				action: 'ask_options',
				target: 'text_list',
				msg: 'Choose list style:',
				options: [
					{ label: 'Bullets', value: { isList: true, typeOfList: 'ul', listStyle: 'disc' } },
					{ label: 'Numbered', value: { isList: true, typeOfList: 'ol', listStyle: 'decimal' } },
					{ label: 'Checkmarks', value: { isList: true, typeOfList: 'ul', listStyle: 'custom', listStyleCustom: 'check-circle' } },
				],
			};
		}

		changes = buildTextListChanges(context.text_list);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated list style.' };
	}

	if (property === 'flow_text_level') {
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

	if (property === 'flow_text_decoration') {
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

	if (property === 'flow_text_dynamic') {
		if (context.text_dynamic === undefined) {
			return {
				action: 'ask_options',
				target: 'text_dynamic',
				msg: 'Which dynamic field should I use?',
				options: [
					{ label: 'Post title', value: 'title' },
					{ label: 'Post date', value: 'date' },
					{ label: 'Author name', value: 'author' },
				],
			};
		}

		changes = buildTextDynamicChanges(context.text_dynamic);
		return { action: 'apply', attributes: changes, done: true, message: 'Updated dynamic content.' };
	}

	if (property === 'flow_text_link') {
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
	switch (property) {
		case 'text_color':
			changes = buildTextColorChanges(value);
			break;
		case 'text_font_size': {
			const sizeValue = parseUnitValue(value, 'px');
			changes = {
				'font-size-general': sizeValue.value,
				'font-size-unit-general': sizeValue.unit,
			};
			break;
		}
		case 'text_line_height': {
			const lineValue = parseUnitValue(value, '-');
			changes = {
				'line-height-general': lineValue.value,
				'line-height-unit-general': lineValue.unit || '-',
			};
			break;
		}
		case 'text_max_width': {
			const widthValue = parseUnitValue(value, 'px');
			changes = {
				'max-width-general': widthValue.value,
				'max-width-unit-general': widthValue.unit,
				'size-advanced-options': true,
			};
			break;
		}
		case 'text_weight':
			changes = buildFontWeightChanges(value);
			break;
		case 'text_transform':
			changes = buildTextTransformChanges(block.attributes, value);
			break;
		case 'text_highlight':
			changes = buildTextHighlightChanges(block.attributes, value);
			break;
		case 'text_list':
			changes = buildTextListChanges(value);
			break;
		case 'text_level':
		case 'textLevel':
			changes = buildTextLevelChanges(value);
			break;
		case 'text_dynamic':
			changes = buildTextDynamicChanges(value);
			break;
		case 'text_link':
			changes = buildTextLinkChanges(block, value);
			break;
		case 'text_decoration':
			changes = { 'text-decoration-general': value };
			break;
	}

	if (!changes && typeof property === 'string' && property.startsWith('dc-')) {
		changes = { [property]: value };
	}

	return changes;
};
