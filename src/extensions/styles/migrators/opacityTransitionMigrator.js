import transitionAttributesCreator from '../transitions/transitionAttributesCreator';

const name = 'Opacity Transition Migrator';

const isEligible = blockAttributes => {
	const { transition } = blockAttributes;
	if (!transition) return false;

	return Object.values(transition).every(
		category => !Object.keys(category).includes('opacity')
	);
};

const migrate = newAttributes => ({
	...newAttributes,
	transition: {
		...newAttributes.transition,
		canvas: {
			...newAttributes.transition?.canvas,
			opacity:
				transitionAttributesCreator().transition.default.canvas.opacity,
		},
	},
});

export default { name, isEligible, migrate };
