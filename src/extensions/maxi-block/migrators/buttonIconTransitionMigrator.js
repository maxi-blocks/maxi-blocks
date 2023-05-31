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
	if (newAttributes.transition.b.i) {
		NEW_KEYS.forEach(key => {
			newAttributes.transition.b[key] = {
				...newAttributes.transition.b.i,
			};
		});

		delete newAttributes.transition.b.i;
	}

	return newAttributes;
};

export default { name, isEligible, migrate };
