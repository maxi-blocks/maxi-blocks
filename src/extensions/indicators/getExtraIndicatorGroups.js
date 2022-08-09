/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';

const getExtraIndicatorGroups = ({
	attributes,
	breakpoint,
	extraIndicatorGroups = [],
	isHover = false,
	prefix = '',
}) => {
	const extraAttributes = [];

	extraIndicatorGroups.forEach(group =>
		extraAttributes.push(
			...getGroupAttributes(attributes, group, isHover, prefix)
		)
	);

	if (breakpoint)
		return extraAttributes.filter(attribute =>
			attribute.includes(`-${breakpoint}`)
		);

	return extraAttributes;
};

export default getExtraIndicatorGroups;
