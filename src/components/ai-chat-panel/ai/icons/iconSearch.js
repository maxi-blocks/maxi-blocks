const ICON_CATALOG = [
	{ name: 'arrow-right', category: 'arrows' },
	{ name: 'arrow-left', category: 'arrows' },
	{ name: 'arrow-up', category: 'arrows' },
	{ name: 'arrow-down', category: 'arrows' },
	{ name: 'search', category: 'ui' },
	{ name: 'close', category: 'ui' },
	{ name: 'plus', category: 'ui' },
	{ name: 'minus', category: 'ui' },
	{ name: 'check', category: 'ui' },
	{ name: 'star', category: 'shapes' },
];

export const searchIcons = (query = '', { limit = 8 } = {}) => {
	const needle = String(query || '').toLowerCase();
	const results = ICON_CATALOG.filter(icon =>
		icon.name.toLowerCase().includes(needle)
	);
	return results.slice(0, limit);
};

export default searchIcons;
