import {
	DEFAULT_TTL,
	createCacheKey,
	loadFromCache,
	saveToCache,
	cleanupExpiredCache,
} from './dcCacheDB';

let cleanupTriggered = false;

const createMemoryCache = maxSize => {
	const memoryCache = new Map();

	const getEntry = key => {
		const entry = memoryCache.get(key);
		if (!entry) return null;

		const age = Date.now() - entry.timestamp;
		if (age > entry.ttl) {
			memoryCache.delete(key);
			return null;
		}

		memoryCache.delete(key);
		memoryCache.set(key, entry);
		return entry;
	};

	const setEntry = (key, entry) => {
		if (memoryCache.has(key)) {
			memoryCache.delete(key);
		}
		memoryCache.set(key, entry);

		if (memoryCache.size > maxSize) {
			const oldestKey = memoryCache.keys().next().value;
			memoryCache.delete(oldestKey);
		}
	};

	const clear = () => {
		memoryCache.clear();
	};

	return { getEntry, setEntry, clear };
};

export const createDCCache = (
	namespace,
	{ maxSize = 100, ttl = DEFAULT_TTL } = {}
) => {
	if (!cleanupTriggered) {
		cleanupTriggered = true;
		cleanupExpiredCache();
	}

	const memoryCache = createMemoryCache(maxSize);

	const get = async request => {
		const key = createCacheKey(namespace, request);
		const memoryEntry = memoryCache.getEntry(key);
		if (memoryEntry) {
			return memoryEntry.data;
		}

		const persistedEntry = await loadFromCache(key);
		if (persistedEntry) {
			memoryCache.setEntry(key, persistedEntry);
			return persistedEntry.data;
		}

		return null;
	};

	const set = async (request, data) => {
		if (data === null || data === undefined) {
			return;
		}

		const key = createCacheKey(namespace, request);
		const entry = {
			data,
			timestamp: Date.now(),
			ttl,
		};

		memoryCache.setEntry(key, entry);
		await saveToCache(key, data, ttl);
	};

	return {
		get,
		set,
		clear: memoryCache.clear,
	};
};
