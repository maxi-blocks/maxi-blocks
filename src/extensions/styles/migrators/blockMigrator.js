/**
 * Internal dependencies
 */
import positionMigrator from './positionMigrator';
import fullWidthNonToResponsiveMigrator from './fullWidthNonToResponsive';
import transformMigrator from './transformMigrator';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
	];

	return [
		{
			isEligible: blockAttributes =>
				migrators.some(migrator =>
					migrator.isEligible(blockAttributes, attributes)
				),

			attributes: {
				...attributes,
				...migrators.reduce((acc, migrator) => {
					return { ...acc, ...migrator.attributes(isContainer) };
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

			save: props => {
				const [
					saveProps,
					extendedWrapperAttributes,
					extendedAttributes,
				] = migrators.reduce(
					(acc, migrator) => {
						if (migrator.getSaveProps)
							return migrator.getSaveProps(prefix, acc);

						return acc;
					},
					[props, {}, {}]
				);

				if (!isEmpty(saveProps)) {
					return save(
						saveProps,
						extendedWrapperAttributes,
						extendedAttributes
					);
				}

				return save(props);
			},
		},
	];
};

export default blockMigrator;
