import blockMigrator from './blockMigrator';

const blockMigratorV2 = ({ attributes, save, prefix, isContainer = false }) => {
	return {
		...blockMigrator({ attributes, save, prefix, isContainer }),
		save,
	};
};

export default blockMigratorV2;
