/**
 * Container Logic Handler for AI Chat Panel
 * Maps natural language to Container block attributes.
 */

import { SHARED_FLOWS } from '../flows/flowConfig';
import { runFlow } from '../flows/flowEngine';

/**
 * Flow configuration for the Container block.
 * Shared defaults apply: color→style border, general-only radius, general-only shadow.
 */
export const CONTAINER_FLOW_CONFIG = {
	border: { ...SHARED_FLOWS.border, breakpointStrategy: 'active' },
	radius: { ...SHARED_FLOWS.radius },
	shadow: { ...SHARED_FLOWS.shadow },
};

export const CONTAINER_PATTERNS = [
	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Complex interactions)
	// ============================================================

	// 1. RADIUS / SHAPE FLOW
	{
		regex: /\bround(?:ed|ing|er)?\b|\bcurv(?:e|ed|ing)?\b|\bradius\b|soft.*corner/i,
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
	const isContainer = block?.name?.includes('container') && !block?.name?.includes('group');

	if (!isContainer) return null;

	// === INTERACTION FLOWS — delegated to shared flow engine ===

	if (
		property === 'flow_radius' ||
		property === 'flow_border' ||
		property === 'flow_shadow' ||
		property === 'flow_radius_hover' ||
		property === 'flow_border_hover' ||
		property === 'flow_shadow_hover'
	) {
		const flowName = property.replace('flow_', '');
		return runFlow(flowName, context, CONTAINER_FLOW_CONFIG, prefix, null, 'container');
	}

	return null;
};
