/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';
import getColumnTemplateContent from './getColumnTemplateContent';

/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 *
 * @param {*} templateName
 * @param {*} removeColumnGap
 */

const getColumnTemplate = (
	templateName,
	removeColumnGap = false,
	breakpoint
) => {
	let template = null;

	Object.values(columnTemplates).forEach(colNum =>
		Object.values(colNum).forEach(colRes => {
			const res = find(colRes, e => e.name === templateName);

			if (res) template = res;
		})
	);

	template.content = getColumnTemplateContent(
		template.sizes,
		removeColumnGap,
		breakpoint
	);

	return template;
};

export default getColumnTemplate;
