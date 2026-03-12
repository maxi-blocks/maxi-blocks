const createPendingCustomData = () => Object.create(null);

let pendingCustomData = createPendingCustomData();
let flushScheduled = false;

const hasPendingCustomDataTarget = target =>
	Object.prototype.hasOwnProperty.call(pendingCustomData, target);

const getScheduler = () => {
	if (typeof queueMicrotask === 'function') {
		return queueMicrotask;
	}

	return callback => Promise.resolve().then(callback);
};

export const clearPendingCustomData = () => {
	pendingCustomData = createPendingCustomData();
	flushScheduled = false;
};

export const getPendingCustomData = () => pendingCustomData;

export const hasPendingCustomData = () =>
	Object.keys(pendingCustomData).length > 0;

export const mergePendingCustomData = customData => {
	if (!hasPendingCustomData()) {
		return customData;
	}

	return {
		...(customData || {}),
		...pendingCustomData,
	};
};

export const queuePendingCustomData = customData => {
	if (!customData || !Object.keys(customData).length) {
		return false;
	}

	pendingCustomData = {
		...pendingCustomData,
		...customData,
	};

	return true;
};

export const removePendingCustomData = targets => {
	const targetList = Array.isArray(targets) ? targets : [targets];

	if (!targetList.length || !hasPendingCustomData()) {
		return;
	}

	const nextPendingCustomData = { ...pendingCustomData };
	let didChange = false;

	targetList.forEach(target => {
		if (hasPendingCustomDataTarget(target)) {
			delete nextPendingCustomData[target];
			didChange = true;
		}
	});

	if (didChange) {
		pendingCustomData = nextPendingCustomData;
	}
};

export const schedulePendingCustomDataFlush = flushCallback => {
	if (flushScheduled) {
		return;
	}

	flushScheduled = true;

	getScheduler()(() => {
		flushScheduled = false;

		if (!hasPendingCustomData()) {
			return;
		}

		const customDataToFlush = pendingCustomData;
		pendingCustomData = createPendingCustomData();
		flushCallback(customDataToFlush);
	});
};
