import blockMigrator from './blockMigrator';
import blockMigratorV2 from './v2';

const getMigrators = ({
	attributes,
	save,
	prefix,
	isContainer = false,
	selectors,
}) => [
	blockMigratorV2({ attributes, save, prefix, isContainer, selectors }),
	blockMigrator({ attributes, save, prefix, isContainer, selectors }),
];

export default getMigrators;
