const checkForDoubleSymbol = key =>
	key?.includes('--') ||
	key?.includes('-_') ||
	key?.includes('__') ||
	key?.includes('-.');

const getCleanKey = key => {
	const cleanedKey = key
		.replaceAll('--', '-')
		.replaceAll('-_', '_')
		.replaceAll('-.', '.')
		.replaceAll('__', '_')
		.replaceAll('.s.h', '.sh');

	if (checkForDoubleSymbol(cleanedKey)) return getCleanKey(cleanedKey);
	return cleanedKey;
};

export default getCleanKey;
