/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { cloneDeep, isNil } from 'lodash';

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
 * @return {boolean} True if attributes were modified, false otherwise.
 */
function traverseAndResetDefault(
	currentObject,
	deletedColorId,
	clientId,
	blockName,
	attributesModified
) {
	let modified = attributesModified;

	if (Array.isArray(currentObject)) {
		currentObject.forEach(item => {
			if (typeof item === 'object' && item !== null) {
				if (
					traverseAndResetDefault(
						item,
						deletedColorId,
						clientId,
						blockName,
						false
					)
				) {
					modified = true;
				}
			}
		});
	} else if (typeof currentObject === 'object' && currentObject !== null) {
		for (const key in currentObject) {
			if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
				if (
					key.includes('palette-color') &&
					currentObject[key] === deletedColorId
				) {
					const blockSpecificDefault = getDefaultAttribute(
						key,
						clientId,
						false,
						blockName
					);
					currentObject[key] =
						typeof blockSpecificDefault === 'number' &&
						!isNil(blockSpecificDefault)
							? blockSpecificDefault
							: DEFAULT_PALETTE_COLOR_ID;
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
							false
						)
					) {
						modified = true;
					}
				}
			}
		}
	}
	return modified;
}

/**
 * Handles the deletion of a custom color by updating blocks that use it to defaults.
 *
 * @param {number} deletedColorId The ID of the custom color that was deleted (e.g., 1000, 1001).
 */
export function handleDeletedCustomColor(deletedColorId) {
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
			const attributesCopy = cloneDeep(originalAttributes);

			const wasModified = traverseAndResetDefault(
				attributesCopy,
				deletedColorId,
				clientId,
				blockName,
				false
			);

			if (wasModified) {
				updateBlockAttributes(clientId, attributesCopy);
			}
			return false; // Continue iterating through all blocks
		},
		true,
		allBlocks
	); // true to go through all blocks, not just maxi-blocks
}

/**
 * Recursively traverses an attributes object (or array of objects) and remaps
 * any 'palette-color' related attribute from oldIdToFind to newIdToSet.
 *
 * @param {Object|Array} currentObject      The object or array to traverse.
 * @param {number}       oldIdToFind        The old custom color ID to find.
 * @param {number}       newIdToSet         The new custom color ID to set.
 * @param {boolean}      attributesModified Tracks if any attribute was modified.
 * @return {boolean} True if attributes were modified, false otherwise.
 */
function traverseAndRemapId(
	currentObject,
	oldIdToFind,
	newIdToSet,
	attributesModified
) {
	let modified = attributesModified;

	if (Array.isArray(currentObject)) {
		currentObject.forEach(item => {
			if (typeof item === 'object' && item !== null) {
				if (traverseAndRemapId(item, oldIdToFind, newIdToSet, false)) {
					modified = true;
				}
			}
		});
	} else if (typeof currentObject === 'object' && currentObject !== null) {
		for (const key in currentObject) {
			if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
				if (
					key.includes('palette-color') &&
					currentObject[key] === oldIdToFind
				) {
					currentObject[key] = newIdToSet;
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
							false
						)
					) {
						modified = true;
					}
				}
			}
		}
	}
	return modified;
}

/**
 * Updates block attributes for custom colors that have shifted due to a deletion.
 *
 * @param {number} oldId The original ID of the custom color before the shift.
 * @param {number} newId The new ID of the custom color after the shift.
 */
export function updateShiftedCustomColorIdsInBlocks(oldId, newId) {
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
			const attributesCopy = cloneDeep(originalAttributes);

			const wasModified = traverseAndRemapId(
				attributesCopy,
				oldId,
				newId,
				false
			);

			if (wasModified) {
				updateBlockAttributes(clientId, attributesCopy);
			}
			return false; // Continue iterating through all blocks
		},
		true,
		allBlocks
	); // true to go through all blocks, not just maxi-blocks
}
