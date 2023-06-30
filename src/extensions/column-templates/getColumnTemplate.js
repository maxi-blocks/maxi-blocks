/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';
import getColumnTemplateContent from './getColumnTemplateContent';

/**
 * External dependencies
 */
import { find } from 'lodash';

const getColumnContent = (
	columns,
	breakpoint,
	avoidRowAttributesChange = false
) => {
	return {
		content: getColumnTemplateContent(columns, breakpoint),
		attributes: !avoidRowAttributesChange
			? {
					[`flex-wrap-${breakpoint}`]: 'wrap',
					[`column-gap-${breakpoint}`]: 2.5,
					[`column-gap-unit-${breakpoint}`]: '%',
			  }
			: {},
	};
};
// TODO: hide repeater on non general
const getColumnTemplate = (
	templateName,
	breakpoint,
	numCol,
	avoidRowAttributesChange
) => {
	let template = null;

	Object.values(columnTemplates).forEach(colNum =>
		Object.values(colNum).forEach(colRes => {
			const res = find(colRes, e => e.name === templateName);

			if (res)
				template = getColumnContent(
					res.sizes || Array(numCol).fill(1 / numCol),
					breakpoint,
					avoidRowAttributesChange
				);
		})
	);

	return template;
};

export default getColumnTemplate;
