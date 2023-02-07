/**
 * Internal dependencies
 */
import {
	getIsSiteEditor,
	getTemplatePartChooseList,
	getTemplatePartSlug,
} from '../fse';

/**
 * Checks if the `uniqueID` has valid structure(suffix).
 * On pasting code editor content, `uniqueID` needs to have the same structure as
 * other blocks in the current editor.
 *
 * @param {string} uniqueID
 * @param {string} clientId
 * @returns {boolean} Returns `true` if the `uniqueID` has valid structure(suffix), `false` otherwise.
 */
const uniqueIDStructureChecker = (uniqueID, clientId) => {
	const templatePartSlug = getTemplatePartSlug(clientId);
	const templatePartUniqueIDSuffix = 'template-part';

	if (
		(!getIsSiteEditor() && uniqueID.includes('template-')) ||
		(getIsSiteEditor() && !uniqueID.includes('template-')) ||
		(!getTemplatePartChooseList() &&
			((templatePartSlug &&
				!uniqueID.includes(templatePartUniqueIDSuffix)) ||
				(!templatePartSlug &&
					uniqueID.includes(templatePartUniqueIDSuffix))))
	)
		return false;

	return true;
};

export default uniqueIDStructureChecker;
