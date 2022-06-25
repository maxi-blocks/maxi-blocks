/**
 * This is a temporary file to migrate position attribute from 'number' to 'string' and units from non to axis.
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '../getGroupAttributes';
import { isEmpty, isFinite } from 'lodash';
import breakpointAttributesCreator from '../breakpointAttributesCreator';

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

const attributes = breakpointAttributesCreator({
	obj: {
		...keyWords.reduce((acc, keyWord) => {
			acc[`position-${keyWord}`] = {
				type: 'number',
			};

			return acc;
		}, {}),
		'position-unit': {
			type: 'string',
			default: 'px',
		},
	},
});

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
