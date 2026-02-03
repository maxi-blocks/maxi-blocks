/**
 * SVG Icon Logic Handler for AI Chat Panel
 * Focused on icon fill/stroke colour and alignment changes.
 */

export const getIconSidebarTarget = property => {
	const normalized = String(property || '').replace(/-/g, '_');
	if (!normalized) return null;
	const baseProperty = normalized.replace(/_(general|xxl|xl|l|m|s|xs)$/, '');

	const alignmentProps = new Set(['alignment', 'align', 'alignment_general']);
	const altProps = new Set([
		'altTitle',
		'altDescription',
		'alt_title',
		'alt_description',
	]);
	const colorProps = new Set([
		'flow_icon_fill',
		'flow_icon_stroke',
		'flow_icon_hover_fill',
		'flow_icon_hover_stroke',
		'svg_fill_color',
		'svg_line_color',
		'svg_fill_color_hover',
		'svg_line_color_hover',
	]);
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
	const lineWidthProps = new Set([
		'flow_icon_line_width',
		'svg_stroke_width',
		'icon_stroke_width',
	]);
	const borderProps = new Set(['border', 'border_radius', 'border_hover', 'border_radius_hover']);
	const boxShadowProps = new Set(['box_shadow', 'box_shadow_hover', 'hover_glow']);
	const sizingProps = new Set(['width', 'height', 'width_fit_content', 'height_fit_content']);
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

	if (alignmentProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'alignment' };
	}
	if (altProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'icon alt' };
	}
	if (colorProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'fill & stroke color' };
	}
	if (backgroundProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'icon' };
	}
	if (lineWidthProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'icon line width' };
	}
	if (borderProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'border' };
	}
	if (boxShadowProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'box shadow' };
	}
	if (sizingProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'height / width' };
	}
	if (spacingProps.has(baseProperty)) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	return null;
};

export const ICON_PATTERNS = [
	{
		regex: /\b(icon|svg)\b.*\balt\b.*\btitle\b|\balt\s*title\b.*\b(icon|svg)\b/i,
		property: 'altTitle',
		value: 'use_prompt',
		selectionMsg: 'Updated icon alt title.',
		pageMsg: 'Updated icon alt titles.',
		target: 'icon',
	},
	{
		regex: /\b(icon|svg)\b.*\balt\b.*\bdescription\b|\balt\s*description\b.*\b(icon|svg)\b/i,
		property: 'altDescription',
		value: 'use_prompt',
		selectionMsg: 'Updated icon alt description.',
		pageMsg: 'Updated icon alt descriptions.',
		target: 'icon',
	},
	{
		regex: /\bicon\b.*\b(?:line|stroke)\s*(?:width|thickness|weight)\b|\b(?:line|stroke)\s*(?:width|thickness|weight)\b.*\bicon\b/i,
		property: 'flow_icon_line_width',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\bicon\b.*\bhover\b.*\b(stroke|line)\b.*\b(colou?r|color)\b|\bhover\b.*\bicon\b.*\b(stroke|line)\b.*\b(colou?r|color)\b/i,
		property: 'flow_icon_hover_stroke',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\bicon\b.*\bhover\b.*\b(colou?r|color|fill)\b|\bhover\b.*\bicon\b.*\b(colou?r|color|fill)\b/i,
		property: 'flow_icon_hover_fill',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\bhover\b[^.]*\bicon\b[^.]*\b(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)\b|\bicon\b[^.]*\bhover\b[^.]*\b(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)\b/i,
		property: 'flow_icon_hover_fill',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\bicon\b.*\b(stroke|line)\b.*\b(colou?r|color)\b|\b(colou?r|color)\b.*\bicon\b.*\b(stroke|line)\b/i,
		property: 'flow_icon_stroke',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\bicon\b.*\b(fill|colou?r|color)\b|\b(colou?r|color)\b.*\bicon\b/i,
		property: 'flow_icon_fill',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\bicon\b[^.]*\b(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)\b|\b(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)\b[^.]*\bicon\b/i,
		property: 'flow_icon_fill',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'icon',
	},
	{
		regex: /\b(center|centre|centered|centred|middle)\b[^.]*\bicons?\b|\bicons?\b[^.]*\b(center|centre|centered|centred|middle)\b/i,
		property: 'alignment',
		value: 'center',
		selectionMsg: 'Aligned icon center.',
		pageMsg: 'Aligned icons center.',
		target: 'icon',
	},
	{
		regex: /\bleft\b[^.]*\bicons?\b|\bicons?\b[^.]*\bleft\b/i,
		property: 'alignment',
		value: 'left',
		selectionMsg: 'Aligned icon left.',
		pageMsg: 'Aligned icons left.',
		target: 'icon',
	},
	{
		regex: /\bright\b[^.]*\bicons?\b|\bicons?\b[^.]*\bright\b/i,
		property: 'alignment',
		value: 'right',
		selectionMsg: 'Aligned icon right.',
		pageMsg: 'Aligned icons right.',
		target: 'icon',
	},
];

