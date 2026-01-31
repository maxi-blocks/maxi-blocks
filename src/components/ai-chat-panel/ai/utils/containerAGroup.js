import {
	buildLayoutAGroupAction,
	buildResponsiveBooleanChanges,
	buildResponsiveValueChanges,
	extractBreakpointToken,
	extractAlignItemsValue,
	extractAlignContentValue,
	extractJustifyContentValue,
	normalizeValueWithBreakpoint,
} from './layoutAGroup';

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

export const extractArrowStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('arrow')) return null;
	if (/(show|enable|add).*(callout\s*)?arrow/.test(lower)) return true;
	if (/(hide|disable|remove).*(callout\s*)?arrow/.test(lower)) return false;
	return null;
};

export const extractArrowSide = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('arrow')) return null;
	if (/\barrow\b.*\btop\b|\btop\b.*\barrow\b/.test(lower)) return 'top';
	if (/\barrow\b.*\bbottom\b|\bbottom\b.*\barrow\b/.test(lower)) return 'bottom';
	if (/\barrow\b.*\bleft\b|\bleft\b.*\barrow\b/.test(lower)) return 'left';
	if (/\barrow\b.*\bright\b|\bright\b.*\barrow\b/.test(lower)) return 'right';
	return null;
};

export const extractArrowPosition = message =>
	extractNumericValue(message, [
		/(?:arrow\s*(?:position|pos)|position\s*of\s*arrow)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/\barrow\b.*\bposition\b.*?(\d+(?:\.\d+)?)/i,
	]);

export const extractArrowWidth = message =>
	extractNumericValue(message, [
		/(?:arrow\s*width|width\s*of\s*arrow)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/\barrow\b.*?(\d+(?:\.\d+)?)\s*(?:px)?\s*(?:wide|width)/i,
	]);

export const buildContainerAGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};
	const breakpoint = extractBreakpointToken(message);

	const arrowStatus = extractArrowStatus(message);
	if (typeof arrowStatus === 'boolean') {
		return {
			action: actionType,
			property: 'arrow_status',
			value: breakpoint ? { value: arrowStatus, breakpoint } : arrowStatus,
			message: arrowStatus ? 'Callout arrow shown.' : 'Callout arrow hidden.',
			...actionTarget,
		};
	}

	const arrowSide = extractArrowSide(message);
	if (arrowSide) {
		return {
			action: actionType,
			property: 'arrow_side',
			value: breakpoint ? { value: arrowSide, breakpoint } : arrowSide,
			message: 'Arrow side set.',
			...actionTarget,
		};
	}

	const arrowPosition = extractArrowPosition(message);
	if (Number.isFinite(arrowPosition)) {
		return {
			action: actionType,
			property: 'arrow_position',
			value: breakpoint ? { value: arrowPosition, breakpoint } : arrowPosition,
			message: 'Arrow position set.',
			...actionTarget,
		};
	}

	const arrowWidth = extractArrowWidth(message);
	if (Number.isFinite(arrowWidth)) {
		return {
			action: actionType,
			property: 'arrow_width',
			value: breakpoint ? { value: arrowWidth, breakpoint } : arrowWidth,
			message: 'Arrow width set.',
			...actionTarget,
		};
	}

	const layoutAction = buildLayoutAGroupAction(message, {
		scope,
		targetBlock: 'container',
		propertyMap: {
			alignItems: 'align_items_flex',
			alignContent: 'align_content',
			justifyContent: 'justify_content',
		},
	});
	if (layoutAction) {
		return layoutAction;
	}

	return null;
};

export const buildContainerAGroupAttributeChanges = (
	property,
	value,
	{ block, attributes } = {}
) => {
	if (!property) return null;

	switch (property) {
		case 'arrow_status': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const status = Boolean(rawValue);
			return breakpoint
				? { [`arrow-status-${breakpoint}`]: status }
				: buildResponsiveBooleanChanges('arrow-status', status);
		}
		case 'arrow_side': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const side = String(rawValue || 'bottom');
			return breakpoint
				? { [`arrow-side-${breakpoint}`]: side }
				: buildResponsiveValueChanges('arrow-side', side);
		}
		case 'arrow_position': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const pos = Number(rawValue);
			const finalPos = Number.isFinite(pos) ? pos : 0;
			return breakpoint
				? { [`arrow-position-${breakpoint}`]: finalPos }
				: buildResponsiveValueChanges('arrow-position', finalPos);
		}
		case 'arrow_width': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const width = Number(rawValue);
			const finalWidth = Number.isFinite(width) ? width : 0;
			return breakpoint
				? { [`arrow-width-${breakpoint}`]: finalWidth }
				: buildResponsiveValueChanges('arrow-width', finalWidth);
		}
		case 'align_items_flex': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const direction = String(block?.attributes?.['flex-direction-general'] || '').toLowerCase();
			const isColumn = direction.startsWith('column');
			const isMainAxisAlign = ['flex-start', 'center', 'flex-end'].includes(alignValue);
			const key = isColumn && isMainAxisAlign ? 'justify-content' : 'align-items';
			if (breakpoint) {
				return { [`${key}-${breakpoint}`]: alignValue };
			}
			return { [`${key}-general`]: alignValue };
		}
		case 'align_content': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			return breakpoint
				? { [`align-content-${breakpoint}`]: alignValue }
				: { 'align-content-general': alignValue };
		}
		case 'justify_content': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const justifyValue = String(rawValue || '');
			return breakpoint
				? { [`justify-content-${breakpoint}`]: justifyValue }
				: { 'justify-content-general': justifyValue };
		}
		default:
			return null;
	}
};

export const getContainerAGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		['arrow_status', 'arrow_side', 'arrow_position', 'arrow_width'].includes(
			normalized
		)
	) {
		return { tabIndex: 0, accordion: 'callout arrow' };
	}

	if (
		[
			'align_items',
			'align_items_flex',
			'align_content',
			'justify_content',
			'flex_direction',
			'flex_wrap',
			'gap',
			'row_gap',
			'column_gap',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	return null;
};

export default {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
	extractArrowStatus,
	extractArrowSide,
	extractArrowPosition,
	extractArrowWidth,
	extractAlignItemsValue,
	extractAlignContentValue,
	extractJustifyContentValue,
};
