/**
 * Internal dependencies
 */
import positionMigrator from './positionMigrator';
import fullWidthNonToResponsiveMigrator from './fullWidthNonToResponsive';
import transformMigrator from './transformMigrator';
import { getMigratorsCombinations, migratorGenerator } from './utils';

const blockMigrator = ({
	attributes,
	save,
	prefix = '',
	migrators: innerBlockMigrators = [],
	isContainer = false,
	selectors,
}) => {
	const migrators = [
		positionMigrator,
		fullWidthNonToResponsiveMigrator,
		transformMigrator,
		...innerBlockMigrators,
	].reverse();

	/**
	 * There are going to be at least 2 types of migrators:
	 * 1. Attributes migrator: updates attributes without affecting the HTML content created by save
	 * 2. Save migrator: updates the HTML content created by save
	 *
	 * Both types share the main part of the migrator (isEligible, attributes and migrate).
	 * First type of migrators shouldn't be affected by second type, that's why they have their own migrator
	 * with a non-modified save function. The second type needs to be added as a standalone migrator and with
	 * different combinations with the rest of the second type.
	 */
	const mainMigrator = {
		isEligible: blockAttributes =>
			migrators.some(migrator =>
				migrator.isEligible(blockAttributes, attributes)
			),

		attributes: {
			...attributes,
			...migrators.reduce((acc, migrator) => {
				return {
					...acc,
					...migrator.attributes(isContainer),
				};
			}, {}),
		},

		migrate: newAttributes => {
			return migrators.reduce(
				(acc, migrator) => {
					if (migrator.isEligible(newAttributes, attributes))
						return migrator.migrate({
							newAttributes: { ...acc },
							attributes,
							prefix,
							selectors,
						});

					return acc;
				},
				{ ...newAttributes }
			);
		},
		save,
	};

	const saveMigrators = getMigratorsCombinations(
		migrators.filter(migrator => migrator.saveMigrator)
	);

	return migratorGenerator({
		mainMigrator,
		saveMigrators,
		save,
		prefix,
	});
};

export default blockMigrator;
