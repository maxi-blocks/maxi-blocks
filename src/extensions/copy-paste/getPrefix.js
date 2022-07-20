const getPrefix = (type, prefixFromCopyPaste, prefix) =>
	type === 'withPrefix' ? prefixFromCopyPaste ?? prefix : '';

export default getPrefix;
