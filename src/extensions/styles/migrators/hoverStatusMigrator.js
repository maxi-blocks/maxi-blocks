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

const attributes = () =>
	prefixes.reduce((acc, prefix) => {
		acc[`${prefix}-background-hover-status`] = {
			type: 'boolean',
		};
		return acc;
	}, {});

const isEligible = blockAttributes => {
	console.log(blockAttributes);
	return Object.keys(blockAttributes).some(key =>
		key.includes('background-hover-status')
	);
};

const migrate = ({ newAttributes }) => {
	console.log(newAttributes);
	Object.entries(newAttributes).forEach(([key, attr]) => {
		if (key.includes('background-hover-status')) {
			const newKey = key.replace('hover-status', 'status-hover');
			newAttributes[newKey] = attr;

			delete newAttributes[key];
		}
	});

	return newAttributes;
};

export default { isEligible, attributes, migrate };
