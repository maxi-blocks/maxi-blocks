const createTemplatePartId = (theme, slug) => {
	return theme && slug ? `${theme}//${slug}` : null;
};

export default createTemplatePartId;
