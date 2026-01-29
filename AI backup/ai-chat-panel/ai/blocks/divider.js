/**
 * Divider Logic Handler for AI Chat Panel
 * Focused on divider line colour changes.
 */

const parseDividerValue = (rawValue, fallbackUnit = 'px') => {
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
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|em|vw)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const normalizeDividerAlign = (rawValue, axis) => {
	const normalised = String(rawValue || '').toLowerCase();
	const isCenter = normalised === 'center' || normalised === 'centre' || normalised === 'middle';

	if (axis === 'horizontal') {
		if (normalised === 'left' || normalised === 'start') return 'flex-start';
		if (normalised === 'right' || normalised === 'end') return 'flex-end';
		return isCenter ? 'center' : 'center';
	}

	if (axis === 'vertical') {
		if (normalised === 'top') return 'flex-start';
		if (normalised === 'bottom') return 'flex-end';
		return isCenter ? 'center' : 'center';
	}

	return 'center';
};

const getDividerOrientation = block => {
	const attrs = block?.attributes || {};
	return attrs['line-orientation-general'] || attrs['line-orientation'] || 'horizontal';
};

export const DIVIDER_PATTERNS = [
	{
		regex: /\b(?:shadow|glow|drop\s*shadow|depth|lift|raised|elevat(?:ed|e)?)\b/i,
		property: 'flow_shadow',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bdashed\b|\bdashed\b.*\bdivider\b/i,
		property: 'divider_style',
		value: 'dashed',
		selectionMsg: 'Applied dashed divider.',
		pageMsg: 'Applied dashed divider.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bdotted\b|\bdotted\b.*\bdivider\b/i,
		property: 'divider_style',
		value: 'dotted',
		selectionMsg: 'Applied dotted divider.',
		pageMsg: 'Applied dotted divider.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bdouble\b|\bdouble\b.*\bdivider\b/i,
		property: 'divider_style',
		value: 'double',
		selectionMsg: 'Applied double divider.',
		pageMsg: 'Applied double divider.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bsolid\b|\bsolid\b.*\bdivider\b/i,
		property: 'divider_style',
		value: 'solid',
		selectionMsg: 'Applied solid divider.',
		pageMsg: 'Applied solid divider.',
		target: 'divider',
	},
	{
		regex: /\b(no|remove|hide|clear)\b.*\bdivider\b|\bdivider\b.*\b(no|remove|hide|clear)\b/i,
		property: 'divider_style',
		value: 'none',
		selectionMsg: 'Removed divider line.',
		pageMsg: 'Removed divider line.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(style|line\s*style)\b|\b(style|line\s*style)\b.*\bdivider\b/i,
		property: 'flow_divider_style',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated divider style.',
		target: 'divider',
	},
	{
		regex: /\b(round|rounded|pill|capsule)\b.*\bdivider\b|\bdivider\b.*\b(round|rounded|pill|capsule)\b/i,
		property: 'divider_border_radius',
		value: true,
		selectionMsg: 'Rounded divider ends.',
		pageMsg: 'Rounded divider ends.',
		target: 'divider',
	},
	{
		regex: /\b(square|sharp|straight)\b.*\bdivider\b|\bdivider\b.*\b(square|sharp|straight)\b/i,
		property: 'divider_border_radius',
		value: false,
		selectionMsg: 'Removed divider rounding.',
		pageMsg: 'Removed divider rounding.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(thin|fine)\b|\b(thin|fine)\b.*\bdivider\b/i,
		property: 'divider_weight',
		value: 1,
		selectionMsg: 'Applied thin divider weight.',
		pageMsg: 'Applied thin divider weight.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(thick|bold|heavy)\b|\b(thick|bold|heavy)\b.*\bdivider\b/i,
		property: 'divider_weight',
		value: 4,
		selectionMsg: 'Applied thick divider weight.',
		pageMsg: 'Applied thick divider weight.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(weight|thickness|line\s*weight|line\s*thickness)\b|\b(weight|thickness)\b.*\bdivider\b/i,
		property: 'flow_divider_weight',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated divider weight.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(short|shorter)\b|\b(short|shorter)\b.*\bdivider\b/i,
		property: 'divider_size',
		value: { size: 25, unit: '%' },
		selectionMsg: 'Shortened the divider.',
		pageMsg: 'Shortened the divider.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(half|medium)\b|\b(half|medium)\b.*\bdivider\b/i,
		property: 'divider_size',
		value: { size: 50, unit: '%' },
		selectionMsg: 'Set divider to medium length.',
		pageMsg: 'Set divider to medium length.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(long|longer|full)\b|\b(long|longer|full)\b.*\bdivider\b/i,
		property: 'divider_size',
		value: { size: 100, unit: '%' },
		selectionMsg: 'Extended the divider.',
		pageMsg: 'Extended the divider.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(size|length|width|height)\b|\b(size|length|width|height)\b.*\bdivider\b/i,
		property: 'flow_divider_size',
		value: 'start',
		selectionMsg: '',
		pageMsg: 'Updated divider size.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bvertical\b|\bvertical\b.*\bdivider\b/i,
		property: 'divider_orientation',
		value: 'vertical',
		selectionMsg: 'Set divider to vertical.',
		pageMsg: 'Set divider to vertical.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bhorizontal\b|\bhorizontal\b.*\bdivider\b/i,
		property: 'divider_orientation',
		value: 'horizontal',
		selectionMsg: 'Set divider to horizontal.',
		pageMsg: 'Set divider to horizontal.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bleft\b|\bleft\b.*\bdivider\b/i,
		property: 'divider_align_horizontal',
		value: 'left',
		selectionMsg: 'Aligned divider left.',
		pageMsg: 'Aligned divider left.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(right)\b|\b(right)\b.*\bdivider\b/i,
		property: 'divider_align_horizontal',
		value: 'right',
		selectionMsg: 'Aligned divider right.',
		pageMsg: 'Aligned divider right.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(centre|center|middle)\b|\b(centre|center|middle)\b.*\bdivider\b/i,
		property: 'divider_align_horizontal',
		value: 'center',
		selectionMsg: 'Centred the divider.',
		pageMsg: 'Centred the divider.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\btop\b|\btop\b.*\bdivider\b/i,
		property: 'divider_align_vertical',
		value: 'top',
		selectionMsg: 'Aligned divider to the top.',
		pageMsg: 'Aligned divider to the top.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\bbottom\b|\bbottom\b.*\bdivider\b/i,
		property: 'divider_align_vertical',
		value: 'bottom',
		selectionMsg: 'Aligned divider to the bottom.',
		pageMsg: 'Aligned divider to the bottom.',
		target: 'divider',
	},
	{
		regex: /\bdivider\b.*\b(colou?r|color)\b|\b(colou?r|color)\b.*\bdivider\b|\bline\b.*\b(colou?r|color)\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the divider?',
		pageMsg: 'Which colour for the divider?',
		target: 'divider',
		colorTarget: 'divider',
	},
];

