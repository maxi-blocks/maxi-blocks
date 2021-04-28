const getCustomFormat = (typography, className, isHover = false) => {
	const customFormats =
		typography[`custom-formats${isHover ? '-hover' : ''}`] || {};
	const currentCustomFormat = customFormats[className] || {};

	return currentCustomFormat;
};

export default getCustomFormat;
