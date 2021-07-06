import getTypographyStyles from './getTypographyStyles';

const getCustomFormatsStyles = (
	target,
	customFormats,
	isHover = false,
	typography,
	textLevel,
	blockStyle
) => {
	const response = {};

	if (customFormats)
		Object.entries(customFormats).forEach(([key, val]) => {
			response[`${target} .${key}`] = {
				typography: getTypographyStyles({
					obj: val,
					isHover,
					customFormatTypography: typography,
					textLevel,
					parentBlockStyle: blockStyle,
				}),
			};
		});

	return response;
};

export default getCustomFormatsStyles;
