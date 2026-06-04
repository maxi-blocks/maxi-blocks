/**
 * Internal dependencies
 */
import getAttributeValue from '@extensions/styles/getAttributeValue';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const hasUsableClipPath = clipPath => !!clipPath && clipPath !== 'none';

/**
 *
 * @param {Object} obj Block clip-path properties
 */
const getClipPathStyles = ({ obj, isHover = false, isIB = false }) => {
	const response = {};

	let omitClipPath = !isHover && !isIB;
	breakpoints.forEach(breakpoint => {
		const currentClipPath = getAttributeValue({
			target: 'clip-path',
			props: obj,
			isHover,
			breakpoint,
		});
		const isCurrentBreakpointDisabled =
			!isHover &&
			getAttributeValue({
				target: 'clip-path-status',
				props: obj,
				isHover,
				breakpoint,
				returnValueWithoutBreakpoint: false,
			}) === false;
		const inheritedClipPath = isCurrentBreakpointDisabled
			? getLastBreakpointAttribute({
					target: 'clip-path',
					breakpoint,
					attributes: obj,
					isHover,
			  })
			: null;
		const shouldResetClipPath =
			isCurrentBreakpointDisabled &&
			hasUsableClipPath(inheritedClipPath || currentClipPath);

		omitClipPath = omitClipPath
			? !currentClipPath || currentClipPath === 'none'
			: false;
		if (omitClipPath) return;

		response[breakpoint] = {
			...(shouldResetClipPath && { 'clip-path': 'none' }),
			...(!shouldResetClipPath &&
				currentClipPath &&
				(isHover
					? obj['clip-path-status-hover']
					: getLastBreakpointAttribute({
							target: 'clip-path-status',
							breakpoint,
							attributes: obj,
							isHover,
					  })) && {
					'clip-path': currentClipPath,
				}),
		};
	});

	return response;
};

export default getClipPathStyles;
