const getTypographyLinkStyles = (obj, linkType = 'link') => {
	const response = {
		color: obj[`link-color-${linkType}`],
	};

	return response;
};

export default getTypographyLinkStyles;
