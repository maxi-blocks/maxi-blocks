const DEBUG_STATE_KEY = '__maxiIBDebug';
const DEBUG_FLAG_KEY = '__MAXI_IB_DEBUG__';
const DEBUG_STORAGE_KEY = 'maxiBlocks-ib-debug';
const MAX_EVENTS = 200;

const getRoot = () => {
	if (typeof window !== 'undefined') return window;
	if (typeof globalThis !== 'undefined') return globalThis;

	return null;
};

const getStorageValue = (root, key) => {
	try {
		return root?.localStorage?.getItem(key);
	} catch {
		return null;
	}
};

const getIsTestEnv = () =>
	typeof process !== 'undefined' &&
	process.env &&
	process.env.NODE_ENV === 'test';

const getIsLocalHost = root => {
	const hostname = root?.location?.hostname;

	return ['localhost', '127.0.0.1', '::1'].includes(hostname);
};

export const getIsIBDebugEnabled = () => {
	const root = getRoot();
	if (!root) return false;

	if (root[DEBUG_FLAG_KEY] === false) return false;
	if (root[DEBUG_FLAG_KEY] === true) return true;
	if (getIsTestEnv()) return false;

	const storageValue = getStorageValue(root, DEBUG_STORAGE_KEY);

	if (storageValue === 'false') return false;
	if (storageValue === 'true') return true;

	return getIsLocalHost(root);
};

const getDebugState = root => {
	if (!root[DEBUG_STATE_KEY]) {
		root[DEBUG_STATE_KEY] = {
			events: [],
		};
	}

	return root[DEBUG_STATE_KEY];
};

export const summarizeRelation = relation => {
	if (!relation) return relation;

	const getKeys = value =>
		value && typeof value === 'object' ? Object.keys(value) : [];

	return {
		id: relation.id,
		title: relation.title,
		uniqueID: relation.uniqueID,
		target: relation.target,
		action: relation.action,
		sid: relation.sid,
		attributeKeys: getKeys(relation.attributes),
		cssKeys: getKeys(relation.css),
		effectKeys: getKeys(relation.effects),
	};
};

export const summarizeRelations = relations =>
	(relations || []).map(relation => summarizeRelation(relation));

export const debugIB = (event, details = {}) => {
	if (!getIsIBDebugEnabled()) return null;

	const root = getRoot();
	if (!root) return null;

	const entry = {
		time: new Date().toISOString(),
		event,
		details,
	};
	const state = getDebugState(root);

	state.events.push(entry);
	if (state.events.length > MAX_EVENTS) {
		state.events.splice(0, state.events.length - MAX_EVENTS);
	}

	if (root.console?.debug) {
		root.console.debug(`[MaxiBlocks IB] ${event}`, details);
	}

	return entry;
};
