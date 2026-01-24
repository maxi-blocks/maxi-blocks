/**
 * Container Logic Handler for AI Chat Panel
 * Maps natural language to Container block attributes.
 */

export const CONTAINER_PATTERNS = [
	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Complex interactions)
	// ============================================================

	// 1. RADIUS / SHAPE FLOW
	{
		regex: /round|curve|curved|radius|soft.*corner|rounded/i,
		property: 'flow_radius',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'container',
	},

	// 2. BORDER / FRAME FLOW
	{
		regex: /border|frame|stroke|outline|container.*edge|section.*edge/i,
		property: 'flow_border',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'container',
	},

	// 3. SHADOW FLOW
	{
		regex: /shadow|glow|lift|depth|drop.*shadow|elevat(ed|e)?/i,
		property: 'flow_shadow',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'container',
	},
];

export const handleContainerUpdate = (block, property, value, prefix, context = {}) => {
	let changes = null;
	const isContainer = block?.name?.includes('container') && !block.name.includes('group');

	if (!isContainer) return null;

	// === INTERACTION FLOWS ===

	// 1. RADIUS FLOW
	if (property === 'flow_radius') {
		if (context.radius_value === undefined) {
			return {
				action: 'ask_options',
				target: 'radius_value',
				msg: 'Choose corner style:',
				options: [
					{ label: 'Sharp', value: 0 },
					{ label: 'Subtle (8px)', value: 8 },
					{ label: 'Soft (24px)', value: 24 },
					{ label: 'Full (50px)', value: 50 },
				],
			};
		}

		const r = context.radius_value;
		changes = {
			[`${prefix}border-top-left-radius-general`]: r,
			[`${prefix}border-top-right-radius-general`]: r,
			[`${prefix}border-bottom-right-radius-general`]: r,
			[`${prefix}border-bottom-left-radius-general`]: r,
			[`${prefix}border-sync-radius-general`]: 'all',
			[`${prefix}border-unit-radius-general`]: 'px',
		};

		const radiusLabel = {
			0: 'Sharp',
			8: 'Subtle (8px)',
			24: 'Soft (24px)',
			50: 'Full (50px)',
		}[r] || `${r}px`;

		return { action: 'apply', attributes: changes, done: true, message: `Applied ${radiusLabel} corners to containers.` };
	}

	// 2. BORDER FLOW
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

		const style = context.border_style.split('-')[0];
		const width = parseInt(context.border_style.split('-')[1].replace('px', ''), 10);
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

		return { action: 'apply', attributes: changes, done: true, message: 'Applied border to containers.' };
	}

	// 3. SHADOW FLOW
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
		return { action: 'apply', attributes: changes, done: true, message: `Applied ${intensityLabel} shadow to containers.` };
	}

	return null;
};
