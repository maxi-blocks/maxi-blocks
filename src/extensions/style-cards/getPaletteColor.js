/**
 * Internal dependencies
 */
import { getBlockStyle } from '../styles';
import getActiveStyleCard from './getActiveStyleCard';

const getPaletteColor = ({ clientId, color, blockStyle }) => {
	const SCValue = getActiveStyleCard().value;
	const parentBlockStyle = blockStyle ?? getBlockStyle(clientId);

	return (
		SCValue?.[parentBlockStyle].styleCard?.color?.[color] ||
		SCValue?.[parentBlockStyle].defaultStyleCard?.color?.[color] ||
		getComputedStyle(document.documentElement).getPropertyValue(
			`--maxi-${parentBlockStyle}-color-${color}`
		)
	);
};

export default getPaletteColor;
