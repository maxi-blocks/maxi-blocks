/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import fullWidthNonToResponsiveMigrator from './fullWidthNonToResponsive';
import transformMigrator from './transformMigrator';
import positionToNumberMigrator from './positionToNumberMigrator';
import positionUnitsToAxisMigrator from './positionUnitsToAxisMigrator';
import transformIBMigrator from './transformIBMigrator';
import SVGIBTargetsMigrator from './SVGIBTargetsMigrator';
import IBEffectsMigrator from './IBEffectsMigrator';
import hoverStatusMigrator from './hoverStatusMigrator';
import backgroundSizeMigrator from './backgroundSizeMigrator';
import opacityTransitionMigrator from './opacityTransitionMigrator';
import maxiAttributesMigrator from './maxiAttributesMigrator';
import transformIBTargetMigrator from './transformIBTargetMigrator';
import backgroundPositionMigrator from './backgroundPositionMigrator';
import disableTransitionIBMigrator from './disableTransitionIBMigrator';
import corruptedHoverAttributesMigrator from './corruptedHoverAttributesMigrator';
import bottomGapMigrator from './bottomGapMigrator';
import transitionMigrator from './transitionMigrator';
import fullWidthAttributeMigrator from './fullWidthAttributeMigrator';
import IBLabelToIDMigrator from './IBLabelToIDMigrator';
import uniqueIDMigrator from './uniqueIDMigrator';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Create a combination of the different migrators, from the most populate ones to the lighter ones.
 */
export const handleBlockMigrator = ({
	attributes,
	save,
	isContainer = false,
	migrators,
}) =>
	migrators.map(migrator => {
		const newMigrator = { ...migrator };

		newMigrator.attributes = {
			...attributes,
			...(newMigrator.attributes?.(isContainer, attributes) ?? {}),
		};

		const originalMigrate = newMigrator.migrate;

		if (originalMigrate)
			newMigrator.migrate = originalAttributes => {
				// Here is where we cheat a bit. Gutenberg doesn't support chain updates,
				// so, to avoid having multiple deprecation versions of each block and considering
				// our migrators global (affect all blocks), we are saving the previous deprecation
				// attributes and merging into a new object that will suffer the migration.
				const { uniqueID } = originalAttributes;

				const prevAttr =
					select('maxiBlocks').receiveDeprecatedBlock(uniqueID);

				const newAttributes = {
					...originalAttributes,
					...(!isNil(prevAttr) && { ...prevAttr }),
				};

				const result = originalMigrate(newAttributes);

				dispatch('maxiBlocks').saveDeprecatedBlock({
					uniqueID,
					attributes: result,
				});

				// eslint-disable-next-line no-console
				console.log(
					`${newMigrator.name} migrator has been successfully used to update ${newAttributes.customLabel}(${uniqueID})`
				);

				return result;
			};

		if (!newMigrator.save) newMigrator.save = save;

		const originalSave = newMigrator.save;
		if (originalSave) {
			newMigrator.save = props => {
				const { uniqueID } = props.attributes;

				const prevAttr =
					select('maxiBlocks').receiveDeprecatedBlock(uniqueID);

				if (!isNil(prevAttr))
					Object.keys(prevAttr).forEach(key => {
						props.attributes[key] = prevAttr[key];
					});

				return originalSave(props);
			};
		}

		return newMigrator;
	});

const blockMigrator = blockMigratorProps => {
	const migrators = [
		positionToNumberMigrator,
		positionUnitsToAxisMigrator,
		fullWidthNonToResponsiveMigrator,
		transformMigrator,
		transformIBMigrator,
		SVGIBTargetsMigrator,
		IBEffectsMigrator,
		hoverStatusMigrator,
		backgroundSizeMigrator,
		opacityTransitionMigrator,
		maxiAttributesMigrator,
		transformIBTargetMigrator,
		backgroundPositionMigrator,
		disableTransitionIBMigrator,
		corruptedHoverAttributesMigrator,
		bottomGapMigrator,
		transitionMigrator,
		fullWidthAttributeMigrator,
		IBLabelToIDMigrator,
		uniqueIDMigrator,
		...(blockMigratorProps.migrators ?? []),
	];

	return handleBlockMigrator({ ...blockMigratorProps, migrators });
};

export default blockMigrator;
