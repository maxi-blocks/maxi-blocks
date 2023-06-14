const getACFContentByType = (content, type, dcAttributes) => {
	const { delimiterContent } = dcAttributes;

	switch (type) {
		case 'select':
		case 'radio':
		case 'button_group':
			return typeof content === 'object' ? content.label : content;
		case 'checkbox':
			return content
				.map(item => (typeof item === 'object' ? item.label : item))
				.join(`${delimiterContent} `);
		default:
			return content;
	}
};

export default getACFContentByType;
