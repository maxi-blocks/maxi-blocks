/* eslint-disable no-console */

const REPEATER_PERF_FLAG = '__MAXI_PROFILE_REPEATER__';
const REPEATER_PERF_AGGREGATE_KEY = '__maxiRepeaterPerfAggregate__';

const getPerfRoot = () => (typeof window !== 'undefined' ? window : globalThis);

const getNow = () =>
	typeof performance !== 'undefined' && performance.now
		? performance.now()
		: Date.now();

const roundDuration = value => Math.round(value * 100) / 100;

const normalizeDurations = values =>
	Object.fromEntries(
		Object.entries(values)
			.sort(([, a], [, b]) => b - a)
			.map(([key, value]) => [key, roundDuration(value)])
	);

const getRepeaterAggregateStore = () => {
	const perfRoot = getPerfRoot();

	if (!perfRoot[REPEATER_PERF_AGGREGATE_KEY]) {
		perfRoot[REPEATER_PERF_AGGREGATE_KEY] = {
			totals: {},
			counts: {},
			logScheduled: false,
		};
	}

	return perfRoot[REPEATER_PERF_AGGREGATE_KEY];
};

const scheduleRepeaterAggregateLog = store => {
	if (store.logScheduled || typeof setTimeout !== 'function') {
		return;
	}

	store.logScheduled = true;

	setTimeout(() => {
		store.logScheduled = false;

		if (typeof console === 'undefined' || !console.info) {
			store.totals = {};
			store.counts = {};
			return;
		}

		const { totals, counts } = store;
		store.totals = {};
		store.counts = {};

		console.info('[MaxiBlocks repeater perf aggregate]', {
			buckets: normalizeDurations(totals),
			counts,
		});
	}, 1000);
};

export const isRepeaterPerfEnabled = () =>
	!!getPerfRoot()?.[REPEATER_PERF_FLAG];

export const createRepeaterPerfSession = (label, meta = {}) => {
	if (!isRepeaterPerfEnabled()) {
		return null;
	}

	const startedAt = getNow();
	const buckets = {};
	const counters = {};
	const details = { ...meta };
	let isFlushed = false;

	return {
		addTime(bucket, duration) {
			buckets[bucket] = (buckets[bucket] || 0) + duration;
		},
		addCount(key, value = 1) {
			counters[key] = (counters[key] || 0) + value;
		},
		setDetail(key, value) {
			details[key] = value;
		},
		flush(extra = {}) {
			if (isFlushed) {
				return;
			}

			isFlushed = true;

			if (typeof console === 'undefined' || !console.info) {
				return;
			}

			console.info('[MaxiBlocks repeater perf]', {
				label,
				totalMs: roundDuration(getNow() - startedAt),
				...details,
				...extra,
				buckets: normalizeDurations(buckets),
				counters,
			});
		},
	};
};

export const startRepeaterPerfBucket = (perfSession, bucket) => {
	if (!perfSession) {
		return () => {};
	}

	const startedAt = getNow();

	return () => {
		perfSession.addTime(bucket, getNow() - startedAt);
	};
};

export const measureRepeaterPerf = (perfSession, bucket, callback) => {
	const stop = startRepeaterPerfBucket(perfSession, bucket);

	try {
		const result = callback();

		if (result && typeof result.finally === 'function') {
			return result.finally(stop);
		}

		stop();
		return result;
	} catch (error) {
		stop();
		throw error;
	}
};

export const addRepeaterPerfCount = (perfSession, key, value = 1) => {
	perfSession?.addCount(key, value);
};

export const setRepeaterPerfDetail = (perfSession, key, value) => {
	perfSession?.setDetail(key, value);
};

export const recordRepeaterAggregate = (bucket, duration, count = 1) => {
	if (!isRepeaterPerfEnabled()) {
		return;
	}

	const store = getRepeaterAggregateStore();
	store.totals[bucket] = (store.totals[bucket] || 0) + duration;
	store.counts[bucket] = (store.counts[bucket] || 0) + count;

	scheduleRepeaterAggregateLog(store);
};

export const incrementRepeaterAggregate = (bucket, value = 1) => {
	if (!isRepeaterPerfEnabled()) {
		return;
	}

	const store = getRepeaterAggregateStore();
	store.counts[bucket] = (store.counts[bucket] || 0) + value;

	scheduleRepeaterAggregateLog(store);
};

export const measureRepeaterAggregate = (bucket, callback) => {
	if (!isRepeaterPerfEnabled()) {
		return callback();
	}

	return measureRepeaterPerf(
		{
			addTime: (currentBucket, duration) =>
				recordRepeaterAggregate(currentBucket, duration),
		},
		bucket,
		callback
	);
};
