export const ACTION_VERSION = 1;

export const ActionTypes = {
	UPDATE_ATTRIBUTES: 'update_attributes',
};

export const isMaxiActionEnvelope = obj =>
	!!obj &&
	obj.version === ACTION_VERSION &&
	Array.isArray(obj.actions);

export const isUpdateAttributesAction = action =>
	action && action.type === ActionTypes.UPDATE_ATTRIBUTES;

export const createActionEnvelope = ({ explain = '', actions = [] } = {}) => ({
	version: ACTION_VERSION,
	explain,
	actions,
});
