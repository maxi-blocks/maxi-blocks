const toKebab = value =>
	String(value || '')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[._\s]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase();

export const normalizePathInput = input => toKebab(input);

export const toAttributeKey = input => toKebab(input);

export const splitPath = input =>
	String(input || '')
		.split('.')
		.map(segment => segment.trim())
		.filter(Boolean);

export const joinPath = segments =>
	segments
		.map(segment => String(segment || '').trim())
		.filter(Boolean)
		.join('.');
