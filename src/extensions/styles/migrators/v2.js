import blockMigrator from './blockMigrator';

const blockMigratorV2 = ({
	attributes,
	save,
	prefix,
	isContainer = false,
	selectors,
}) => {
	return {
		...blockMigrator({ attributes, save, prefix, isContainer, selectors }),
		save,
	};
};

export default blockMigratorV2;
