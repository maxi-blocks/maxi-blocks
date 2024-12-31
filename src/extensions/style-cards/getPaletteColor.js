/**
 * Internal dependencies
 */
import getBlockStyle from '@extensions/styles/getBlockStyle';
import getActiveStyleCard from './getActiveStyleCard';

const getPaletteColor = ({ clientId, color, blockStyle: rawBlockStyle }) => {
	const activeStyleCard = getActiveStyleCard();
	const blockStyle = rawBlockStyle ?? getBlockStyle(clientId);

	if (
		!activeStyleCard ||
		!activeStyleCard.value ||
		Object.keys(activeStyleCard.value).length === 0
	) {
		return getComputedStyle(document.documentElement).getPropertyValue(
			`--maxi-${blockStyle}-color-${color}`
		);
	}

	const SCValue = activeStyleCard.value;

	return (
		SCValue[blockStyle]?.styleCard?.color?.[color] ||
		SCValue[blockStyle]?.defaultStyleCard?.color?.[color]
	);
};

export default getPaletteColor;
