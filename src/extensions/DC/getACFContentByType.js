const getACFContentByType = (content, type) => {
	switch (type) {
		case 'select':
		case 'checkbox':
		case 'radio':
			return typeof content === 'object' ? content.label : content;
		default:
			return content;
	}
};

export default getACFContentByType;
