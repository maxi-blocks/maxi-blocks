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
	if (newAttributes.transition.block.icon) {
		NEW_KEYS.forEach(key => {
			newAttributes.transition.block[key] = {
				...newAttributes.transition.block.icon,
			};
		});

		delete newAttributes.transition.block.icon;
	}

	return newAttributes;
};

export default { name, isEligible, migrate };
