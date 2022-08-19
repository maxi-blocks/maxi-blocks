/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';
import { getIsSiteEditor, getIsTemplatePart } from '../fse';

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

const generateUniqueID = (blockName, diff = 1) => {
	const newID = `${blockName
		.replace('maxi-blocks/', '')
		.replace(/[0-9]/g, '')}-${diff}`;
	if (getIsUniqueIDRepeated(newID, 0))
		return generateUniqueID(blockName, diff + 1);
	return newID;
};

const uniqueIDGenerator = (blockName, diff = 1) => {
	const isSiteEditor = getIsSiteEditor();
	const isTemplatePart = getIsTemplatePart();

	let modifiedBlockName = blockName;

	if (isSiteEditor) {
		if (isTemplatePart) {
			const id =
				isSiteEditor &&
				select('core/edit-site').getEditedPostId().split('//', 2)[1];

			modifiedBlockName += `-${id}`;
		}

		modifiedBlockName += '-template';

		if (isTemplatePart) modifiedBlockName += '-part';
	}

	return generateUniqueID(modifiedBlockName, diff);
};

export default uniqueIDGenerator;
