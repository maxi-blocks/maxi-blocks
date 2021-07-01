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
				typography: getTypographyStyles({
					obj: val,
					isHover,
					customFormatTypography: typography,
				}),
			};
		});

	return response;
};

export default getCustomFormatsStyles;
