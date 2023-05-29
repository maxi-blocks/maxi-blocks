/**
 * Internal dependencies
 */
import getAttributesValue from '../../attributes/getAttributesValue';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 *
 * @param {Object} obj Block clip-path properties
 */
const getClipPathStyles = ({ obj, isHover = false, isIB = false }) => {
	const response = {};

	let omitClipPath = !isHover && !isIB;
	breakpoints.forEach(breakpoint => {
		const currentClipPath = getLastBreakpointAttribute({
			target: '_cp',
			breakpoint,
			attributes: obj,
			isHover,
		});

		omitClipPath = omitClipPath ? currentClipPath === 'none' : false;
		if (omitClipPath) return;

		response[breakpoint] = {
			...(currentClipPath &&
				(isHover
					? getAttributesValue({
							target: '_cp.s',
							props: obj,
							isHover,
					  })
					: getLastBreakpointAttribute({
							target: '_cp.s',
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
