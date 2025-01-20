/**
 * This is a temporary file to migrate position attribute from 'number' to 'string' and units from non to axis.
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import { isEmpty, isFinite } from 'lodash';
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

// Constants
const NAME = 'Position to number';
const BREAKPOINTS = Object.freeze(['general', 'xxl', 'xl', 'l', 'm', 's', 'xs']);
const TARGETS = Object.freeze(['position', 'blockBackground']);
const KEYWORDS = Object.freeze(['top', 'right', 'bottom', 'left']);
const POSITION_PREFIX = 'position-';

const getOldUnits = attributes => {
	const result = {};
	// Use for loop for better performance
	for (let i = 0; i < BREAKPOINTS.length; i++) {
		const key = `${POSITION_PREFIX}unit-${BREAKPOINTS[i]}`;
		result[key] = attributes[key];
	}
	return result;
};

const isEligible = (blockAttributes, attributes) => {
	const attrsToChange = {
		...getGroupAttributes(blockAttributes, TARGETS),
		...getOldUnits(blockAttributes)
	};

	// Use for...of for better performance with break capability
	for (const [attrKey, attrVal] of Object.entries(attrsToChange)) {
		if (attrKey.includes(POSITION_PREFIX)) {
			if (isFinite(attrVal) && attributes[attrKey]?.type === 'string') {
				return true;
			}
		}

		if (attrKey.includes('background-layers') && !isEmpty(attrVal)) {
			for (const layer of attrVal) {
				if (layer.type === 'shape') {
					for (const [key, val] of Object.entries(layer)) {
						if (key.includes(POSITION_PREFIX) && isFinite(val)) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
};

const migratePositionAttributes = (key, val, oldAttributes, attributes) => {
	if (key.includes(POSITION_PREFIX) &&
		isFinite(val) &&
		attributes?.[key]?.type === 'string') {
		oldAttributes[key] = val.toString();
	}
};

const attributes = () => {
	const obj = {};
	// Use for loop instead of reduce
	for (let i = 0; i < KEYWORDS.length; i++) {
		obj[`${POSITION_PREFIX}${KEYWORDS[i]}`] = { type: 'number' };
	}
	return breakpointAttributesCreator({ obj });
};

const migrate = newAttributes => {
	const attrsToChange = {
		...getGroupAttributes(newAttributes, TARGETS),
		...getOldUnits(newAttributes)
	};

	// Use for...of for better performance
	for (const [key, val] of Object.entries(attrsToChange)) {
		migratePositionAttributes(key, val, newAttributes, attributes);

		if (key.includes('background-layers') && !isEmpty(val)) {
			for (const layer of val) {
				for (const [layerKey, layerVal] of Object.entries(layer)) {
					migratePositionAttributes(layerKey, layerVal, layer, attributes);
				}
			}
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, attributes, migrate };
