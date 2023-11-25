/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
import processRelations from '../src/extensions/relations/processRelations';

window.addEventListener('DOMContentLoaded', () => {
	let relations;

	if (typeof maxiRelations?.[0] === 'string') {
		try {
			relations = JSON.parse(maxiRelations?.[0]);
		} catch (e) {
			console.error('Invalid JSON string', e);
			relations = null;
		}
	} else if (
		typeof maxiRelations?.[0] === 'object' &&
		maxiRelations?.[0] !== null
	) {
		relations = maxiRelations?.[0];
	}

	processRelations(relations);
});
