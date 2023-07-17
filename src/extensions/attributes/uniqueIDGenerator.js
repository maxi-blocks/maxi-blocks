/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

const generateUniqueID = async blockName => {
	const newID = await apiFetch({
		path: `/maxi-blocks/v1.0/unique-id/${blockName}`,
	});
	return newID;
};

const uniqueIDGenerator = async blockName => {
	if (!blockName) return null;
	const modifiedBlockName = blockName.replace('maxi-blocks/', '');
	const newID = await generateUniqueID(modifiedBlockName);
	return `${newID}-u`;
};

export default uniqueIDGenerator;
