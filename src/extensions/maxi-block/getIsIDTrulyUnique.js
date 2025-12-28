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
	if (!id.endsWith('-u')) return false;

	const { isUniqueIDCacheLoaded, isUniqueIDInCache, getLastInsertedBlocks } =
		select('maxiBlocks/blocks');

	// If cache is loaded, use O(1) lookup for site-wide check
	if (isUniqueIDCacheLoaded()) {
		const existsInDB = isUniqueIDInCache(id);

		// Count occurrences in current editor by traversing the actual block tree
		// Note: Redux store is keyed by uniqueID, so can't detect duplicates there
		let currentEditorCount = 0;
		goThroughMaxiBlocks(block => {
			const { uniqueID } = block.attributes;
			if (uniqueID === id) {
				currentEditorCount += 1;
			}
		});

		// Check if ID exists in DB but not in current editor
		// This could mean:
		// 1. Loading a saved block (initial load) → Keep ID
		// 2. Pasting from another page → Regenerate
		//
		// IMPROVED LOGIC: Use lastChangedBlocks to detect new insertions
		// instead of relying solely on post dirty status
		const lastChangedBlocks = getLastInsertedBlocks() || [];
		const isNewInsertion = clientId && lastChangedBlocks.includes(clientId);

		let isUnique = currentEditorCount <= repeatCount;

		// CRITICAL FIX: If the ID exists in the site-wide DB AND this is a new insertion,
		// it means the block was pasted from another page. In this case, ALWAYS regenerate
		// the uniqueID regardless of currentEditorCount.
		// This catches the case where currentEditorCount is 1 (the pasted block itself).
		if (existsInDB && isNewInsertion) {
			isUnique = false;
		}

		return isUnique;
	}

	// Fallback to original tree traversal if cache not loaded
	let currentRepeatCount = 0;

	goThroughMaxiBlocks(block => {
		const { uniqueID } = block.attributes;
		if (uniqueID === id) {
			currentRepeatCount += 1;
		}
	});

	if (currentRepeatCount > repeatCount) {
		return false;
	}
	return true;
};

export default getIsIDTrulyUnique;
