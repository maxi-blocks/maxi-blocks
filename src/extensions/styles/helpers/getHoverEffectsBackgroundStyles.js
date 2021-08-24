/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

const getHoverEffectsBackgroundStyles = (props, parentBlockStyle) => {
	const response = {
		general: {},
	};

	if (props['hover-background-active-media'] === 'color') {
		if (!props['hover-background-palette-color-status'])
			response.general['background-color'] =
				props['hover-background-color'];
		else
			response.general['background-color'] = getColorRGBAString({
				firstVar: `color-${props['hover-background-palette-color']}`,
				opacity: props['hover-background-palette-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	if (props['hover-background-active-media'] === 'gradient') {
		const newhoverBackgroundGradient = props['hover-background-gradient']
			?.replace(/rgb\(/g, 'rgba(')
			.replace(
				/\((\d+),(\d+),(\d+)\)/g,
				`($1,$2,$3,${props['hover-background-gradient-opacity'] || 1})`
			);

		response.general.background = newhoverBackgroundGradient;
	}

	return response;
};

export default getHoverEffectsBackgroundStyles;
