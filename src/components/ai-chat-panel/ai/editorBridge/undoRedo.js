export const withUndo = (label, fn) => {
	if (typeof fn !== 'function') return undefined;
	return fn();
};

export default withUndo;
