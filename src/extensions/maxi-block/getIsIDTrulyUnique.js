/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

/**
 * Check if current post is dirty (has unsaved changes)
 */
const isCurrentPostDirty = () => {
	try {
		const { __experimentalGetDirtyEntityRecords: getDirtyEntityRecords } =
			select('core');
		const { getCurrentPostId } = select('core/editor');

		if (!getDirtyEntityRecords || !getCurrentPostId) return false;

		return getDirtyEntityRecords().some(
			item => item.key === getCurrentPostId()
		);
	} catch {
		return false;
	}
};

/**
 * Check if a uniqueID is truly unique across the site and current editor
 * Uses O(1) cache lookup when available, falls back to tree traversal
 *
 * @param {string} id          - The uniqueID to check
 * @param {number} repeatCount - How many times this ID can appear (default 1 for existing blocks)
 * @returns {boolean}          - True if ID is unique (appears <= repeatCount times)
 */
const getIsIDTrulyUnique = (id, repeatCount = 1) => {
	if (!id.endsWith('-u')) return false;

	const { isUniqueIDCacheLoaded, isUniqueIDInCache, getBlocks } =
		select('maxiBlocks/blocks');

	// If cache is loaded, use O(1) lookup for site-wide check
	if (isUniqueIDCacheLoaded()) {
		const existsInDB = isUniqueIDInCache(id);

		// Quick check: count occurrences in current editor using Redux store
		// This is O(n) but n is only blocks in THIS editor, not full tree
		const currentBlocks = getBlocks() || {};
		let currentEditorCount = 0;
		Object.keys(currentBlocks).forEach(uniqueID => {
			if (uniqueID === id) {
				currentEditorCount += 1;
			}
		});

		// Check if ID exists in DB but not in current editor
		// This could mean:
		// 1. Loading a saved block (post is clean) → Keep ID
		// 2. Pasting from another page (post is dirty) → Regenerate
		const postDirty = isCurrentPostDirty();
		let isUnique = currentEditorCount <= repeatCount;

		if (existsInDB && currentEditorCount === 0 && postDirty) {
			// ID exists elsewhere and post is dirty = pasting from another page
			isUnique = false;
		}

		// eslint-disable-next-line no-console
		console.log(
			`[getIsIDTrulyUnique] ⚡ CACHE HIT: ${JSON.stringify(
				id
			)} | InDB: ${JSON.stringify(
				existsInDB
			)} | EditorCount: ${JSON.stringify(
				currentEditorCount
			)} | PostDirty: ${JSON.stringify(
				postDirty
			)} | Unique: ${JSON.stringify(isUnique)}`
		);

		return isUnique;
	}

	// Fallback to original tree traversal if cache not loaded
	// eslint-disable-next-line no-console
	console.log(
		`[getIsIDTrulyUnique] 🐢 CACHE MISS - using tree traversal for: ${JSON.stringify(
			id
		)}`
	);

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