export const handleDividerUpdate = (block, property, value, prefix, context = {}) => {
	const isDivider = block?.name?.includes('divider');
	if (!isDivider) return null;
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
					{ label: 'Glow', value: 'glow' }
				]
			};
		}

		const color = context.shadow_color;
		const intensity = context.shadow_intensity;
		const dividerPrefix = prefix || 'divider-';

		let x = 0, y = 4, blur = 10, spread = 0;
		if (intensity === 'soft') { x = 0; y = 4; blur = 12; spread = 0; }
		if (intensity === 'crisp') { x = 0; y = 2; blur = 4; spread = 0; }
		if (intensity === 'bold') { x = 4; y = 4; blur = 0; spread = 0; }
		if (intensity === 'glow') { x = 0; y = 0; blur = 15; spread = 2; }

		const baseShadow = {
			[`${dividerPrefix}box-shadow-status-general`]: true,
			[`${dividerPrefix}box-shadow-horizontal-general`]: x,
			[`${dividerPrefix}box-shadow-vertical-general`]: y,
			[`${dividerPrefix}box-shadow-blur-general`]: blur,
			[`${dividerPrefix}box-shadow-spread-general`]: spread,
			[`${dividerPrefix}box-shadow-inset-general`]: false,
		};

		const colorAttr = typeof color === 'number'
			? { [`${dividerPrefix}box-shadow-palette-status-general`]: true, [`${dividerPrefix}box-shadow-palette-color-general`]: color }
			: { [`${dividerPrefix}box-shadow-color-general`]: color, [`${dividerPrefix}box-shadow-palette-status-general`]: false };

		const intensityLabel = {
			soft: 'Soft',
			crisp: 'Crisp',
			bold: 'Bold',
			glow: 'Glow',
		}[intensity] || 'Custom';

		return {
			action: 'apply',
			attributes: { ...baseShadow, ...colorAttr },
			done: true,
			message: `Applied ${intensityLabel} shadow to divider.`,
		};
	}

	if (property === 'flow_divider_style') {
		if (context.divider_style === undefined) {
			return {
				action: 'ask_options',
				target: 'divider_style',
				msg: 'Choose a divider style:',
				options: [
					{ label: 'Solid', value: 'solid' },
					{ label: 'Dashed', value: 'dashed' },
					{ label: 'Dotted', value: 'dotted' },
					{ label: 'Double', value: 'double' },
					{ label: 'None', value: 'none' },
				],
			};
		}

		return {
			action: 'apply',
			attributes: { 'divider-border-style-general': context.divider_style },
			done: true,
			message: 'Updated divider style.',
		};
	}

	if (property === 'flow_divider_weight') {
		if (context.divider_weight === undefined) {
			return {
				action: 'ask_options',
				target: 'divider_weight',
				msg: 'Choose a divider weight:',
				options: [
					{ label: 'Thin (1px)', value: 1 },
					{ label: 'Medium (2px)', value: 2 },
					{ label: 'Thick (4px)', value: 4 },
				],
			};
		}

		const parsed = parseDividerValue(context.divider_weight, 'px');
		const unit = ['px', 'em', 'vw'].includes(parsed.unit) ? parsed.unit : 'px';
		const currentStyle = block?.attributes?.['divider-border-style-general'];

		return {
			action: 'apply',
			attributes: {
				'divider-border-top-width-general': parsed.value,
				'divider-border-right-width-general': parsed.value,
				'divider-border-top-unit-general': unit,
				'divider-border-right-unit-general': unit,
				...(!currentStyle || currentStyle === 'none' ? { 'divider-border-style-general': 'solid' } : {}),
			},
			done: true,
			message: 'Updated divider weight.',
		};
	}

	if (property === 'flow_divider_size') {
		if (context.divider_size === undefined) {
			return {
				action: 'ask_options',
				target: 'divider_size',
				msg: 'Choose a divider length:',
				options: [
					{ label: 'Short (25%)', value: { size: 25, unit: '%' } },
					{ label: 'Medium (50%)', value: { size: 50, unit: '%' } },
					{ label: 'Long (100%)', value: { size: 100, unit: '%' } },
				],
			};
		}

		const orientation = getDividerOrientation(block);
		const parsed = parseDividerValue(context.divider_size, '%');
		const sizeValue = parsed.unit === '%' ? Math.min(Math.max(parsed.value, 0), 100) : parsed.value;

		const attributes =
			orientation === 'vertical'
				? { 'divider-height-general': sizeValue }
				: { 'divider-width-general': sizeValue, 'divider-width-unit-general': parsed.unit || '%' };

		return {
			action: 'apply',
			attributes,
			done: true,
			message: 'Updated divider length.',
		};
	}

	if (property === 'divider_style') {
		return { 'divider-border-style-general': String(value || 'solid') };
	}

	if (property === 'divider_weight') {
		const parsed = parseDividerValue(value, 'px');
		const unit = ['px', 'em', 'vw'].includes(parsed.unit) ? parsed.unit : 'px';
		const currentStyle = block?.attributes?.['divider-border-style-general'];

		return {
			'divider-border-top-width-general': parsed.value,
			'divider-border-right-width-general': parsed.value,
			'divider-border-top-unit-general': unit,
			'divider-border-right-unit-general': unit,
			...(!currentStyle || currentStyle === 'none' ? { 'divider-border-style-general': 'solid' } : {}),
		};
	}

	if (property === 'divider_size') {
		const orientation = getDividerOrientation(block);
		const parsed = parseDividerValue(value, '%');
		const sizeValue = parsed.unit === '%' ? Math.min(Math.max(parsed.value, 0), 100) : parsed.value;

		return orientation === 'vertical'
			? { 'divider-height-general': sizeValue }
			: { 'divider-width-general': sizeValue, 'divider-width-unit-general': parsed.unit || '%' };
	}

	if (property === 'divider_orientation') {
		const orientation = String(value || '').toLowerCase() === 'vertical' ? 'vertical' : 'horizontal';
		return { 'line-orientation-general': orientation };
	}

	if (property === 'divider_align_horizontal') {
		return { 'line-horizontal-general': normalizeDividerAlign(value, 'horizontal') };
	}

	if (property === 'divider_align_vertical') {
		return { 'line-vertical-general': normalizeDividerAlign(value, 'vertical') };
	}

	if (property === 'divider_border_radius') {
		return { 'divider-border-radius-general': Boolean(value) };
	}

	return null;
};
