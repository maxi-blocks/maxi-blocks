import getBreakpointFromAttribute from './getBreakpointFromAttribute';
import getNormalAttributeKey from './getNormalAttributeKey';

const getAttrKeyWithoutBreakpoint = key => {
	const target = getNormalAttributeKey(key);
	const isHover = target !== key;

	const breakpoint = getBreakpointFromAttribute(target);

	if (!breakpoint) return key;

	const response = `${target.slice(0, -(breakpoint.length + 1))}${
		isHover ? '.h' : ''
	}`;

	return response;
};

export default getAttrKeyWithoutBreakpoint;
