/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

const getDividerOrientation = (attributes, deviceType) =>
	getLastBreakpointAttribute({
		target: 'line-orientation',
		breakpoint: deviceType,
		attributes,
	});

export const getDividerEditClasses = (attributes, deviceType) => {
	const { uniqueID } = attributes;
	const lineOrientation = getDividerOrientation(attributes, deviceType);

	return classnames(
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal',
		'maxi-divider-block__resizer',
		`maxi-divider-block__resizer__${uniqueID}`
	);
};
