// Accepts (possibly) hover attribute key and returns normal key.
const getNormalAttributeKey = hoverKey => hoverKey.replace(/-hover/, '');

export default getNormalAttributeKey;
