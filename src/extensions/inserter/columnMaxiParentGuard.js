export const COLUMN_MAXI_BLOCK = 'maxi-blocks/column-maxi';
export const ROW_MAXI_BLOCK = 'maxi-blocks/row-maxi';

export const restrictColumnMaxiToRow = ({
	canInsert,
	blockName,
	rootClientId,
	getBlock,
}) => {
	if (blockName !== COLUMN_MAXI_BLOCK) return canInsert;

	if (!canInsert) return false;

	if (!rootClientId || typeof getBlock !== 'function') return canInsert;

	return getBlock(rootClientId)?.name === ROW_MAXI_BLOCK;
};
