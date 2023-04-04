const getCleanKey = key =>
	key
		.replaceAll('--', '-')
		.replaceAll('--', '-')
		.replaceAll('-_', '_')
		.replaceAll('-.', '.')
		.replaceAll('.s.h', '.sh');

export default getCleanKey;
