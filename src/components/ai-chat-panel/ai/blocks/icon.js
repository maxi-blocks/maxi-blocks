/**
 * SVG Icon Logic Handler for AI Chat Panel
 * Focused on icon fill/stroke colour changes.
 */

export const ICON_PATTERNS = [
	{
		regex: /\bicon\b.*\bline\s*width\b|\bline\s*width\b.*\bicon\b|\bstroke\s*width\b/i,
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
];

export const handleIconUpdate = (block, property, value, prefix, context = {}) => {
	const isIcon = block?.name?.includes('icon');
	if (!isIcon) return null;

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
		if (!rawSvg) return null;
		return {
			content: rawSvg,
			...(nextSvgType ? { svgType: nextSvgType } : {}),
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

		return {
			action: 'apply',
			attributes: { 'svg-stroke-general': Number(context.icon_line_width) },
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

	return null;
};
