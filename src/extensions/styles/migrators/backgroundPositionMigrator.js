const axis = ['top', 'left', 'bottom', 'right'];

const positionArray = axis.map(a => `position-${a}-unit-general`);

const getLayerType = layer => {
	let { type } = layer;

	if (type === 'shape') type = 'svg';
	else type = `${type}-wrapper`;

	return type;
};

const name = 'Background Position';

const isEligible = blockAttributes =>
	blockAttributes['background-layers']?.some(
		layer =>
			!positionArray.every(
				unit => `background-${getLayerType(layer)}-${unit}` in layer
			)
	);

const migrate = newAttributes => {
	const response = { ...newAttributes };

	response['background-layers'].forEach((layer, i) => {
		const type = getLayerType(layer);

		positionArray.forEach(unit => {
			if (!(`background-${type}-${unit}` in layer))
				response['background-layers'][i][`background-${type}-${unit}`] =
					'px';
		});
	});

	return response;
};

export default { name, isEligible, migrate };
