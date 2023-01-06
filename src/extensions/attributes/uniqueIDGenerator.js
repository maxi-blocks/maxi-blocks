/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';
import { getIsSiteEditor, getTemplatePartSlug } from '../fse';

const generateUniqueID = (blockName, diff = 1) => {
	const newID = `${blockName
		.replace('maxi-blocks/', '')
		.replace(/[0-9]/g, '')}-${diff}`;
	if (getIsUniqueIDRepeated(newID, 0))
		return generateUniqueID(blockName, diff + 1);
	return newID;
};

const uniqueIDGenerator = ({ blockName, diff = 1, clientId }) => {
	const isSiteEditor = getIsSiteEditor();

	let modifiedBlockName = blockName;

	if (isSiteEditor) {
		const templatePartSlug = getTemplatePartSlug(clientId);

		if (templatePartSlug) {
			modifiedBlockName += `-${templatePartSlug}`;
		}

		modifiedBlockName += '-template';

		if (templatePartSlug) modifiedBlockName += '-part';
	}

	return generateUniqueID(modifiedBlockName, diff);
};

export default uniqueIDGenerator;
