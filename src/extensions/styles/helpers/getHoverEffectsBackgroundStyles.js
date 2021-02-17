const getHoverEffectsBackgroundStyles = props => {
	const response = {
		general: {},
	};

	if (props['hover-background-active-media'] === 'color')
		response.general['background-color'] = props['hover-background-color'];

	if (props['hover-background-active-media'] === 'gradient') {
		response.general.background = props['hover-background-gradient'];
	}

	return response;
};

export default getHoverEffectsBackgroundStyles;
