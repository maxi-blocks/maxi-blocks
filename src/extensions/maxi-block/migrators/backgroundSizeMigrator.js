const name = 'Background Size';

const isEligible = blockAttributes =>
	blockAttributes.b_ly?.some(layer =>
		Object.keys(layer).some(
			key => key.includes('wrapper-size') || key.includes('svg-size')
		)
	);

const migrate = newAttributes => {
	newAttributes.b_ly.forEach((layer, index) =>
		Object.entries(layer).forEach(([key, value]) => {
			if (key.includes('wrapper-size') || key.includes('svg-size')) {
				newAttributes.b_ly[index][key.replace('size', 'width')] = value;

				delete newAttributes.b_ly[index][key];
			}
		})
	);

	return newAttributes;
};

export default { name, isEligible, migrate };
