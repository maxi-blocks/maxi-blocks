import { COLUMN_MAXI_BLOCK, ROW_MAXI_BLOCK } from './columnMaxiParentGuard';

export const getSelectedBlockInserterRootClientId = ({
	selectedBlockName,
	selectedClientId,
}) => {
	if (!selectedClientId) return null;

	if (
		selectedBlockName === COLUMN_MAXI_BLOCK ||
		selectedBlockName === ROW_MAXI_BLOCK
	)
		return selectedClientId;

	return null;
};
