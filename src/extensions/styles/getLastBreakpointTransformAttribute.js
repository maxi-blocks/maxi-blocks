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

	return (
		getCurrentAndHigherBreakpoints(breakpoint)
			.reverse()
			.reduce((acc, currentBreakpoint) => {
				const attribute =
					attributes?.[`${attributeName}-${currentBreakpoint}`]?.[
						transformTarget
					]?.[hoverSelected]?.[prop];
				if (isNil(acc) && !isNil(attribute)) return attribute;
				return acc;
			}, undefined) ||
		(!ignoreNormal && hoverSelected !== 'normal'
			? getLastBreakpointTransformAttribute({
					...props,
					hoverSelected: 'normal',
			  })
			: undefined)
	);
};

export default getLastBreakpointTransformAttribute;
