import { getNormalAttributeKey } from './utils';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getBreakpointFromAttribute = rawTarget => {
	const target = getNormalAttributeKey(rawTarget);
	const lastDash = target.lastIndexOf('-');

	if (lastDash <= -1) return false;

	const breakpoint = target.slice(lastDash).replace('-', '');

	if (!BREAKPOINTS.includes(breakpoint)) return false;

	return breakpoint;
};

export default getBreakpointFromAttribute;
