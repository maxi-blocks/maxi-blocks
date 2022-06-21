/**
 * This is a temporary file to migrate position attribute from 'number' to 'string' and units from non to axis.
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '../getGroupAttributes';
import { isEmpty, isFinite } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const targets = ['position', 'blockBackground'];
const keyWords = ['top', 'right', 'bottom', 'left'];

const getOldUnits = attributes =>
	breakpoints.map(bp => ({
		[`position-unit-${bp}`]: attributes[`position-unit-${bp}`],
	}));

const getAttrsToChange = attributes =>
	Object.assign(
		{ ...getGroupAttributes(attributes, targets) },
		...getOldUnits(attributes)
	);

// Check if unit no axis
const unitChecker = (key, val) =>
	val && key.includes('unit') && !keyWords.some(word => key.includes(word));

const migratePositionAttributes = (key, val, oldAttributes, attributes) => {
	if (key.includes('position')) {
		// Convert number to string
		if (isFinite(val) && attributes?.[key]?.type === 'string') {
			oldAttributes[key] = val.toString();
		}

		// Convert non-axis unit to axis unit
		if (unitChecker(key, val)) {
			keyWords.forEach(keyWord => {
				const stringBeforeUnit = key.slice(0, key.indexOf('unit'));
				const stringAfterUnit = key.slice(key.indexOf('unit'));
				const newKey = `${stringBeforeUnit}${keyWord}-${stringAfterUnit}`;

				oldAttributes[newKey] = val;
			});

			delete oldAttributes[key];
		}
	}
};

const isEligible = (blockAttributes, attributes) => {
	const attrsToChange = getAttrsToChange(blockAttributes);

	return Object.entries(attrsToChange).some(([attrKey, attrVal]) => {
		if (attrKey.includes('position')) {
			if (isFinite(attrVal)) {
				const defaultType = attributes[attrKey].type;

				return defaultType === 'string';
			}

			return unitChecker(attrKey, attrVal);
		}

		if (attrKey.includes('background-layers') && !isEmpty(attrVal)) {
			return attrVal.some(layer => {
				if (layer.type === 'shape') {
					return Object.entries(layer).some(([key, val]) => {
						if (key.includes('position')) {
							if (isFinite(val)) return true;

							return unitChecker(key, val);
						}

						return false;
					});
				}

				return false;
			});
		}

		return false;
	});
};

const attributes = {
	'position-top-general': {
		type: 'number',
	},
	'position-top-xxl': {
		type: 'number',
	},
	'position-top-xl': {
		type: 'number',
	},
	'position-top-l': {
		type: 'number',
	},
	'position-top-m': {
		type: 'number',
	},
	'position-top-s': {
		type: 'number',
	},
	'position-top-xs': {
		type: 'number',
	},
	'position-right-general': {
		type: 'number',
	},
	'position-right-xxl': {
		type: 'number',
	},
	'position-right-xl': {
		type: 'number',
	},
	'position-right-l': {
		type: 'number',
	},
	'position-right-m': {
		type: 'number',
	},
	'position-right-s': {
		type: 'number',
	},
	'position-right-xs': {
		type: 'number',
	},
	'position-bottom-general': {
		type: 'number',
	},
	'position-bottom-xxl': {
		type: 'number',
	},
	'position-bottom-xl': {
		type: 'number',
	},
	'position-bottom-l': {
		type: 'number',
	},
	'position-bottom-m': {
		type: 'number',
	},
	'position-bottom-s': {
		type: 'number',
	},
	'position-bottom-xs': {
		type: 'number',
	},
	'position-left-general': {
		type: 'number',
	},
	'position-left-xxl': {
		type: 'number',
	},
	'position-left-xl': {
		type: 'number',
	},
	'position-left-l': {
		type: 'number',
	},
	'position-left-m': {
		type: 'number',
	},
	'position-left-s': {
		type: 'number',
	},
	'position-left-xs': {
		type: 'number',
	},
	'position-unit-general': {
		type: 'string',
		default: 'px',
	},
	'position-unit-xxl': {
		type: 'string',
	},
	'position-unit-xl': {
		type: 'string',
	},
	'position-unit-l': {
		type: 'string',
	},
	'position-unit-m': {
		type: 'string',
	},
	'position-unit-s': {
		type: 'string',
	},
	'position-unit-xs': {
		type: 'string',
	},
};

const migrate = (newAttributes, attributes) => {
	const attrsToChange = getAttrsToChange(newAttributes);

	Object.entries(attrsToChange).forEach(([key, val]) => {
		migratePositionAttributes(key, val, newAttributes, attributes);

		if (key.includes('background-layers') && !isEmpty(val)) {
			val.forEach(layer => {
				Object.entries(layer).forEach(([key, val]) => {
					migratePositionAttributes(key, val, layer, attributes);
				});
			});
		}
	});
};

export { isEligible, attributes, migrate };
