import getTypographyStyles from './getTypographyStyles';

const getCustomFormatsStyles = (
	target,
	customFormats,
	isHover = false,
	typography
) => {
	const response = {};

	if (customFormats)
		Object.entries(customFormats).forEach(([key, val]) => {
			response[`${target} .${key}`] = {
				typography: getTypographyStyles(val, isHover, '', typography),
			};
		});

	return response;
};

export default getCustomFormatsStyles;
