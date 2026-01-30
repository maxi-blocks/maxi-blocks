const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractClassNames = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(class|classes)/.test(lower)) return null;

	if (/remove\s*(all\s*)?(custom\s*)?classes?|clear\s*(custom\s*)?classes?/i.test(message)) {
		return '';
	}

	const quoted = extractQuotedText(message);
	if (quoted) return quoted;

	const match = message.match(
		/(?:css\s*classes?|custom\s*classes?|extra\s*classes?|class(?:es)?)\s*(?:to|:|=|is)?\s*([a-z0-9_\-\s]+)/i
	);
	if (match && match[1]) return match[1].trim();

	return null;
};

export const buildContainerEGroupAction = (message, { scope = 'selection' } = {}) => {
	const classNames = extractClassNames(message);
	if (classNames === null) return null;

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	return {
		action: actionType,
		property: 'extra_class_name',
		value: classNames,
		message: 'Custom classes updated.',
		...actionTarget,
	};
};

export const buildContainerEGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (!['extra_class_name', 'extra_class', 'extra_classname', 'extraClassName'].includes(normalized)) {
		return null;
	}

	return { extraClassName: value };
};

export const getContainerEGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'extra_class_name' || normalized === 'extra_class') {
		return { tabIndex: 1, accordion: 'add css classes' };
	}
	return null;
};

export default {
	buildContainerEGroupAction,
	buildContainerEGroupAttributeChanges,
	getContainerEGroupSidebarTarget,
};
