/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNil, set } from 'lodash';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from '@extensions/maxi-block/goThroughMaxiBlocks';
import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';

const DEFAULT_PALETTE_COLOR_ID = 1; // Default to the first standard palette color

/**
 * Recursively traverses an attributes object (or array of objects) and resets
 * any 'palette-color' related attribute that matches the deletedColorId to its default.
 *
 * @param {Object|Array} currentObject      The object or array to traverse.
 * @param {number}       deletedColorId     The ID of the custom color that was deleted.
 * @param {string}       clientId           The client ID of the block being processed.
 * @param {string}       blockName          The name of the block being processed.
 * @param {boolean}      attributesModified Tracks if any attribute was modified.
 * @param {Function}     mutator            Optional callback to apply changes instead of modifying original object.
 * @param {string}       currentPath        Current path in the object (for mutator).
 * @return {boolean} True if attributes were modified, false otherwise.
 */
const traverseAndResetDefault = (
	currentObject,
	deletedColorId,
	clientId,
	blockName,
	attributesModified,
	mutator = null,
	currentPath = ''
) => {
	let modified = attributesModified;

	if (Array.isArray(currentObject)) {
		currentObject.forEach((item, index) => {
			if (typeof item === 'object' && item !== null) {
				const arrayPath = currentPath
					? `${currentPath}[${index}]`
					: `[${index}]`;
				if (
					traverseAndResetDefault(
						item,
						deletedColorId,
						clientId,
						blockName,
						false,
						mutator,
						arrayPath
					)
				) {
					modified = true;
				}
			}
		});
	} else if (typeof currentObject === 'object' && currentObject !== null) {
		for (const key in currentObject) {
			if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
				const keyPath = currentPath ? `${currentPath}.${key}` : key;

				if (
					key.includes('palette-color') &&
					Number(currentObject[key]) === deletedColorId
				) {
					const blockSpecificDefault = getDefaultAttribute(
						key,
						clientId,
						false,
						blockName
					);
					const newValue =
						typeof blockSpecificDefault === 'number' &&
						!isNil(blockSpecificDefault)
							? blockSpecificDefault
							: DEFAULT_PALETTE_COLOR_ID;

					if (mutator) {
						// Use the mutator to record the change
						mutator(keyPath, newValue);
					} else {
						// Direct modification if no mutator is provided
						currentObject[key] = newValue;
					}
					modified = true;
				} else if (
					typeof currentObject[key] === 'object' &&
					currentObject[key] !== null
				) {
					if (
						traverseAndResetDefault(
							currentObject[key],
							deletedColorId,
							clientId,
							blockName,
							false,
							mutator,
							keyPath
						)
					) {
						modified = true;
					}
				}
			}
		}
	}
	return modified;
};

/**
 * Handles the deletion of a custom color by updating blocks that use it to defaults.
 *
 * @param {number} deletedColorId The ID of the custom color that was deleted (e.g., 1000, 1001).
 */
const handleDeletedCustomColor = deletedColorId => {
	if (typeof deletedColorId !== 'number' || deletedColorId < 1000) {
		// eslint-disable-next-line no-console
		console.warn('Invalid deletedColorId for reset:', deletedColorId);
		return;
	}

	const { updateBlockAttributes } = dispatch('core/block-editor');
	const allBlocks = select('core/block-editor').getBlocks();

	goThroughMaxiBlocks(
		block => {
			const {
				attributes: originalAttributes,
				clientId,
				name: blockName,
			} = block;

			// Instead of deep cloning upfront, prepare an empty object for changes
			const attributesCopy = {};
			// Create a mutator that sets values in attributesCopy using the path
			const mutator = (path, value) => {
				// Use lodash's set to handle nested paths
				set(attributesCopy, path, value);
			};

			// Now traverse and record any changes in attributesCopy
			const wasModified = traverseAndResetDefault(
				originalAttributes,
				deletedColorId,
				clientId,
				blockName,
				false,
				mutator
			);

			if (wasModified) {
				// Merge with original attributes and update
				updateBlockAttributes(clientId, {
					...originalAttributes,
					...attributesCopy,
				});
			}
			return false; // Continue iterating through all blocks
		},
		true,
		allBlocks
	); // true to go through all blocks, not just maxi-blocks
};

