export const ATTRIBUTE_TYPES = {
	BOOLEAN: 'boolean',
	NUMBER: 'number',
	STRING: 'string',
	COLOR: 'color',
	ICON: 'icon',
	UNIT: 'unit',
	OBJECT: 'object',
	ARRAY: 'array',
	UNKNOWN: 'unknown',
};

const BOOLEAN_TOKENS = new Set([
	'status',
	'enabled',
	'disabled',
	'active',
	'inactive',
	'visible',
	'hidden',
	'collapsed',
	'expanded',
	'sync',
]);

const NUMBER_TOKENS = new Set([
	'width',
	'height',
	'size',
	'radius',
	'padding',
	'margin',
	'gap',
	'offset',
	'top',
	'right',
	'bottom',
	'left',
	'blur',
	'spread',
	'angle',
	'duration',
	'delay',
	'opacity',
	'count',
	'scale',
	'rotate',
	'skew',
]);

const COLOR_TOKENS = new Set([
	'color',
	'background',
	'fill',
	'stroke',
	'palette',
]);

const ICON_TOKENS = new Set(['icon', 'svg']);
const UNIT_TOKENS = new Set(['unit']);

const tokenize = value =>
	String(value || '')
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.filter(Boolean);

export const inferAttributeType = name => {
	const tokens = tokenize(name);

	if (tokens.some(token => UNIT_TOKENS.has(token))) {
		return ATTRIBUTE_TYPES.UNIT;
	}

	if (tokens.some(token => ICON_TOKENS.has(token))) {
		return ATTRIBUTE_TYPES.ICON;
	}

	if (tokens.some(token => COLOR_TOKENS.has(token))) {
		return ATTRIBUTE_TYPES.COLOR;
	}

	if (tokens.some(token => BOOLEAN_TOKENS.has(token))) {
		return ATTRIBUTE_TYPES.BOOLEAN;
	}

	if (tokens.some(token => NUMBER_TOKENS.has(token))) {
		return ATTRIBUTE_TYPES.NUMBER;
	}

	return ATTRIBUTE_TYPES.STRING;
};

export const buildAliases = name => {
	const tokens = tokenize(name);
	const filtered = tokens.filter(
		token =>
			![
				'general',
				'hover',
				'focus',
				'active',
				'xs',
				's',
				'm',
				'l',
				'xl',
				'xxl',
			].includes(token)
	);

	const aliases = new Set(filtered);

	if (filtered.includes('background')) {
		aliases.add('bg');
	}
	if (filtered.includes('color')) {
		aliases.add('fg');
	}
	if (filtered.includes('typography')) {
		aliases.add('font');
	}

	return Array.from(aliases);
};

export const normalizeAttributeName = name =>
	String(name || '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.toLowerCase();
