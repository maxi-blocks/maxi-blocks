import { isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getResponsiveAttributeKeys = attributes => {
	const responsiveAttributes = [];

	if (isEmpty(attributes)) return responsiveAttributes;

	attributes.forEach(attribute => {
		breakpoints.forEach(breakpoint => {
			responsiveAttributes.push(`${attribute}-${breakpoint}`);
		});
	});

	return responsiveAttributes;
};

export default getResponsiveAttributeKeys;
