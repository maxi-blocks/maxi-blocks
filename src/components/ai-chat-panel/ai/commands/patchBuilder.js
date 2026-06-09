export const createSetOp = (path, value) => ({
	op: 'set',
	path,
	value,
});

export const createResetOp = (path, value = null) => ({
	op: 'reset',
	path,
	value,
});

export const createToggleOp = path => ({
	op: 'toggle',
	path,
});

export const createIncrementOp = (path, amount) => ({
	op: 'increment',
	path,
	amount,
});

export const createMergeOp = (path, value) => ({
	op: 'merge',
	path,
	value,
});

export const createAddOp = (path, value) => ({
	op: 'add',
	path,
	value,
});

export const createRemoveOp = (path, value) => ({
	op: 'remove',
	path,
	value,
});

export const buildPatch = ops => {
	if (!ops) return [];
	if (Array.isArray(ops)) return ops.filter(Boolean);
	return [ops].filter(Boolean);
};