export const handleIconUpdate = (block, property, value, _prefix, context = {}) => {
	const isIcon = block?.name?.includes('icon');
	if (!isIcon) return null;

	if (property === 'altTitle' || property === 'alt_title') {
		if (value === undefined || value === null) return null;
		return { altTitle: String(value) };
	}

	if (property === 'altDescription' || property === 'alt_description') {
		if (value === undefined || value === null) return null;
		return { altDescription: String(value) };
	}

	const buildSvgFillColor = (colorValue, isHover = false) => {
		const suffix = isHover ? '-hover' : '';
		const isPalette = typeof colorValue === 'number';
		return {
			[`svg-fill-palette-status${suffix}`]: isPalette,
			[`svg-fill-palette-color${suffix}`]: isPalette ? colorValue : '',
			[`svg-fill-color${suffix}`]: isPalette ? '' : colorValue,
			...(isHover ? { 'svg-status-hover': true } : {}),
		};
	};

	const buildSvgLineColor = (colorValue, isHover = false) => {
		const suffix = isHover ? '-hover' : '';
		const isPalette = typeof colorValue === 'number';
		return {
			[`svg-line-palette-status${suffix}`]: isPalette,
			[`svg-line-palette-color${suffix}`]: isPalette ? colorValue : '',
			[`svg-line-color${suffix}`]: isPalette ? '' : colorValue,
			...(isHover ? { 'svg-status-hover': true } : {}),
		};
	};

	if (property === 'icon_svg') {
		const rawSvg = typeof value === 'string' ? value : value?.svgCode;
		const nextSvgType = typeof value === 'object' ? value?.svgType : null;
		const nextAltTitle = typeof value === 'object' ? value?.title || value?.label : null;
		if (!rawSvg) return null;
		return {
			content: rawSvg,
			...(nextSvgType ? { svgType: nextSvgType } : {}),
			...(nextAltTitle ? { altTitle: String(nextAltTitle) } : {}),
		};
	}

	if (property === 'flow_icon_line_width') {
		if (context.icon_line_width === undefined) {
			return {
				action: 'ask_options',
				target: 'icon_line_width',
				msg: 'What line width would you like for the icons?',
				options: [
					{ label: 'Thin', value: 1 },
					{ label: 'Medium', value: 2 },
					{ label: 'Thick', value: 4 },
				],
			};
		}
		const lineWidth = Number(context.icon_line_width);
		if (!Number.isFinite(lineWidth)) {
			return {
				action: 'ask_options',
				target: 'icon_line_width',
				msg: 'What line width would you like for the icons?',
				options: [
					{ label: 'Thin', value: 1 },
					{ label: 'Medium', value: 2 },
					{ label: 'Thick', value: 4 },
				],
			};
		}

		return {
			action: 'apply',
			attributes: { 'svg-stroke-general': lineWidth },
			done: true,
			message: 'Updated icon line width.',
		};
	}

	if (property === 'flow_icon_hover_fill') {
		if (context.icon_hover_fill === undefined) {
			return { action: 'ask_palette', target: 'icon_hover_fill', msg: 'Which colour for the icon fill hover?' };
		}
		return {
			action: 'apply',
			attributes: buildSvgFillColor(context.icon_hover_fill, true),
			done: true,
			message: 'Updated icon fill hover colour.',
		};
	}

	if (property === 'flow_icon_hover_stroke') {
		if (context.icon_hover_stroke === undefined) {
			return { action: 'ask_palette', target: 'icon_hover_stroke', msg: 'Which colour for the icon line hover?' };
		}
		return {
			action: 'apply',
			attributes: buildSvgLineColor(context.icon_hover_stroke, true),
			done: true,
			message: 'Updated icon line hover colour.',
		};
	}

	if (property === 'flow_icon_fill') {
		if (context.icon_fill === undefined) {
			return { action: 'ask_palette', target: 'icon_fill', msg: 'Which colour for the icon fill?' };
		}
		return {
			action: 'apply',
			attributes: buildSvgFillColor(context.icon_fill, false),
			done: true,
			message: 'Updated icon fill colour.',
		};
	}

	if (property === 'flow_icon_stroke') {
		if (context.icon_stroke === undefined) {
			return { action: 'ask_palette', target: 'icon_stroke', msg: 'Which colour for the icon stroke?' };
		}
		return {
			action: 'apply',
			attributes: buildSvgLineColor(context.icon_stroke, false),
			done: true,
			message: 'Updated icon stroke colour.',
		};
	}

	if (property === 'alignment') {
		return { 'alignment-general': value };
	}

	return null;
};
