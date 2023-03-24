const prefixes = [
	'block',
	'button',
	'content',
	'header',
	'input',
	'overlay',
	'svg',
	'video',
];

const name = 'Hover status';

const attributes = () =>
	prefixes.reduce((acc, prefix) => {
		acc[`${prefix}-background-hover-status`] = {
			type: 'boolean',
		};
		return acc;
	}, {});

const isEligible = blockAttributes =>
	Object.keys(blockAttributes).some(key =>
		key.includes('background-hover-status')
	);

const migrate = newAttributes => {
	Object.entries(newAttributes).forEach(([key, attr]) => {
		if (key.includes('background-hover-status')) {
			const newKey = key.replace('hover-status', 'status-hover');
			newAttributes[newKey] = attr;

			delete newAttributes[key];
		}
	});

	return newAttributes;
};

export default { name, isEligible, attributes, migrate };
