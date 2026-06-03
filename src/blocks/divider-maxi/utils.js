/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

/**
 * Resolves the divider orientation for the given breakpoint.
 * Falls back to the legacy camelCase `lineOrientation` attribute
 * so old blocks saved before the breakpoint schema still resolve
 * correctly instead of defaulting to 'horizontal'.
 *
 * @param {Object}  attributes Block attributes.
 * @param {string=} deviceType Current breakpoint (e.g. 'general', 'm', 's').
 * @return {string} 'horizontal' | 'vertical'
 */
export const getDividerOrientation = (attributes, deviceType) => {
	const resolved = getLastBreakpointAttribute({
		target: 'line-orientation',
		breakpoint: deviceType,
		attributes,
	});

	if (resolved) return resolved;

	return attributes?.lineOrientation ?? 'horizontal';
};

export const getDividerResizerSize = (attributes, deviceType = 'general') => {
	const width = getLastBreakpointAttribute({
		target: 'width',
		breakpoint: deviceType,
		attributes,
	});
	const widthUnit = getLastBreakpointAttribute({
		target: 'width-unit',
		breakpoint: deviceType,
		attributes,
	});
	const height = getLastBreakpointAttribute({
		target: 'height',
		breakpoint: deviceType,
		attributes,
	});
	const heightUnit = getLastBreakpointAttribute({
		target: 'height-unit',
		breakpoint: deviceType,
		attributes,
	});
	const forceAspectRatio = getLastBreakpointAttribute({
		target: 'force-aspect-ratio',
		breakpoint: deviceType,
		attributes,
	});

	return {
		width: width ? `${width}${widthUnit}` : '100%',
		height: forceAspectRatio ? 'auto' : `${height}${heightUnit}`,
	};
};

export const syncDividerResizerSize = (
	resizableObject,
	attributes,
	deviceType = 'general'
) => {
	const resizer = resizableObject?.current;

	if (!resizer) return false;

	const nextSize = getDividerResizerSize(attributes, deviceType);
	const { width: currentWidth, height: currentHeight } = resizer.state || {};
	let didSync = false;

	if (
		currentWidth !== nextSize.width ||
		currentHeight !== nextSize.height
	) {
		resizer.updateSize(nextSize);
		didSync = true;
	}

	if (resizer.resizable?.style) {
		if (resizer.resizable.style.width !== nextSize.width) {
			resizer.resizable.style.width = nextSize.width;
			didSync = true;
		}

		if (resizer.resizable.style.height !== nextSize.height) {
			resizer.resizable.style.height = nextSize.height;
			didSync = true;
		}
	}

	return didSync;
};

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
