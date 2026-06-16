/**
 * Internal dependencies
 */
import getIBOptionsFromBlockData from './getIBOptionsFromBlockData';

export const getSelectedIBSettings = (clientId, value) =>
	Object.values(getIBOptionsFromBlockData(clientId))
		.flat()
		.find(option => option.sid === value);

export const cleanIBStyles = styles => {
	if (!styles || typeof styles !== 'object') return styles;

	const cleanedStyles = { ...styles };
	const xxlStyles = cleanedStyles.xxl?.styles;

	if (xxlStyles?.border !== 'none') return cleanedStyles;

	cleanedStyles.xxl = {
		...cleanedStyles.xxl,
		styles: { ...xxlStyles },
	};
	delete cleanedStyles.xxl.styles.border;

	if (Object.keys(cleanedStyles.xxl.styles).length === 0) {
		delete cleanedStyles.xxl;
	}

	return cleanedStyles;
};
