/**
 * Internal dependencies
 */
import getTemplateObject from './getTemplateObject';

/**
 * Get columns Number based on the template name
 *
 * @param {string} templateName name of the template
 * @return {Integer} Number of Columns for the corresponding template
 */
function getNumCol(templateName) {
	if (Number(templateName)) return Number(templateName);
	let newTemplateName = templateName;

	if (templateName.indexOf('custom-') !== -1) {
		newTemplateName = templateName.slice(7);
	}

	const template = getTemplateObject(newTemplateName);

	return template.sizes.length;
}

export default getNumCol;
