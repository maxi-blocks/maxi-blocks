const getCustomFormat = (typography, className, isHover = false) => {
	const customFormats = typography[`_cf${isHover ? '-hover' : ''}`] || {};
	const currentCustomFormat = customFormats[className] || {};

	return currentCustomFormat;
};

export default getCustomFormat;
