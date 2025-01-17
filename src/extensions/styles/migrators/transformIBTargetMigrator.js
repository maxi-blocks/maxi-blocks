/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

// Constants
const NAME = 'IB Transform Target';

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;

	// Early return for quick fails
	if (!relations || isEmpty(relations)) return false;

	// Use for...of for better performance with break capability
	for (const relation of relations) {
		if (relation.settings !== 'Transform') continue;
		if (relation.css?.['']?.['']) return true;
	}

	return false;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;
	if (!relations) return newAttributes;

	const newRelations = [...relations];

	// Use for...of for better performance
	for (let i = 0; i < newRelations.length; i++) {
		const relation = newRelations[i];
		if (relation.settings !== 'Transform') continue;

		const { css } = relation;
		if (!css?.['']?.['']) continue;

		// Direct property mutation for better performance
		newRelations[i].css = { '': { ...css[''][''] } };
	}

	return { ...newAttributes, relations: newRelations };
};

export default { name: NAME, isEligible, migrate };
