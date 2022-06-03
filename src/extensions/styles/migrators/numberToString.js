/**
 * This is a temporary file to migrate attributes with type `number` to `string`
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '../getGroupAttributes';
import { isFinite } from 'lodash';

const fromNumberToStringMigrator = ({ attributes, save }) => {
	const targets = ['padding', 'size', 'icon', 'svg', 'position'];

	return {
		isEligible(blockAttributes) {
			const attrsToChange = getGroupAttributes(blockAttributes, targets);

			return Object.entries(attrsToChange).some(([attrKey, attrVal]) => {
				if (isFinite(attrVal)) {
					const defaultType = attributes[attrKey].type;

					return defaultType === 'string';
				}

				return false;
			});
		},

		migrate(oldAttributes) {
			const attrsToChange = getGroupAttributes(oldAttributes, targets);

			Object.entries(attrsToChange).forEach(([key, val]) => {
				if (isFinite(val) && attributes?.[key]?.type === 'string')
					oldAttributes[key] = val.toString();
			});

			return oldAttributes;
		},

		save(props) {
			return save(props);
		},
	};
};

export default fromNumberToStringMigrator;
