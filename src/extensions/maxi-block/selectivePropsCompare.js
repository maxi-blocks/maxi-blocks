/**
 * Compares two objects with selective property filtering and deep comparison.
 *
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @returns {boolean} - True if objects are equal, false otherwise.
 */
const selectivePropsCompare = (obj1, obj2) => {
	const entriesToRemove = new Set([
		'maxiSetAttributes',
		'insertInlineStyles',
		'cleanInlineStyles',
		'context',
		'getBounds',
		'onReplace',
		'onRemove',
		'hasSelectedChild',
		'insertBlocksAfter',
		'mergeBlocks',
	]);

	const keys1 = Object.keys(obj1).filter(key => !entriesToRemove.has(key));
	const keys2 = Object.keys(obj2).filter(key => !entriesToRemove.has(key));

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (
			typeof obj1[key] !== 'function' &&
			typeof obj2[key] !== 'function'
		) {
			const val1 = obj1[key];
			const val2 = obj2[key];

			if (typeof val1 === 'object' && typeof val2 === 'object') {
				if (
					val1 === val2 ||
					JSON.stringify(val1) === JSON.stringify(val2)
				) {
					// eslint-disable-next-line no-continue
					continue;
				}
				return false;
			}
			if (val1 !== val2) {
				return false;
			}
		}
	}

	return true;
};

export default selectivePropsCompare;
