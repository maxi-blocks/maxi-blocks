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
 * Extract RGB values from a color string to use in CSS variables or other contexts
 *
 * @param {string|object} colorInput - The color string (rgba, hex, etc.) or object with value property
 * @return {string} The RGB values as a comma-separated string
 */
const extractRGBValues = colorInput => {
	if (!colorInput) return '0, 0, 0';

	// Handle color objects
	const colorValue =
		typeof colorInput === 'object' && colorInput.value
			? colorInput.value
			: colorInput;

	// Check if it's an rgba format with numbers
	const rgbaMatch = colorValue.match(
		/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
	);
	if (rgbaMatch) {
		return `${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}`;
	}

	// Check if it's an rgb/rgba format with percentages
	const rgbaPercentMatch = colorValue.match(
		/rgba?\((\d+)%,\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/
	);
	if (rgbaPercentMatch) {
		// Convert percentages to 0-255 values
		const r = Math.round((parseInt(rgbaPercentMatch[1], 10) / 100) * 255);
		const g = Math.round((parseInt(rgbaPercentMatch[2], 10) / 100) * 255);
		const b = Math.round((parseInt(rgbaPercentMatch[3], 10) / 100) * 255);
		return `${r}, ${g}, ${b}`;
	}

	// If it's a hex color, handle different formats
	if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
		const hex = colorValue.replace('#', '');

		// Handle shorthand 3-digit hex (#RGB)
		if (hex.length === 3) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			return `${r}, ${g}, ${b}`;
		}

		// Handle shorthand 4-digit hex with alpha (#RGBA)
		if (hex.length === 4) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			// Alpha value at hex[3] is ignored for RGB output
			return `${r}, ${g}, ${b}`;
		}

		// Handle standard 6-digit hex (#RRGGBB)
		if (hex.length === 6) {
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			return `${r}, ${g}, ${b}`;
		}

		// Handle 8-digit hex with alpha (#RRGGBBAA)
		if (hex.length === 8) {
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			// Alpha value at positions 6-7 is ignored for RGB output
			return `${r}, ${g}, ${b}`;
		}
	}

	// Handle named colors by creating a temporary element to get computed values
	if (
		typeof colorValue === 'string' &&
		!colorValue.includes(',') &&
		!colorValue.startsWith('#')
	) {
		try {
			const tempElement = document.createElement('div');
			tempElement.style.color = colorValue;
			document.body.appendChild(tempElement);
			const computedColor = getComputedStyle(tempElement).color;
			document.body.removeChild(tempElement);

			// Extract RGB from computed color (should be in rgb/rgba format)
			const computedMatch = computedColor.match(
				/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
			);
			if (computedMatch) {
				return `${computedMatch[1]}, ${computedMatch[2]}, ${computedMatch[3]}`;
			}
		} catch (e) {
			// Silent fail if browser doesn't support this approach
		}
	}

	// Default fallback - ensure we don't return values with # or other non-RGB characters
	// Return a safe default instead of potentially breaking CSS
	return '0, 0, 0';
};

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
const traverseAndResetDefault = (
	currentObject,
	deletedColorId,
	clientId,
	blockName,
	attributesModified
) => {
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
};

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
const traverseAndRemapId = (
	currentObject,
	oldIdToFind,
	newIdToSet,
	attributesModified
) => {
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
};

export { extractRGBValues, updateShiftedCustomColorIdsInBlocks };
export default handleDeletedCustomColor;
