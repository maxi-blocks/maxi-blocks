/**
 * Internal dependencies
 */
import createTransitionObj from '@extensions/styles/transitions/createTransitionObj';

const NAME = 'Slider Transition Migrator';

const isEligible = attributes => {
	const { transition } = attributes;
	if (!transition?.block) return false;

	return (
		!transition.block['arrow size'] ||
		!transition.block['dot size']
	);
};

const migrate = attributes => {
	const { transition } = attributes;

	if (!transition?.block) return attributes;

	// Deep clone to avoid mutation side effects if needed, 
	// but here we are modifying the object found in attributes which is standard for migrators
	// typically we return a new attributes object.
	
	const newTransition = {
		...transition,
		block: {
			...transition.block,
		},
	};

	if (!newTransition.block['arrow size']) {
		newTransition.block['arrow size'] = createTransitionObj();
	}

	if (!newTransition.block['dot size']) {
		newTransition.block['dot size'] = createTransitionObj();
	}

	return {
		...attributes,
		transition: newTransition,
	};
};

export default {
	name: NAME,
	isEligible,
	migrate,
};
