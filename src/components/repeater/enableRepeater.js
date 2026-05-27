/**
 * Internal dependencies
 */
import { getAttributeKey } from '@extensions/styles';
import { validateRowColumnsStructure } from '@extensions/repeater';

const enableRepeater = async ({
	clientId,
	updateInnerBlocksPositions,
	requestStructureConfirmation,
	markNextChangeAsNotPersistent,
	onChange,
}) => {
	const initialInnerBlocksPositions = updateInnerBlocksPositions();

	const isStructureValidated = await validateRowColumnsStructure(
		clientId,
		initialInnerBlocksPositions,
		requestStructureConfirmation,
		undefined,
		true,
		true
	);

	if (!isStructureValidated) {
		return false;
	}

	// Validation can clone first-column blocks into the other columns, so refresh
	// the repeater map before later attribute changes try to sync same-position blocks.
	updateInnerBlocksPositions();
	markNextChangeAsNotPersistent();
	onChange({
		[getAttributeKey('repeater-status')]: true,
	});

	return true;
};

export default enableRepeater;
