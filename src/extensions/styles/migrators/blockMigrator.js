import positionMigrator from './positionMigrator';
import fullWidthNonToResponsiveMigrator from './fullWidthNonToResponsive';

export const blockMigrator = ({
	attributes,
	save,
	prefix = '',
	migrators: innerBlockMigrators = [],
	isContainer = false,
}) => {
	const migrators = [
		positionMigrator,
		fullWidthNonToResponsiveMigrator,
		...innerBlockMigrators,
	];

	return {
		isEligible(blockAttributes) {
			return migrators.some(migrator =>
				migrator.isEligible(blockAttributes)
			);
		},

		attributes: migrators.reduce(
			(acc, migrator) => ({
				...acc,
				...migrator.attributes(isContainer),
			}),
			{ ...attributes }
		),

		migrate(oldAttributes) {
			return migrators.reduce(
				(acc, migrator) => {
					if (migrator.isEligible(oldAttributes)) {
						return {
							...acc,
							...migrator.migrate({
								newAttributes: { ...oldAttributes },
								attributes,
								prefix,
							}),
						};
					}

					return acc;
				},
				{ ...oldAttributes }
			);
		},

		save(props) {
			const saveProps = migrators.reduce(
				(acc, migrator) => {
					if (migrator.saveProps)
						return migrator.saveProps(prefix, acc);

					return acc;
				},
				{ props, extendedAttributes: {} }
			);

			return save(saveProps.props, saveProps.extendedAttributes);
		},
	};
};

export default blockMigrator;
