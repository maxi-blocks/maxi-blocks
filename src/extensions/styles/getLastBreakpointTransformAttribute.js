/**
 * Internal dependencies
 */
import getCurrentAndHigherBreakpoints from './getCurrentAndHigherBreakpoints';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getLastBreakpointTransformAttribute = props => {
	const {
		attributeName,
		prop,
		transformTarget,
		breakpoint,
		attributes,
		hoverSelected,
		ignoreNormal = false,
	} = props;

	const result = getCurrentAndHigherBreakpoints(breakpoint)
		.reverse()
		.reduce((acc, currentBreakpoint) => {
			const hoverSelectedObject =
				attributes?.[`${attributeName}-${currentBreakpoint}`]?.[
					transformTarget
				]?.[hoverSelected];
			const attribute = !isNil(prop)
				? hoverSelectedObject?.[prop]
				: hoverSelectedObject;
			if (isNil(acc) && !isNil(attribute)) return attribute;
			return acc;
		}, undefined);

	if (!isNil(result)) return result;

	return !ignoreNormal && hoverSelected === 'hover'
		? getLastBreakpointTransformAttribute({
				...props,
				hoverSelected: 'normal',
		  })
		: undefined;
};

export default getLastBreakpointTransformAttribute;
