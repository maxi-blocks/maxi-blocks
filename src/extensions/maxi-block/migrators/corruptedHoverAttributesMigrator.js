const name = 'Corrupted Hover Attributes';

const maxiVersions = [
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
];

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	const corruptedAttributes = [
		'border-status-hover',
		'box-shadow-status-hover',
		'background-status-hover',
		'svg-status-hover',
	];

	return (
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin) &&
		Object.entries(blockAttributes).some(
			([key, val]) =>
				val &&
				corruptedAttributes.some(attrKey => key.includes(attrKey))
		)
	);
};

const migrate = newAttributes => {
	const response = { ...newAttributes };

	Object.entries(response).forEach(([key, val]) => {
		if (val === response[`${key}-hover`]) delete response[`${key}-hover`];
	});

	return response;
};

export default { name, isEligible, migrate };
