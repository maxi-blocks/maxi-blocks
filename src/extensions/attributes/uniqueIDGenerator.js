/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';
import { getIsSiteEditor, getTemplatePartSlug } from '../fse';

const generateUniqueID = async blockName => {
	console.log('generateUniqueID');
	console.log('blockName', blockName);
	const { receiveMaxiUniqueID } = select('maxiBlocks');
	const newID = await receiveMaxiUniqueID(blockName); // Await the result of the selector

	console.log('newID:', newID);
	return newID;
};

// const uniqueIDGenerator = ({ blockName, diff = 1, clientId }) => {
// 	const isSiteEditor = getIsSiteEditor();

// 	let modifiedBlockName = blockName;

// 	if (isSiteEditor) {
// 		const templatePartSlug = getTemplatePartSlug(clientId);

// 		if (templatePartSlug) {
// 			modifiedBlockName += `-${templatePartSlug}`;
// 		}

// 		modifiedBlockName += '-template';

// 		if (templatePartSlug) modifiedBlockName += '-part';
// 	}

// 	return generateUniqueID(modifiedBlockName, diff);
// };

const uniqueIDGenerator = blockName => {
	console.log('uniqueIDGenerator');
	console.log('blockName', blockName);
	if (!blockName) return null;
	const modifiedBlockName = blockName.replace('maxi-blocks/', '');
	return generateUniqueID(modifiedBlockName);
};

export default uniqueIDGenerator;
