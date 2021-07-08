const getHoverEffectsBackgroundStyles = (props, parentBlockStyle) => {
	const response = {
		general: {},
	};

	if (props['hover-background-active-media'] === 'color') {
		if (!props['hover-background-palette-color-status'])
			response.general['background-color'] =
				props['hover-background-color'];
		else
			response.general[
				'background-color'
			] = `var(--maxi-${parentBlockStyle}-color-${props['hover-background-palette-color']})`;
	}

	if (props['hover-background-active-media'] === 'gradient') {
		response.general.background = props['hover-background-gradient'];
	}

	return response;
};

export default getHoverEffectsBackgroundStyles;
