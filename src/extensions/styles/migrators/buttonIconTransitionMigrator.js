const NEW_KEYS = [
	'icon colour',
	'icon width',
	'icon background',
	'icon border',
];

const name = 'Transition Block Icon';

const isEligible = blockAttributes =>
	!!blockAttributes?.transition?.block?.icon;

const migrate = newAttributes => {
	const { transition } = newAttributes;

	if (transition.block.icon) {
		NEW_KEYS.forEach(key => {
			transition.block[key] = {
				...transition.block.icon,
			};
		});

		delete transition.block.icon;
	}

	return newAttributes;
};

export default { name, isEligible, migrate };
