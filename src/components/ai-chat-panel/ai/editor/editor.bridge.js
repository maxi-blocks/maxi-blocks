const getBlockEditor = () =>
	typeof window !== 'undefined' && window.wp?.data
		? window.wp.data
		: null;

export const getSelectedClientIds = () => {
	const data = getBlockEditor();
	if (!data) return [];
	const selector = data.select('core/block-editor');
	return selector?.getSelectedBlockClientIds?.() || [];
};

export const getBlockAttributes = clientId => {
	const data = getBlockEditor();
	if (!data) return {};
	const selector = data.select('core/block-editor');
	return selector?.getBlockAttributes?.(clientId) || {};
};

export const updateBlockAttributes = (clientId, attributes) => {
	const data = getBlockEditor();
	if (!data) return null;
	const dispatch = data.dispatch('core/block-editor');
	return dispatch?.updateBlockAttributes?.(clientId, attributes);
};

export const getBlocks = () => {
	const data = getBlockEditor();
	if (!data) return [];
	const selector = data.select('core/block-editor');
	return selector?.getBlocks?.() || [];
};

export default {
	getSelectedClientIds,
	getBlockAttributes,
	updateBlockAttributes,
	getBlocks,
};
