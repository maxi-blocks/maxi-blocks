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
import hoverToggleBreakpointMigrator from './hoverToggleBreakpointMigrator';
import bottomGapMigrator from './bottomGapMigrator';
import transitionMigrator from './transitionMigrator';
import fullWidthAttributeMigrator from './fullWidthAttributeMigrator';
import IBLabelToIDMigrator from './IBLabelToIDMigrator';
import uniqueIDMigrator from './uniqueIDMigrator';
import SVGMarkerSizeMigrator from './SVGMarkerSizeMigrator';
import dcLinkBlocksMigrator from './dcLinkBlocksMigrator';
import DCClassNameMigrator from './DCClassNameMigrator';
import imageResponsiveWidth from './imageResponsiveWidth';
import scrollEffectsMigrator from './scrollEffectsMigrator';
import inlineDCLinkMigrator from './inlineDCLinkMigrator';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

// Cache for deprecated blocks
const deprecatedBlockCache = new Map();

const handleBlockMigrator = ({
	attributes,
	save,
	isContainer = false,
	migrators,
}) => {
	return migrators.map(migrator => {
		const newMigrator = { ...migrator };

		// Optimize attributes creation
		newMigrator.attributes = {
			...attributes,
			...(newMigrator.attributes?.(isContainer, attributes) ?? {}),
		};

		const originalMigrate = newMigrator.migrate;

		if (originalMigrate) {
			newMigrator.migrate = originalAttributes => {
				const { uniqueID } = originalAttributes;

				// Use cache for deprecated blocks
				let prevAttr = deprecatedBlockCache.get(uniqueID);
				if (!prevAttr) {
					prevAttr =
						select('maxiBlocks').receiveDeprecatedBlock(uniqueID);
					if (prevAttr) {
						deprecatedBlockCache.set(uniqueID, prevAttr);
					}
				}

				const newAttributes = {
					...originalAttributes,
					...(!isNil(prevAttr) && { ...prevAttr }),
				};

				const result = originalMigrate(newAttributes);

				dispatch('maxiBlocks').saveDeprecatedBlock({
					uniqueID,
					attributes: result,
					ignoreAttributesForSave:
						newMigrator.ignoreAttributesForSave,
				});

				// eslint-disable-next-line no-console
				console.log(
					`${newMigrator.name} migrator has been successfully used to update ${newAttributes.customLabel}(${uniqueID})`
				);

				return result;
			};
		}

		if (!newMigrator.save) {
			newMigrator.save = save;
		}

		const originalSave = newMigrator.save;
		if (originalSave) {
			newMigrator.save = props => {
				const { uniqueID } = props.attributes;

				// Use cache for deprecated blocks
				let prevAttr = deprecatedBlockCache.get(uniqueID);
				if (!prevAttr) {
					prevAttr = select('maxiBlocks').receiveDeprecatedBlock(
						uniqueID,
						true
					);
					if (prevAttr) {
						deprecatedBlockCache.set(uniqueID, prevAttr);
					}
				}

				if (!isNil(prevAttr)) {
					Object.assign(props.attributes, prevAttr);
				}

				return originalSave(props);
			};
		}

		return newMigrator;
	});
};

// Pre-define migrators array for better performance
const defaultMigrators = [
	positionToNumberMigrator,
	positionUnitsToAxisMigrator,
	fullWidthAttributeMigrator,
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
	hoverToggleBreakpointMigrator,
	bottomGapMigrator,
	transitionMigrator,
	IBLabelToIDMigrator,
	SVGMarkerSizeMigrator,
	dcLinkBlocksMigrator,
	DCClassNameMigrator,
	imageResponsiveWidth,
	uniqueIDMigrator,
	scrollEffectsMigrator,
	inlineDCLinkMigrator,
];

const blockMigrator = blockMigratorProps => {
	const migrators = [
		...defaultMigrators,
		...(blockMigratorProps.migrators ?? []),
	];

	return handleBlockMigrator({ ...blockMigratorProps, migrators });
};

export default blockMigrator;
