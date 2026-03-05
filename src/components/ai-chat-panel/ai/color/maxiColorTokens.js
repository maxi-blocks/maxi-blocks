export const MAXI_COLOR_TOKENS = [
	{ name: 'primary', var: 'var(--maxi-primary-color)', hex: null },
	{ name: 'secondary', var: 'var(--maxi-secondary-color)', hex: null },
	{ name: 'accent', var: 'var(--maxi-accent-color)', hex: null },
	{ name: 'light', var: 'var(--maxi-light-color)', hex: null },
	{ name: 'dark', var: 'var(--maxi-dark-color)', hex: null },
	{ name: 'black', var: 'var(--maxi-black)', hex: '#000000' },
	{ name: 'white', var: 'var(--maxi-white)', hex: '#ffffff' },
];

const toKey = value => String(value || '').toLowerCase();

export const findTokenByName = name =>
	MAXI_COLOR_TOKENS.find(token => toKey(token.name) === toKey(name));

export const findTokenForHex = hexValue => {
	const normalized = toKey(hexValue);
	return MAXI_COLOR_TOKENS.find(
		token => token.hex && toKey(token.hex) === normalized
	);
};
