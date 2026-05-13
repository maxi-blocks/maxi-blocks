const PROFILE_FLAGS = [
	'__MAXI_PROFILE_MAXI_BLOCKS__',
	'__MAXI_PROFILE__',
	'maxiBlocksDebug',
];

const STORAGE_KEYS = ['maxiBlocks-profile', 'maxiBlocks-debug'];
const AUTO_PROFILE_DURATION = 30000;
const BOOST_PROFILE_DURATION = 10000;
const IS_DEBUG_BUILD =
	typeof process !== 'undefined' &&
	process.env &&
	process.env.NODE_ENV === 'development';
let cachedIsProfileEnabled = false;
let lastProfileCheck = 0;
let autoProfileUntil = 0;
let autoProfileInitialized = false;
let hasCheckedProfileStorage = false;

const getRoot = () => {
	if (typeof window !== 'undefined') return window;
	if (typeof globalThis !== 'undefined') return globalThis;

	return null;
};

const getNow = () => {
	if (typeof performance !== 'undefined' && performance.now) {
		return performance.now();
	}

	return Date.now();
};

const getLocalStorage = root => {
	try {
		return root?.localStorage || null;
	} catch {
		return null;
	}
};

const getProfileStorageValue = (storage, key) => {
	if (!storage) return null;

	try {
		return storage.getItem(key);
	} catch {
		return null;
	}
};

const hasProfileFlag = root => PROFILE_FLAGS.some(flag => root?.[flag]);

export const getIsProfileEnabled = () => {
	const root = getRoot();
	if (!root) {
		cachedIsProfileEnabled = false;
		return cachedIsProfileEnabled;
	}

	const hasRuntimeProfileFlag = hasProfileFlag(root);
	if (
		!IS_DEBUG_BUILD &&
		!hasRuntimeProfileFlag &&
		!cachedIsProfileEnabled &&
		!autoProfileUntil &&
		hasCheckedProfileStorage
	)
		return false;

	const storage = getLocalStorage(root);
	hasCheckedProfileStorage = true;
	const storageProfileValue = getProfileStorageValue(
		storage,
		'maxiBlocks-profile'
	);

	if (storageProfileValue === 'false') {
		autoProfileUntil = 0;
		cachedIsProfileEnabled = false;
		return cachedIsProfileEnabled;
	}

	const hasExplicitOptIn =
		hasRuntimeProfileFlag ||
		storageProfileValue === 'true' ||
		STORAGE_KEYS.some(
			key => getProfileStorageValue(storage, key) === 'true'
		);

	if (
		!IS_DEBUG_BUILD &&
		!hasExplicitOptIn &&
		!cachedIsProfileEnabled &&
		!autoProfileUntil
	)
		return false;

	const now = Date.now();
	if (now - lastProfileCheck < 500) return cachedIsProfileEnabled;

	lastProfileCheck = now;

	if (!autoProfileInitialized) {
		autoProfileInitialized = true;
		if (
			typeof window !== 'undefined' &&
			root === window &&
			(IS_DEBUG_BUILD || hasExplicitOptIn)
		) {
			autoProfileUntil = now + AUTO_PROFILE_DURATION;
		}
	}

	if (hasExplicitOptIn) {
		cachedIsProfileEnabled = true;
		return cachedIsProfileEnabled;
	}

	if (autoProfileUntil > now) {
		cachedIsProfileEnabled = true;
		return cachedIsProfileEnabled;
	}

	cachedIsProfileEnabled = false;

	return cachedIsProfileEnabled;
};

export const enableProfileFor = (duration = BOOST_PROFILE_DURATION) => {
	const root = getRoot();
	if (!root || typeof window === 'undefined' || root !== window) return;
	if (!getIsProfileEnabled()) return;

	const now = Date.now();
	autoProfileInitialized = true;
	autoProfileUntil = Math.max(autoProfileUntil, now + duration);
	cachedIsProfileEnabled = true;
	lastProfileCheck = now;
};

const getProfileState = root => {
	if (!root.__maxiBlocksPerfCounters__) {
		root.__maxiBlocksPerfCounters__ = {
			totals: {},
			counts: {},
			max: {},
			counters: {},
			logScheduled: false,
		};
	}

	const perf = root.__maxiBlocksPerfCounters__;
	perf.totals = perf.totals || {};
	perf.counts = perf.counts || {};
	perf.max = perf.max || {};
	perf.counters = perf.counters || {};

	return perf;
};

const scheduleProfileFlush = perf => {
	if (perf.logScheduled || typeof setTimeout !== 'function') return;

	perf.logScheduled = true;

	setTimeout(() => {
		perf.logScheduled = false;

		const totals = perf.totals;
		const counts = perf.counts;
		const max = perf.max;
		const counters = perf.counters;

		perf.totals = {};
		perf.counts = {};
		perf.max = {};
		perf.counters = {};

		if (typeof console === 'undefined' || !console.debug) return;

		const timings = Object.keys(totals).map(key => {
			const total = totals[key];
			const count = counts[key];
			const average = total / count;
			const maxDuration = max[key] || total;

			return `${key} ${total.toFixed(1)}ms/${count} avg ${average.toFixed(
				1
			)} max ${maxDuration.toFixed(1)}`;
		});

		const counterParts = Object.keys(counters).map(
			key => `${key} ${counters[key]}`
		);

		const parts = [...timings, ...counterParts];

		if (parts.length) {
			console.debug('MaxiBlocks perf (1s):', parts.join(', '));
		}
	}, 1000);
};

export const getProfileStart = () => {
	if (!getIsProfileEnabled()) return null;

	return getNow();
};

export const recordProfile = (label, start) => {
	if (start === null) return;

	const root = getRoot();
	if (!root || !getIsProfileEnabled()) return;

	const duration = getNow() - start;
	const perf = getProfileState(root);

	perf.totals[label] = (perf.totals[label] || 0) + duration;
	perf.counts[label] = (perf.counts[label] || 0) + 1;
	perf.max[label] = Math.max(perf.max[label] || 0, duration);

	scheduleProfileFlush(perf);
};

export const countProfile = (label, count = 1) => {
	const root = getRoot();
	if (!root || !getIsProfileEnabled()) return;

	const perf = getProfileState(root);
	perf.counters[label] = (perf.counters[label] || 0) + count;

	scheduleProfileFlush(perf);
};
