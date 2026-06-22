/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

/**
 * Check if a uniqueID is truly unique across the site and current editor
 * Uses O(1) cache lookup when available, falls back to tree traversal
 *
 * @param {string} id          - The uniqueID to check
 * @param {number} repeatCount - How many times this ID can appear (default 1 for existing blocks)
 * @param {string} clientId    - Optional clientId to check if block is newly inserted
 * @returns {boolean}          - True if ID is unique (appears <= repeatCount times)
 */
const getIsIDTrulyUnique = (id, repeatCount = 1, clientId = null) => {
	if (typeof id !== 'string' || !id.endsWith('-u')) return false;

	const {
		isUniqueIDCacheLoaded,
		isUniqueIDInCache,
		getLastInsertedBlocks,
		getUniqueIDCount,
		getUniqueIDClientIds,
	} = select('maxiBlocks/blocks');

	// If cache is loaded, use O(1) lookup for site-wide check
	if (isUniqueIDCacheLoaded()) {
		const existsInDB = isUniqueIDInCache(id);

		const currentEditorCount = Number(getUniqueIDCount?.(id) ?? 0);

		// Check if ID exists in DB but not in current editor
		// This could mean:
		// 1. Loading a saved block (initial load) → Keep ID
		// 2. Pasting from another page → Regenerate
		//
		// IMPROVED LOGIC: Use lastChangedBlocks to detect new insertions
		// instead of relying solely on post dirty status
		const lastChangedBlocks = getLastInsertedBlocks() || [];
		const isNewInsertion = clientId && lastChangedBlocks.includes(clientId);

		// A freshly inserted/copied block registers its own uniqueID into the
		// store asynchronously (batchBlockDispatcher), so at this point it is
		// NOT yet reflected in `currentEditorCount`. If we don't account for
		// it, a copy that collides with exactly one existing block reads
		// count=1 and is wrongly considered unique (it keeps the duplicate ID).
		// Count the block itself as an extra occupant when it's a new insertion
		// that isn't registered yet, matching the tree-traversal fallback which
		// already includes the block in its count.
		const registeredClientIds =
			(clientId && getUniqueIDClientIds?.(id)) || [];
		const isSelfRegistered =
			clientId && registeredClientIds.includes(clientId);
		const pendingSelf = isNewInsertion && !isSelfRegistered ? 1 : 0;
		const effectiveCount = currentEditorCount + pendingSelf;

		let isUnique = effectiveCount <= repeatCount;

		if (existsInDB && currentEditorCount === 0) {
			// ID exists in DB but not in current editor
			if (isNewInsertion) {
				// Block was just inserted/pasted = pasting from another page
				isUnique = false;
			}
			// If NOT a new insertion, it means we're loading from DB = keep ID
		}

		return isUnique;
	}

	// Fallback to original tree traversal if cache not loaded
	let currentRepeatCount = 0;

	goThroughMaxiBlocks(block => {
		const { uniqueID } = block.attributes;
		if (uniqueID === id) {
			currentRepeatCount += 1;

			if (currentRepeatCount > repeatCount) {
				return true;
			}
		}

		return false;
	});

	if (currentRepeatCount > repeatCount) {
		return false;
	}
	return true;
};

export default getIsIDTrulyUnique;
