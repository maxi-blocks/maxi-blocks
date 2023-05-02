/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';
import getColumnTemplateContent from './getColumnTemplateContent';

/**
 * External dependencies
 */
import { find } from 'lodash';

const getColumnContent = (columns, breakpoint) => {
	return {
		content: getColumnTemplateContent(columns, breakpoint),
		attributes: {
			[`_flw-${breakpoint}`]: 'wrap',
			[`_cg-${breakpoint}`]: 2.5,
			[`_cg.u-${breakpoint}`]: '%',
		},
	};
};

const getColumnTemplate = (templateName, breakpoint) => {
	let template = null;

	Object.values(columnTemplates).forEach(colNum =>
		Object.values(colNum).forEach(colRes => {
			const res = find(colRes, e => e.name === templateName);

			if (res) template = getColumnContent(res.sizes, breakpoint);
		})
	);

	return template;
};

export default getColumnTemplate;
