const name = 'Background Size';

const isEligible = blockAttributes =>
	blockAttributes['background-layers']?.some(layer =>
		Object.keys(layer).some(
			key => key.includes('wrapper-size') || key.includes('svg-size')
		)
	);

const migrate = newAttributes => {
	newAttributes['background-layers'].forEach((layer, index) =>
		Object.entries(layer).forEach(([key, value]) => {
			if (key.includes('wrapper-size') || key.includes('svg-size')) {
				newAttributes['background-layers'][index][
					key.replace('size', 'width')
				] = value;

				delete newAttributes['background-layers'][index][key];
			}
		})
	);

	return newAttributes;
};

export default { name, isEligible, migrate };
