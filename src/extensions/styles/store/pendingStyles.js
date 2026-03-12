const createPendingStyles = () => Object.create(null);

let pendingStyles = createPendingStyles();
let flushScheduled = false;

const hasPendingStyle = target =>
	Object.prototype.hasOwnProperty.call(pendingStyles, target);

const getScheduler = () => {
	if (typeof queueMicrotask === 'function') {
		return queueMicrotask;
	}

	return callback => Promise.resolve().then(callback);
};

export const clearPendingStyles = () => {
	pendingStyles = createPendingStyles();
	flushScheduled = false;
};

export const getPendingStyle = target =>
	hasPendingStyle(target) ? pendingStyles[target] : undefined;

export const getPendingStyles = () => pendingStyles;

export const hasPendingStyles = () => Object.keys(pendingStyles).length > 0;

export const mergePendingStyles = styles => {
	if (!hasPendingStyles()) {
		return styles;
	}

	return {
		...(styles || {}),
		...pendingStyles,
	};
};

export const queuePendingStyles = styles => {
	if (!styles || !Object.keys(styles).length) {
		return false;
	}

	pendingStyles = {
		...pendingStyles,
		...styles,
	};

	return true;
};

export const removePendingStyles = targets => {
	const targetList = Array.isArray(targets) ? targets : [targets];

	if (!targetList.length || !hasPendingStyles()) {
		return;
	}

	const nextPendingStyles = { ...pendingStyles };
	let didChange = false;

	targetList.forEach(target => {
		if (Object.prototype.hasOwnProperty.call(nextPendingStyles, target)) {
			delete nextPendingStyles[target];
			didChange = true;
		}
	});

	if (didChange) {
		pendingStyles = nextPendingStyles;
	}
};

export const schedulePendingStylesFlush = flushCallback => {
	if (flushScheduled) {
		return;
	}

	flushScheduled = true;

	getScheduler()(() => {
		flushScheduled = false;

		if (!hasPendingStyles()) {
			return;
		}

		const stylesToFlush = pendingStyles;
		pendingStyles = createPendingStyles();
		flushCallback(stylesToFlush);
	});
};
