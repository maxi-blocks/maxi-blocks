import positionMigrator from './positionMigrator';
import fullWidthNonToResponsiveMigrator from './fullWidthNonToResponsive';

const blockMigrator = ({
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

	return migrators.map(migrator => {
		const {
			isEligible,
			attributes: newAttributes,
			migrate,
			saveProps,
		} = migrator;

		return {
			isEligible: blockAttributes =>
				isEligible(blockAttributes, attributes),
			attributes: { ...attributes, ...newAttributes(isContainer) },
			migrate: oldAttributes =>
				migrate({
					newAttributes: { ...oldAttributes },
					attributes,
					prefix,
				}),
			save: props =>
				saveProps
					? save(
							...saveProps(prefix, {
								props,
								extendedAttributes: {},
							})
					  )
					: save(props),
		};
	});
};

export default blockMigrator;
