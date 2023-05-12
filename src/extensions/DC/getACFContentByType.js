const getACFContentByType = (content, type, dcAttributes) => {
	const { 'dc-delimiter-content': delimiter } = dcAttributes;

	switch (type) {
		case 'select':
		case 'radio':
			return typeof content === 'object' ? content.label : content;
		case 'checkbox':
			return content
				.map(item => (typeof item === 'object' ? item.label : item))
				.join(`${delimiter} `);
		default:
			return content;
	}
};

export default getACFContentByType;
