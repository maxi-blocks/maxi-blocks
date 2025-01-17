/**
 * Internal dependencies
 */
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

// Constants
const NAME = 'Position Axis Units';
const BREAKPOINTS = Object.freeze(['general', 'xxl', 'xl', 'l', 'm', 's', 'xs']);
const TARGETS = Object.freeze(['position', 'blockBackground']);
const KEYWORDS = Object.freeze(['top', 'right', 'bottom', 'left']);

const getOldUnits = attributes => {
	const result = {};
	// Use for loop for better performance
	for (let i = 0; i < BREAKPOINTS.length; i++) {
		const key = `position-unit-${BREAKPOINTS[i]}`;
		result[key] = attributes[key];
	}
	return result;
};

const unitChecker = (key, val) =>
	val && key.includes('unit') && !KEYWORDS.some(word => key.includes(word));

const migratePositionAttributes = (key, val, oldAttributes) => {
	if (!key.includes('position')) return;

	// Convert non-axis unit to axis unit
	if (unitChecker(key, val)) {
		const stringBeforeUnit = key.slice(0, key.indexOf('unit'));
		const stringAfterUnit = key.slice(key.indexOf('unit'));

		// Use for loop for better performance
		for (let i = 0; i < KEYWORDS.length; i++) {
			const newKey = `${stringBeforeUnit}${KEYWORDS[i]}-${stringAfterUnit}`;
			oldAttributes[newKey] = val;
		}

		delete oldAttributes[key];
	}
};

const isEligible = blockAttributes => {
	const attrsToChange = {
		...getGroupAttributes(blockAttributes, TARGETS),
		...getOldUnits(blockAttributes)
	};

	// Use for...of for better performance with break capability
	for (const [attrKey, attrVal] of Object.entries(attrsToChange)) {
		if (attrKey.includes('position') && unitChecker(attrKey, attrVal)) {
			return true;
		}

		if (attrKey.includes('background-layers') && !isEmpty(attrVal)) {
			for (const layer of attrVal) {
				if (layer.type === 'shape') {
					for (const [key, val] of Object.entries(layer)) {
						if (key.includes('position') && unitChecker(key, val)) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
};

const attributes = () =>
	breakpointAttributesCreator({
		obj: {
			'position-unit': {
				type: 'string',
			},
		},
	});

const migrate = newAttributes => {
	const attrsToChange = {
		...getGroupAttributes(newAttributes, TARGETS),
		...getOldUnits(newAttributes)
	};

	// Use for...of for better performance
	for (const [key, val] of Object.entries(attrsToChange)) {
		migratePositionAttributes(key, val, newAttributes);

		if (key.includes('background-layers') && !isEmpty(val)) {
			for (const layer of val) {
				for (const [layerKey, layerVal] of Object.entries(layer)) {
					migratePositionAttributes(layerKey, layerVal, layer);
				}
			}
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, attributes, migrate };
