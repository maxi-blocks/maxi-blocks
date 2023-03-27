/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const name = 'IB Transform Target';

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;

	if (!relations || isEmpty(relations)) return false;

	const isBrokenTarget = relations.some(relation => {
		if (relation.settings !== 'Transform') return false;

		if (relation.css?.['']?.['']) return true;

		return false;
	});

	return isBrokenTarget;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;

	const newRelations = [...relations];

	newRelations.forEach((relation, i) => {
		if (relation.settings !== 'Transform') return;

		const { css } = relation;

		if (css['']['']) newRelations[i].css = { '': { ...css[''][''] } };
	});

	return { ...newAttributes, relations: newRelations };
};

export default { name, isEligible, migrate };
