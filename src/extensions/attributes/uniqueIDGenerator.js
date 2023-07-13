/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

const generateUniqueID = async blockName => {
	console.log('generateUniqueID');
	console.log('blockName', blockName);
	const newID = await apiFetch({
		path: `/maxi-blocks/v1.0/unique-id/${blockName}`,
	});
	console.log('newID', newID);
	return newID;
};

const uniqueIDGenerator = async blockName => {
	console.log('uniqueIDGenerator');
	console.log('blockName', blockName);
	if (!blockName) return null;
	const modifiedBlockName = blockName.replace('maxi-blocks/', '');
	const newID = await generateUniqueID(modifiedBlockName);
	return newID;
};

export default uniqueIDGenerator;
