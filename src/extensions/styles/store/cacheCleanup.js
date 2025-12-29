/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { styleCacheUtils } from '@extensions/styles/styleResolver';
import { cssCacheUtils } from './reducer';

const MIN_BLOCK_COUNT_FOR_CLEANUP = 100;
const MIN_BLOCK_DROP = 50;
const DRAMATIC_DROP_RATIO = 0.5;

let cleanupInitialized = false;
let previousBlockCount = 0;
let unsubscribe = null;

const getCurrentBlockCount = () => {
	try {
		const store = select('core/block-editor');
		if (!store || typeof store.getBlocks !== 'function') {
			return 0;
		}

		const blocks = store.getBlocks() || [];
		return blocks.length;
	} catch (error) {
		return 0;
	}
};

const clearStyleCaches = () => {
	styleCacheUtils.clearCache();
	cssCacheUtils.clearCache();
};

const shouldClearForDrop = (previousCount, currentCount) => {
	if (previousCount < MIN_BLOCK_COUNT_FOR_CLEANUP) {
		return false;
	}

	const drop = previousCount - currentCount;
	if (drop < MIN_BLOCK_DROP) {
		return false;
	}

	return currentCount / previousCount <= DRAMATIC_DROP_RATIO;
};

export const initializeStyleCacheCleanup = () => {
	if (cleanupInitialized) {
		return;
	}

	const store = select('core/block-editor');
	if (!store || typeof store.getBlocks !== 'function') {
		return;
	}

	cleanupInitialized = true;
	previousBlockCount = getCurrentBlockCount();

	if (
		typeof window !== 'undefined' &&
		typeof window.addEventListener === 'function'
	) {
		window.addEventListener('beforeunload', clearStyleCaches);
	}

	unsubscribe = subscribe(() => {
		try {
			const currentBlockCount = getCurrentBlockCount();

			if (shouldClearForDrop(previousBlockCount, currentBlockCount)) {
				clearStyleCaches();
			}

			if (currentBlockCount !== previousBlockCount) {
				previousBlockCount = currentBlockCount;
			}
		} catch (error) {
			// Ignore subscription errors; cache can rebuild on demand.
		}
	}, 'core/block-editor');
};

export const destroyStyleCacheCleanup = () => {
	if (unsubscribe) {
		unsubscribe();
		unsubscribe = null;
	}

	cleanupInitialized = false;
};
