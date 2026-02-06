import { ActionTypes, ACTION_VERSION, isMaxiActionEnvelope } from './actions.schema';
import { validateAttributesForBlock } from '../attributes/attributes.validate';

const isStringArray = value =>
	Array.isArray(value) && value.every(item => typeof item === 'string');

export const validateActionEnvelope = envelope => {
	const errors = [];
	if (!envelope || typeof envelope !== 'object') {
		return { ok: false, errors: ['Envelope must be an object.'] };
	}
	if (envelope.version !== ACTION_VERSION) {
		errors.push('Unsupported action version.');
	}
	if (!Array.isArray(envelope.actions)) {
		errors.push('Actions must be an array.');
	}
	return { ok: errors.length === 0, errors };
};

export const validateAction = action => {
	const errors = [];
	if (!action || typeof action !== 'object') {
		return { ok: false, errors: ['Action must be an object.'] };
	}
	if (!action.type || !Object.values(ActionTypes).includes(action.type)) {
		errors.push('Unknown action type.');
	}
	return { ok: errors.length === 0, errors };
};

export const validateUpdateAttributesAction = action => {
	const errors = [];
	if (!action.target || !action.target.scope) {
		errors.push('Target scope is required.');
	} else if (
		!['selected', 'clientIds'].includes(action.target.scope)
	) {
		errors.push('Unsupported target scope.');
	}

	if (action.target?.scope === 'clientIds' && !isStringArray(action.target.clientIds)) {
		errors.push('Target clientIds must be an array of strings.');
	}

	const blockName = action.block?.name || action.block?.blockName || action.blockName || action.block;
	if (!blockName) {
		errors.push('Block name is required for attribute validation.');
	}

	if (!action.attributes || typeof action.attributes !== 'object') {
		errors.push('Attributes must be an object.');
	}

	if (errors.length) {
		return { ok: false, errors };
	}

	const validation = validateAttributesForBlock(blockName, action.attributes);
	if (!validation.ok) {
		validation.errors.forEach(entry => {
			errors.push(`Invalid attribute: ${entry.attribute}`);
		});
	}

	return {
		ok: errors.length === 0,
		errors,
		normalizedAttributes: validation.normalized,
		blockName,
	};
};

export const validateActionEnvelopeDeep = envelope => {
	const errors = [];
	if (!isMaxiActionEnvelope(envelope)) {
		return { ok: false, errors: ['Invalid action envelope.'] };
	}

	const normalizedActions = [];

	for (const action of envelope.actions) {
		const base = validateAction(action);
		if (!base.ok) {
			errors.push(...base.errors);
			continue;
		}

		if (action.type === ActionTypes.UPDATE_ATTRIBUTES) {
			const result = validateUpdateAttributesAction(action);
			if (!result.ok) {
				errors.push(...result.errors);
				continue;
			}
			normalizedActions.push({
				...action,
				block: { name: result.blockName },
				attributes: result.normalizedAttributes,
			});
			continue;
		}

		normalizedActions.push(action);
	}

	return { ok: errors.length === 0, errors, actions: normalizedActions };
};

export default validateActionEnvelopeDeep;
