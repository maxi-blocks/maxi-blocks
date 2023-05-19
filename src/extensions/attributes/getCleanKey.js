const checkForDoubleHyphen = key => key?.includes('--');

const getCleanKey = key => {
	const cleanedKey = key
		.replaceAll('--', '-')
		.replaceAll('-_', '_')
		.replaceAll('-.', '.')
		.replaceAll('.s.h', '.sh');

	if (checkForDoubleHyphen(cleanedKey)) return getCleanKey(cleanedKey);
	return cleanedKey;
};

export default getCleanKey;
