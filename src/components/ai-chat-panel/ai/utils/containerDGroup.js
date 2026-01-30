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

const extractDisplayValue = message => {
	const lower = String(message || '').toLowerCase();

	if (/(?:display\s*(?:to|:)?\s*none|hide|invisible|disappear)/.test(lower)) {
		return 'none';
	}
	if (/display\s*(?:to|:)?\s*block/.test(lower)) return 'block';
	if (/display\s*(?:to|:)?\s*grid/.test(lower)) return 'grid';
	if (/display\s*(?:to|:)?\s*inline-block/.test(lower)) return 'inline-block';
	if (/display\s*(?:to|:)?\s*inline/.test(lower)) return 'inline';
	if (/(?:display\s*(?:to|:)?\s*flex|show|visible|unhide)/.test(lower)) {
		return 'flex';
	}

	return null;
};

const buildDisplayChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (breakpoint) {
		return { [`display-${breakpoint}`]: rawValue };
	}
	return { 'display-general': rawValue };
};

export const buildContainerDGroupAction = (message, { scope = 'selection' } = {}) => {
	const displayValue = extractDisplayValue(message);
	if (!displayValue) return null;

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	return {
		action: actionType,
		property: 'display',
		value: displayValue,
		message: `Display set to ${displayValue}.`,
		...actionTarget,
	};
};

export const buildContainerDGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized !== 'display') return null;

	return buildDisplayChanges(value);
};

export const getContainerDGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'display') {
		return { tabIndex: 1, accordion: 'flexbox' };
	}
	return null;
};

export default {
	buildContainerDGroupAction,
	buildContainerDGroupAttributeChanges,
	getContainerDGroupSidebarTarget,
};
