import { ActionTypes } from './actions.schema';
import validateActionEnvelopeDeep from './actions.validate';
import editorBridgeDefault from '../editor/editor.bridge';

const resolveTargetClientIds = (action, editorBridge) => {
	if (action.target?.scope === 'clientIds') {
		return action.target.clientIds || [];
	}
	return editorBridge.getSelectedClientIds();
};

export const executeActionEnvelope = (
	envelope,
	{ editorBridge = editorBridgeDefault, validate = true } = {}
) => {
	const validation = validate
		? validateActionEnvelopeDeep(envelope)
		: { ok: true, actions: envelope.actions || [] };

	if (!validation.ok) {
		return { ok: false, errors: validation.errors };
	}

	const results = [];

	for (const action of validation.actions) {
		if (action.type !== ActionTypes.UPDATE_ATTRIBUTES) {
			results.push({ action, skipped: true });
			continue;
		}

		const clientIds = resolveTargetClientIds(action, editorBridge);
		for (const clientId of clientIds) {
			editorBridge.updateBlockAttributes(clientId, action.attributes);
			results.push({ action, clientId, applied: true });
		}
	}

	return { ok: true, results };
};

export default executeActionEnvelope;
