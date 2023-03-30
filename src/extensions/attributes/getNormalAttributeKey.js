// Accepts (possibly) hover attribute key and returns normal key.
const getNormalAttributeKey = hoverKey =>
	hoverKey.endsWith('.h') ? hoverKey.replace(/\.h(?=[^.h]*$)/, '') : hoverKey;

export default getNormalAttributeKey;
