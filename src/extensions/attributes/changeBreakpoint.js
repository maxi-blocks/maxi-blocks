import getBreakpointFromAttribute from './getBreakpointFromAttribute';
import getNormalAttributeKey from './getNormalAttributeKey';

const changeBreakpoint = (key, breakpoint = 'g') => {
	const target = getNormalAttributeKey(key);
	const isHover = target !== key;

	const bpt = getBreakpointFromAttribute(target);

	if (!bpt) return key;

	const response = `${target.slice(0, -bpt.length)}${breakpoint}${
		isHover ? '.h' : ''
	}`;

	return response;
};

export default changeBreakpoint;
