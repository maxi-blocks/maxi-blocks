/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';
import getColumnTemplateContent from './getColumnTemplateContent';

/**
 * External dependencies
 */
import { find } from 'lodash';

const getColumnTemplate = (templateName, breakpoint) => {
	let template = null;

	Object.values(columnTemplates).forEach(colNum =>
		Object.values(colNum).forEach(colRes => {
			const res = find(colRes, e => e.name === templateName);

			if (res) template = res;
		})
	);

	template.content = getColumnTemplateContent(template.sizes, breakpoint);

	// In case is not a responsive layout add `nowrap` on the responsive stage value
	if (template.responsiveLayout)
		template.attributes = {
			...template.attributes,
			[`flex-wrap-${breakpoint}`]: 'nowrap',
		};

	return template;
};

export default getColumnTemplate;
