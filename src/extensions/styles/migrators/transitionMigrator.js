const NEW_KEYS = ['icon colour', 'icon width', 'icon background', 'icon border'];

const isEligible = blockAttributes => {
	const { transition } = blockAttributes;

	if (transition && transition.block.icon) {
		return true;
	}

	return false;
};

const migrate = ({ newAttributes }) => {
	const { transition } = newAttributes;

	if (transition.block.icon) {
		NEW_KEYS.forEach(key => {
			transition.block[key] = {
				...transition.block.icon,
			};
		});
	}

	delete transition.block.icon;

	return newAttributes;
};

export default { isEligible, migrate };
