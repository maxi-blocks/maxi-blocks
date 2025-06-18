/* eslint-disable no-console, no-plusplus */
/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNil, set, omit } from 'lodash';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from '@extensions/maxi-block/goThroughMaxiBlocks';
import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';
import { getPaletteColor } from '@extensions/style-cards';
import { getBlockStyle } from '@extensions/styles';

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

					// If this is a background-palette-color reset, also generate a proper background-color
					if (key.includes('background-palette-color')) {
						// Find the corresponding background-color key
						const colorKey = key.replace('palette-color', 'color');

						// Get opacity for the color calculation
						const opacityKey = key.replace(
							'palette-color',
							'palette-opacity'
						);
						const opacity = currentObject[opacityKey] || 1;

						try {
							const paletteRGB = getPaletteColor({
								clientId,
								color: newValue,
								blockStyle: getBlockStyle(clientId),
							});

							const generatedColor = `rgba(${paletteRGB}, ${opacity})`;

							if (mutator) {
								// For mutator, use the same path structure but replace the key
								const colorKeyPath = keyPath.replace(
									key,
									colorKey
								);
								mutator(colorKeyPath, generatedColor);
							} else {
								// Direct modification
								currentObject[colorKey] = generatedColor;
							}
						} catch (error) {
							console.warn(
								'[CustomColors] Failed to generate background color:',
								error
							);
						}
					}
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
 * Handles blocks that have deleted custom colors by resetting them to appropriate defaults
 *
 * @param {number} deletedColorId - The numeric ID of the deleted custom color
 */
const handleDeletedCustomColor = deletedColorId => {
	if (typeof deletedColorId !== 'number' || deletedColorId < 1000) {
		console.warn(
			'[CustomColors] Invalid deletedColorId for reset:',
			deletedColorId
		);
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

			const hasBackgroundLayers =
				!!originalAttributes['background-layers']?.length;

			// Instead of deep cloning upfront, prepare an empty object for changes
			const attributesCopy = {};
			let modified = false;

			// Process background layers specifically
			if (
				hasBackgroundLayers &&
				Array.isArray(originalAttributes['background-layers'])
			) {
				let backgroundLayersModified = false;
				const modifiedBackgroundLayers = originalAttributes[
					'background-layers'
				].map(layer => {
					const modifiedLayer = { ...layer };
					let layerModified = false;

					// Check all attributes in the layer for custom color usage
					Object.keys(modifiedLayer).forEach(key => {
						if (
							key.includes('palette-color') &&
							Number(modifiedLayer[key]) === deletedColorId
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

							modifiedLayer[key] = newValue;
							layerModified = true;

							// If this is a background-palette-color, also generate proper background-color
							if (key.includes('background-palette-color')) {
								const colorKey = key.replace(
									'palette-color',
									'color'
								);
								const opacityKey = key.replace(
									'palette-color',
									'palette-opacity'
								);
								const opacity = modifiedLayer[opacityKey] || 1;

								try {
									const paletteRGB = getPaletteColor({
										clientId,
										color: newValue,
										blockStyle: getBlockStyle(clientId),
									});

									const generatedColor = `rgba(${paletteRGB}, ${opacity})`;

									modifiedLayer[colorKey] = generatedColor;
								} catch (error) {
									// Failed to generate background color, continue silently
								}
							}
						}
					});

					if (layerModified) {
						backgroundLayersModified = true;
					}

					return modifiedLayer;
				});

				if (backgroundLayersModified) {
					attributesCopy['background-layers'] =
						modifiedBackgroundLayers;
					modified = true;
				}
			}

			// Use traverseAndResetDefault for non-background-layer attributes
			// Filter out ALL background layer related attributes to prevent corruption
			const nonBackgroundAttributes = omit(originalAttributes, [
				'background-layers',
				'background-layers-hover',
			]);

			const nonBackgroundModified = traverseAndResetDefault(
				nonBackgroundAttributes,
				deletedColorId,
				clientId,
				blockName,
				false,
				(path, value) => {
					// Additional safety check - don't set any background-layer related paths
					if (path.includes('background-layers')) {
						return;
					}
					set(attributesCopy, path, value);
				}
			);

			modified = modified || nonBackgroundModified;

			if (modified) {
				// Apply all the accumulated changes
				updateBlockAttributes(clientId, attributesCopy);
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
