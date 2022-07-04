import blockMigrator from './blockMigrator';
import blockMigratorV2 from './v2';

const getMigrators = ({ attributes, save, prefix, isContainer = false }) => [
	blockMigratorV2({ attributes, save, prefix, isContainer }),
	blockMigrator({ attributes, save, prefix, isContainer }),
];

export default getMigrators;
