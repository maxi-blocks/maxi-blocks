/**
 * Internal dependencies
 */
import { getBlockStyle } from '../styles';
import getActiveStyleCard from './getActiveStyleCard';

const getPaletteColor = (clientId, color) => {
	const SCValue = getActiveStyleCard().value;
	const parentBlockStyle = getBlockStyle(clientId);

	return (
		SCValue[parentBlockStyle].styleCard?.color?.[color] ||
		SCValue[parentBlockStyle].defaultStyleCard?.color?.[color]
	);
};

export default getPaletteColor;
