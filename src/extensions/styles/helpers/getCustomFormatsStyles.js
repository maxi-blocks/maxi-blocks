import getTypographyStyles from './getTypographyStyles';

const getCustomFormatsStyles = (target, customFormats, isHover = false) => {
	const response = {};

	if (customFormats)
		Object.entries(customFormats).forEach(([key, val]) => {
			response[`${target} .${key}`] = {
				typography: getTypographyStyles(val),
			};
		});

	return response;
};

export default getCustomFormatsStyles;
