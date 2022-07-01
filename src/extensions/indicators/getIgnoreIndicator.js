/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';

const getIgnoreIndicator = ({
	attributes,
	breakpoint = 'general',
	ignoreGroupAttributes,
	isHover = false,
	prefix = '',
	target,
	valueToCompare,
}) => {
	const ignoreIndicator = [];

	const targetKey = `${prefix}${target}${breakpoint ? `-${breakpoint}` : ''}${
		isHover ? '-hover' : ''
	}`;

	const targetValue = attributes[targetKey];

	if (
		(!isNil(valueToCompare) && targetValue === valueToCompare) ||
		!targetValue
	) {
		const ignoreGroupAttributesKeys = Object.keys(
			getGroupAttributes(
				attributes,
				ignoreGroupAttributes,
				isHover,
				prefix
			)
		).filter(attribute =>
			breakpoint ? attribute.includes(`-${breakpoint}`) : true
		);

		ignoreIndicator.push(...ignoreGroupAttributesKeys);
	}

	return ignoreIndicator;
};

export default getIgnoreIndicator;
