/**
 * This is a temporary file to migrate position attribute from 'number' to 'string' and units from non to axis.
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '../getGroupAttributes';
import { isFinite, isEmpty } from 'lodash';

const positionMigrator = ({ attributes, save }) => {
	const targets = ['position', 'blockBackground'];
	const keyWords = ['top', 'right', 'bottom', 'left'];

	// Check if unit no axis
	const unitChecker = key => key.includes('unit') && !key.includes(keyWords);

	const migratePositionAttributes = (key, val, oldAttributes, attributes) => {
		if (key.includes('position')) {
			// Convert number to string
			if (isFinite(val) && attributes?.[key]?.type === 'string')
				oldAttributes[key] = val.toString();

			// Convert non-axis unit to axis unit
			if (unitChecker(key)) {
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

	return {
		isEligible(blockAttributes) {
			const attrsToChange = getGroupAttributes(blockAttributes, targets);

			return Object.entries(attrsToChange).some(([attrKey, attrVal]) => {
				if (attrKey.includes('position')) {
					if (isFinite(attrVal)) {
						const defaultType = attributes[attrKey].type;

						return defaultType === 'string';
					}

					return unitChecker(attrKey);
				}

				if (
					attrKey.includes('background-layers') &&
					!isEmpty(attrVal)
				) {
					return attrVal.some(layer => {
						if (layer.type === 'shape') {
							return Object.entries(layer).some(([key, val]) => {
								if (key.includes('position')) {
									if (isFinite(val)) return true;

									return unitChecker(key);
								}

								return false;
							});
						}

						return false;
					});
				}

				return false;
			});
		},

		attributes: {
			...attributes,
			'position-general': {
				type: 'string',
			},
			'position-xxl': {
				type: 'string',
			},
			'position-xl': {
				type: 'string',
			},
			'position-l': {
				type: 'string',
			},
			'position-m': {
				type: 'string',
			},
			'position-s': {
				type: 'string',
			},
			'position-xs': {
				type: 'string',
			},
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
			'position-sync-general': {
				type: 'string',
				default: 'all',
			},
			'position-sync-xxl': {
				type: 'string',
			},
			'position-sync-xl': {
				type: 'string',
			},
			'position-sync-l': {
				type: 'string',
			},
			'position-sync-m': {
				type: 'string',
			},
			'position-sync-s': {
				type: 'string',
			},
			'position-sync-xs': {
				type: 'string',
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
		},

		migrate(oldAttributes) {
			const attrsToChange = getGroupAttributes(oldAttributes, targets);

			Object.entries(attrsToChange).forEach(([key, val]) => {
				migratePositionAttributes(key, val, oldAttributes, attributes);

				if (key.includes('background-layers') && !isEmpty(val)) {
					val.forEach(layer => {
						Object.entries(layer).forEach(([key, val]) => {
							migratePositionAttributes(
								key,
								val,
								layer,
								attributes
							);
						});
					});
				}
			});

			return oldAttributes;
		},

		save(props) {
			return save(props);
		},
	};
};

export default positionMigrator;