/**
 * Recursively traverses an attributes object (or array of objects) and remaps
 * any 'palette-color' related attribute from oldIdToFind to newIdToSet.
 *
 * @param {Object|Array} currentObject      The object or array to traverse.
 * @param {number}       oldIdToFind        The old custom color ID to find.
 * @param {number}       newIdToSet         The new custom color ID to set.
 * @param {boolean}      attributesModified Tracks if any attribute was modified.
 * @param {Function}     mutator            Optional callback to apply changes instead of modifying original object.
 * @param {string}       currentPath        Current path in the object (for mutator).
 * @return {boolean} True if attributes were modified, false otherwise.
 */
const traverseAndRemapId = (
	currentObject,
	oldIdToFind,
	newIdToSet,
	attributesModified,
	mutator = null,
	currentPath = ''
) => {
	let modified = attributesModified;

	if (Array.isArray(currentObject)) {
		currentObject.forEach((item, index) => {
			if (typeof item === 'object' && item !== null) {
				const arrayPath = currentPath
					? `${currentPath}[${index}]`
					: `[${index}]`;
				if (
					traverseAndRemapId(
						item,
						oldIdToFind,
						newIdToSet,
						false,
						mutator,
						arrayPath
					)
				) {
					modified = true;
				}
			}
		});
	} else if (typeof currentObject === 'object' && currentObject !== null) {
		for (const key in currentObject) {
			if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
				const keyPath = currentPath ? `${currentPath}.${key}` : key;

				if (
					key.includes('palette-color') &&
					Number(currentObject[key]) === oldIdToFind
				) {
					if (mutator) {
						// Use the mutator to record the change
						mutator(keyPath, newIdToSet);
					} else {
						// Direct modification if no mutator is provided
						currentObject[key] = newIdToSet;
					}
					modified = true;
				} else if (
					typeof currentObject[key] === 'object' &&
					currentObject[key] !== null
				) {
					if (
						traverseAndRemapId(
							currentObject[key],
							oldIdToFind,
							newIdToSet,
							false,
							mutator,
							keyPath
						)
					) {
						modified = true;
					}
				}
			}
		}
	}
	return modified;
};

/**
 * Updates block attributes for custom colors that have shifted due to a deletion.
 *
 * @param {number} oldId The original ID of the custom color before the shift.
 * @param {number} newId The new ID of the custom color after the shift.
 */
const updateShiftedCustomColorIdsInBlocks = (oldId, newId) => {
	if (
		typeof oldId !== 'number' ||
		oldId < 1000 ||
		typeof newId !== 'number' ||
		newId < 1000
	) {
		// eslint-disable-next-line no-console
		console.warn(
			'Invalid oldId or newId for custom color ID shift:',
			oldId,
			newId
		);
		return;
	}

	const { updateBlockAttributes } = dispatch('core/block-editor');
	const allBlocks = select('core/block-editor').getBlocks();

	goThroughMaxiBlocks(
		block => {
			const { attributes: originalAttributes, clientId } = block;

			// Instead of deep cloning upfront, prepare an empty object for changes
			const attributesCopy = {};
			// Create a mutator that sets values in attributesCopy using the path
			const mutator = (path, value) => {
				// Use lodash's set to handle nested paths
				set(attributesCopy, path, value);
			};

			const wasModified = traverseAndRemapId(
				originalAttributes,
				oldId,
				newId,
				false,
				mutator
			);

			if (wasModified) {
				// Merge with original attributes and update
				updateBlockAttributes(clientId, {
					...originalAttributes,
					...attributesCopy,
				});
			}
			return false; // Continue iterating through all blocks
		},
		true,
		allBlocks
	); // true to go through all blocks, not just maxi-blocks
};

export { updateShiftedCustomColorIdsInBlocks };
export default handleDeletedCustomColor;
