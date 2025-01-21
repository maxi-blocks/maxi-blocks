// Constants for better performance and memory usage
const NEW_KEYS = Object.freeze([
	'icon colour',
	'icon width',
	'icon background',
	'icon border',
]);

const NAME = 'Transition Block Icon';

const isEligible = blockAttributes => {
	const transition = blockAttributes?.transition;
	return transition?.block?.icon != null;
};

const migrate = newAttributes => {
	const { transition } = newAttributes;
	if (!transition?.block?.icon) return newAttributes;

	const { block } = transition;
	const iconData = block.icon;


	for (let i = 0; i < NEW_KEYS.length; i++) {
		block[NEW_KEYS[i]] = iconData;
	}

	// Direct deletion instead of creating new object
	delete block.icon;

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
