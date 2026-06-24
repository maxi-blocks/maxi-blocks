import { MAXI_COLOR_TOKENS } from './maxiColorTokens';

export const MAXI_COLOR_VARIABLES = MAXI_COLOR_TOKENS.map(token => ({
	name: token.name,
	value: token.var || token.name,
	hex: token.hex || null,
}));

export const findColorToken = name => {
	if (!name) return null;
	const needle = String(name).toLowerCase();
	return MAXI_COLOR_VARIABLES.find(
		token => String(token.name).toLowerCase() === needle
	);
};

export default MAXI_COLOR_VARIABLES;
