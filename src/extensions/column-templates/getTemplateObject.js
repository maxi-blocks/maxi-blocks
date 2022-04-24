/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';

/**
 * Get Template Object
 *
 * @param {string} templateName Name of template
 * @return {Object} template Object
 */
function getTemplateObject(templateName) {
	const allTemplates = [];

	Object.values(columnTemplates).forEach(value => {
		value.default.forEach(template => {
			allTemplates.push(template);
		});

		value.responsive.forEach(template => {
			allTemplates.push(template);
		});
	});

	const template = allTemplates.find(
		template => template.name === templateName
	);

	return template;
}

export default getTemplateObject;
