import { ActionTypes, ACTION_VERSION } from './actions.schema';

export const buildUndoEnvelope = (plan, { blockName } = {}) => {
	const actions = [];
	for (const entry of plan || []) {
		const attributes = {};
		for (const change of entry.changes || []) {
			attributes[change.key] = change.from;
		}
		actions.push({
			type: ActionTypes.UPDATE_ATTRIBUTES,
			target: {
				scope: 'clientIds',
				clientIds: [entry.clientId],
			},
			block: blockName ? { name: blockName } : undefined,
			attributes,
		});
	}

	return {
		version: ACTION_VERSION,
		explain: 'Undo changes',
		actions,
	};
};

export default buildUndoEnvelope;
