import getBreakpointFromAttribute from './getBreakpointFromAttribute';

const getAttrKeyWithoutBreakpoint = key => {
	const isHover = key.includes('-hover');

	const target = isHover ? key.replace('-hover', '') : key;

	const breakpoint = getBreakpointFromAttribute(target);

	if (!breakpoint) return key;

	const response = `${target.slice(0, -(breakpoint.length + 1))}${
		isHover ? '-hover' : ''
	}`;

	return response;
};

export default getAttrKeyWithoutBreakpoint;
