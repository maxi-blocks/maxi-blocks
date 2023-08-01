const updateNCLimits = (updatedAttributes, blockAttributes) => {
	if (
		'number-counter-circle-status' in updatedAttributes &&
		updatedAttributes['number-counter-circle-status'] === false
	) {
		['number-counter-start', 'number-counter-end'].forEach(key => {
			if (blockAttributes[key] > 100) {
				updatedAttributes[key] = key.includes('start') ? 0 : 100;
			}
		});
	}
};

export default updateNCLimits;
