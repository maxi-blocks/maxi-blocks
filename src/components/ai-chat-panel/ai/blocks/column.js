/**
 * Column Logic Handler for AI Chat Panel
 * Focused on column size and layout controls.
 */

const COLUMN_PROPERTY_ALIASES = {
	columnSize: 'column_size',
	columnWidth: 'column_size',
	columnFitContent: 'column_fit_content',
	'column-size': 'column_size',
	'column-fit-content': 'column_fit_content',
};

const normalizeColumnProperty = property => {
	if (!property) return '';
	const normalized = String(property).replace(/-/g, '_');
	return COLUMN_PROPERTY_ALIASES[normalized] || COLUMN_PROPERTY_ALIASES[property] || normalized;
};

const normalizeBoolean = value => {
	if (typeof value === 'boolean') return value;
	if (value === null || value === undefined) return null;
	if (value && typeof value === 'object' && value.value !== undefined) {
		return normalizeBoolean(value.value);
	}
	const normalized = String(value).trim().toLowerCase();
	if (['true', 'yes', 'on', '1', 'enable', 'enabled'].includes(normalized)) {
		return true;
	}
	if (['false', 'no', 'off', '0', 'disable', 'disabled'].includes(normalized)) {
		return false;
	}
	return Boolean(value);
};

const parseColumnSize = rawValue => {
	if (rawValue === null || rawValue === undefined || rawValue === '') return null;
	if (typeof rawValue === 'number') return rawValue;
	if (rawValue && typeof rawValue === 'object' && rawValue.value !== undefined) {
		const numeric = Number(rawValue.value);
		return Number.isFinite(numeric) ? numeric : null;
	}

	const normalized = String(rawValue).trim().toLowerCase();
	if (!normalized) return null;
	const match = normalized.match(/(-?\d+(?:\.\d+)?)/);
	if (!match) return null;
	const numeric = Number(match[1]);
	return Number.isFinite(numeric) ? numeric : null;
};

const normalizeBreakpoint = value => {
	if (value && typeof value === 'object' && value.breakpoint) {
		return value.breakpoint;
	}
	return 'general';
};

export const COLUMN_PATTERNS = [
	{
		regex: /\bcolumn\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bcolumn\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the column background?',
		pageMsg: 'Which colour for the column background?',
		target: 'column',
		colorTarget: 'column',
	},
	{
		regex: /\bcolumn\b.*\b(disable\s*fit\s*content|fixed\s*width|fixed\s*size)\b|\b(disable\s*fit\s*content|fixed\s*width|fixed\s*size)\b.*\bcolumn\b/i,
		property: 'column_fit_content',
		value: false,
		selectionMsg: 'Column fit content disabled.',
		pageMsg: 'Column fit content disabled.',
		target: 'column',
	},
	{
		regex: /\bcolumn\b.*\b(fit\s*content|hug(?:s)?\s*content|auto\s*width|shrink\s*to\s*content|content\s*width)\b|\b(fit\s*content|hug(?:s)?\s*content|auto\s*width|shrink\s*to\s*content|content\s*width)\b.*\bcolumn\b/i,
		property: 'column_fit_content',
		value: true,
		selectionMsg: 'Column set to fit content.',
		pageMsg: 'Columns set to fit content.',
		target: 'column',
	},
	{
		regex: /\bcolumn\b.*\b(width|size)\b.*\b\d+(?:\.\d+)?\s*(%|percent(?:age)?)|\b\d+(?:\.\d+)?\s*(%|percent(?:age)?)\b.*\bcolumn\b.*\b(width|size)\b/i,
		property: 'column_size',
		value: 'use_prompt',
		selectionMsg: 'Column size updated.',
		pageMsg: 'Column size updated.',
		target: 'column',
	},
];

export const getColumnSidebarTarget = property => {
	if (!property) return null;
	const normalized = normalizeColumnProperty(property);

	if (['column_size', 'column_fit_content'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'column settings' };
	}

	return null;
};

export const handleColumnUpdate = (block, property, value, prefix, context = {}) => {
	const isColumn = block?.name?.includes('column');
	if (!isColumn) return null;

	const normalizedProperty = normalizeColumnProperty(property);
	const breakpoint = normalizeBreakpoint(value);

	switch (normalizedProperty) {
		case 'column_size': {
			const sizeValue = parseColumnSize(value);
			if (sizeValue === null) return null;
			const clamped = Math.max(0, Math.min(100, sizeValue));
			return {
				[`column-size-${breakpoint}`]: clamped,
				[`column-fit-content-${breakpoint}`]: false,
			};
		}
		case 'column_fit_content': {
			const enabled = normalizeBoolean(value);
			if (enabled === null) return null;
			return {
				[`column-fit-content-${breakpoint}`]: enabled,
			};
		}
		default:
			return null;
	}
};
