/**
 * Internal dependencies
 */
import getBlockStyle from '../styles/getBlockStyle';
import getActiveStyleCard from './getActiveStyleCard';

const getPaletteColor = ({ clientId, color, blockStyle: rawBlockStyle }) => {
	const SCValue = getActiveStyleCard().value;

	const blockStyle = rawBlockStyle ?? getBlockStyle(clientId);

	return (
		SCValue?.[blockStyle].styleCard?.color?.[color] ||
		SCValue?.[blockStyle].defaultStyleCard?.color?.[color] ||
		getComputedStyle(document.documentElement).getPropertyValue(
			`--maxi-${blockStyle}-color-${color}`
		)
	);
};

export default getPaletteColor;
