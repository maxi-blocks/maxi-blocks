import { select } from '@wordpress/data';

const getParentRowClientId = columnClientId => {
	const { getBlockParentsByBlockName } = select('core/block-editor');

	// Returning last row clientId from the array of column parents
	return getBlockParentsByBlockName(
		columnClientId,
		'maxi-blocks/row-maxi'
	).at(-1);
};

export default getParentRowClientId;
