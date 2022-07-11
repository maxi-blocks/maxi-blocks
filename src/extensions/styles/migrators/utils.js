/**
 * Returns all migrators saveMigrator combinations
 */
export const getMigratorsCombinations = migrators => {
	const result = [];

	const combinator = (props, migrators) => {
		for (let i = 0; i < migrators.length; i += 1) {
			result.push([...props, migrators[i].saveMigrator]);

			combinator(
				[...props, migrators[i].saveMigrator],
				migrators.slice(i + 1)
			);
		}
	};

	combinator([], migrators);

	return result;
};

/**
 * Generates an array of migrators
 */
export const migratorGenerator = ({
	mainMigrator,
	saveMigrators,
	save,
	prefix = '',
}) => [
	...mainMigrator,
	...saveMigrators.map(migrator => {
		return {
			...mainMigrator,
			save: props => {
				let currentInstance = save(props);

				migrator.forEach(saveMigrator => {
					currentInstance = saveMigrator(currentInstance, props);
				});

				return currentInstance;
			},
		};
	}),
];
