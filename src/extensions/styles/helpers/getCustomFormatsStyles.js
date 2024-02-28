import getTypographyStyles from './getTypographyStyles';

const getCustomFormatsStyles = (
	target,
	customFormats,
	isHover = false,
	typography,
	textLevel,
	blockStyle,
	disablePaletteDefaults = false,
	blockName
) => {
	const response = {};

	if (customFormats)
		Object.entries(customFormats).forEach(([key, val]) => {
			response[`${target} .${key}`] = {
				typography: getTypographyStyles({
					obj: val,
					isHover: false, // always false, as doesn't need `-hover` suffix
					customFormatTypography: typography,
					textLevel,
					blockStyle,
					disablePaletteDefaults,
					blockName,
				}),
			};
		});

	return response;
};

export default getCustomFormatsStyles;
