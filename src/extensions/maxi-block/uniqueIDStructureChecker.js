/**
 * Internal dependencies
 */
import {
	getIsSiteEditor,
	getTemplatePartChooseList,
	getTemplatePartSlug,
} from '../fse';

/**
 * @param {string} uniqueID
 * @param {string} clientId
 * @returns {boolean} Returns `true` if the `uniqueID` has valid structure(suffix), `false` otherwise.
 */

const uniqueIDStructureChecker = (uniqueID, clientId) => {
	const templatePartSlug = getTemplatePartSlug(clientId);
	const templatePartUniqueIDSuffix = 'template-part';

	if (
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
