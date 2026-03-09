import { ActionTypes } from './actions.schema';
import validateActionEnvelopeDeep from './actions.validate';
import editorBridgeDefault from '../editor/editor.bridge';

const resolveTargetClientIds = (action, editorBridge) => {
	if (action.target?.scope === 'clientIds') {
		return action.target.clientIds || [];
	}
	return editorBridge.getSelectedClientIds();
};

const diffAttributes = (current = {}, next = {}) => {
	const changes = [];
	for (const [key, value] of Object.entries(next)) {
		const prev = current[key];
		if (prev !== value) {
			changes.push({ key, from: prev, to: value });
		}
	}
	return changes;
};

export const planActionEnvelope = (
	envelope,
	{ editorBridge = editorBridgeDefault, validate = true } = {}
) => {
	const validation = validate
		? validateActionEnvelopeDeep(envelope)
		: { ok: true, actions: envelope.actions || [] };

	if (!validation.ok) {
		return { ok: false, errors: validation.errors };
	}

	const plan = [];

	for (const action of validation.actions) {
		if (action.type !== ActionTypes.UPDATE_ATTRIBUTES) {
			continue;
		}

		const clientIds = resolveTargetClientIds(action, editorBridge);
		for (const clientId of clientIds) {
			const current = editorBridge.getBlockAttributes(clientId);
			const changes = diffAttributes(current, action.attributes);
			plan.push({ clientId, changes });
		}
	}

	return { ok: true, plan };
};

export default planActionEnvelope;
