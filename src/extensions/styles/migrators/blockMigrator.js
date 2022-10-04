/**
 * Internal dependencies
 */
import fullWidthNonToResponsiveMigrator from './fullWidthNonToResponsive';
import transformMigrator from './transformMigrator';
import positionToNumberMigrator from './positionToNumberMigrator';
import positionUnitsToAxisMigrator from './positionUnitsToAxisMigrator';
import transformIBMigrator from './transformIBMigrator';
import SVGIBTargetsMigrator from './SVGIBTargetsMigrator';
import transitionTargetIBmigrator from './transitionTargetIBmigrator';
import hoverStatusMigrator from './hoverStatusMigrator';

/**
 * External dependencies
 */
import { compact } from 'lodash';

/**
 * Create a combination of the different migrators, from the most populate ones to the lighter ones.
 */
export const handleBlockMigrator = ({
	attributes,
	save,
	prefix = '',
	isContainer = false,
	selectors,
	migrators,
}) => {
	const createMigrator = combinedMigrator => {
		const result = {};

		const attributesFunctions = compact(
			combinedMigrator.map(migrator => migrator.attributes)
		);
		const migrateFunctions = compact(
			combinedMigrator.map(migrator => migrator.migrate)
		);
		const saveFunctions = compact(
			combinedMigrator.map(migrator => migrator.saveMigrator)
		);

		result.isEligible = () => true;
		result.attributes = {
			...attributes,
			...attributesFunctions.reduce((acc, attributesFunction) => {
				return {
					...acc,
					...attributesFunction(isContainer),
				};
			}, {}),
		};
		result.migrate = newAttributes => {
			return migrateFunctions.reduce(
				(acc, migrateFunction) =>
					migrateFunction({
						newAttributes: { ...acc },
						attributes,
						prefix,
						selectors,
					}),
				{ ...newAttributes }
			);
		};
		if (saveFunctions.length > 0)
			result.save = props => {
				let currentInstance = save(props);

				saveFunctions.forEach((saveMigrator, i) => {
					currentInstance = saveMigrator(
						currentInstance,
						props,
						attributes
					);
				});

				return currentInstance;
			};
		else result.save = save;

		return result;
	};

	const result = [createMigrator(migrators)];

	return result;
};

const blockMigrator = blockMigratorProps => {
	const migrators = [
		positionToNumberMigrator,
		positionUnitsToAxisMigrator,
		fullWidthNonToResponsiveMigrator,
		transformMigrator,
		transformIBMigrator,
		SVGIBTargetsMigrator,
		transitionTargetIBmigrator,
		hoverStatusMigrator,
		...(blockMigratorProps.migrators ?? []),
	];

	return handleBlockMigrator({ ...blockMigratorProps, migrators });
};

export default blockMigrator;
