/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const name = 'IB disable transition for alignment';

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;

	if (!relations || isEmpty(relations)) return false;

	return relations.some(
		relation =>
			relation.settings === 'Alignment' &&
			!relation.effects.disableTransition
	);
};

const migrate = newAttributes => {
	const { relations } = newAttributes;

	const newRelations = [...relations];

	newRelations.forEach(relation => {
		if (relation.settings === 'Alignment')
			relation.effects.disableTransition = true;
	});

	return { ...newAttributes, relations: newRelations };
};

export default { name, isEligible, migrate };
