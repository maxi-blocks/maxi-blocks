import { isNil } from 'lodash';
import { getAttrKeyWithoutBreakpoint } from '../utils';
import bottomGapMigrator from './bottomGapMigrator';

const name = 'Typography Units Defaults';

const maxiVersions = [
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
	'1.0.0-RC1',
	'1.0.0-RC2',
	'1.0.0-beta',
	'1.0.0-beta-2',
	'wp-directory-beta-1',
	'1.0.0',
	'1.0.1',
	'1.1.0',
	'1.1.1',
	'1.2.0',
	'1.2.1',
	'1.3',
	'1.3.1',
	'1.4.1',
	'1.4.2',
	'1.5.0',
	'1.5.1',
	'1.5.2',
	'1.5.3',
	'1.5.4',
	'1.5.5',
	'1.5.6',
	'1.5.7',
	'1.5.8',
	'1.6.0',
	'1.6.1',
	'1.7.0',
	'1.7.1',
	'1.7.2',
	'1.7.3',
	'1.8.0',
	'1.8.1',
	'1.8.2',
	'1.8.3',
	'1.8.4',
	'1.8.5',
];

const affectedAttributes = [
	'font-size',
	'line-height',
	'letter-spacing',
	'text-indent',
	'word-spacing',
	'bottom-gap',
];

// Only changed typography attributes are eligible
const isEligibleAttr = (attr, blockAttributes) => {
	if (isNil(blockAttributes[attr])) return false;

	if (attr === 'custom-formats') {
		return true;
	}

	const simpleLabel = getAttrKeyWithoutBreakpoint(attr);
	const unitLabel = `${simpleLabel}-unit-general`;

	return (
		!simpleLabel.includes('unit') &&
		affectedAttributes.some(affectedAttribute =>
			simpleLabel.includes(affectedAttribute)
		) &&
		isNil(blockAttributes[unitLabel])
	);
};

const isEligible = blockAttributes => {
	const { 'maxi-version-current': maxiVersionCurrent } = blockAttributes;

	return (
		(maxiVersions.includes(maxiVersionCurrent) &&
			Object.keys(blockAttributes).some(attr =>
				isEligibleAttr(attr, blockAttributes)
			)) ||
		bottomGapMigrator.isEligible(blockAttributes)
	);
};

const migrate = newAttributes => {
	const changedAttributes = {};

	Object.keys(newAttributes).forEach(attr => {
		if (isEligibleAttr(attr, newAttributes)) {
			if (attr === 'custom-formats') {
				Object.entries(newAttributes[attr] ?? {}).forEach(
					([formatName, formatValues]) => {
						Object.entries(formatValues ?? {}).forEach(
							([formatAttr, formatValue]) => {
								if (
									isEligibleAttr(formatAttr, {
										...newAttributes,
										...formatValues,
									})
								) {
									const simpleLabel =
										getAttrKeyWithoutBreakpoint(formatAttr);
									const unitLabel = `${simpleLabel}-unit-general`;

									// Set the old default value explicitly
									changedAttributes[unitLabel] = 'px';
								}
							}
						);
					}
				);
			}

			const simpleLabel = getAttrKeyWithoutBreakpoint(attr);
			const unitLabel = `${simpleLabel}-unit-general`;

			// Set the old default value explicitly
			changedAttributes[unitLabel] = 'px';
		}
	});

	// Since bottom-gap can be added by a migrator, add check to enusre it will have the default value
	if (bottomGapMigrator.isEligible(newAttributes)) {
		changedAttributes['bottom-gap-unit-general'] = 'px';
	}

	return { ...newAttributes, ...changedAttributes };
};

export default { name, isEligible, migrate };
