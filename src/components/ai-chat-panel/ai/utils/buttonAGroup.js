import {
	buildLayoutAGroupAction,
	normalizeValueWithBreakpoint,
	extractAlignContentValue,
	extractAlignItemsValue,
	extractAlignmentValue,
} from './layoutAGroup';

export const buildButtonAGroupAction = (message, options = {}) => {
	const layoutAction = buildLayoutAGroupAction(message, {
		...options,
		targetBlock: 'button',
		propertyMap: {
			alignItems: 'align_items',
			alignContent: 'align_content',
			alignment: 'alignment',
		},
	});
	if (layoutAction) {
		return layoutAction;
	}

	return null;
};

export const buildButtonAGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;

	switch (property) {
		case 'anchor_link': {
			const textValue = String(value || '');
			return { anchorLink: textValue };
		}
		case 'aria_label': {
			const textValue = String(value || '');
			return {
				ariaLabels: {
					...(attributes?.ariaLabels || {}),
					button: textValue,
				},
			};
		}
		case 'align_items': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`align-items-${targetBreakpoint}`]: alignValue };
		}
		case 'align_content': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`align-content-${targetBreakpoint}`]: alignValue };
		}
		case 'alignment': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignmentValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`alignment-${targetBreakpoint}`]: alignmentValue };
		}
		default:
			return null;
	}
};

export const getButtonAGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'anchor_link') {
		return { tabIndex: 2, accordion: 'add anchor link' };
	}

	if (normalized === 'aria_label') {
		return { tabIndex: 2, accordion: 'aria label' };
	}

	if (['align_items', 'align_content'].includes(normalized)) {
		return { tabIndex: 2, accordion: 'flexbox' };
	}

	if (normalized === 'alignment') {
		return { tabIndex: 0, accordion: 'alignment' };
	}

	return null;
};

export default {
	buildButtonAGroupAction,
	buildButtonAGroupAttributeChanges,
	getButtonAGroupSidebarTarget,
	extractAlignItemsValue,
	extractAlignContentValue,
	extractAlignmentValue,
};
