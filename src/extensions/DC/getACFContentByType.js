/**
 * Limit ACF content without stripping HTML tags first
 * @param {string} value - The content to limit
 * @param {number} limit - Character limit
 * @returns {string} - Limited content
 */
const limitACFString = (value, limit) => {
	if (limit <= 0 || !value) return value;
	return value.length > limit ? `${value.substr(0, limit)}…` : value;
};

const getACFContentByType = (content, type, dcAttributes) => {
	const { delimiterContent, acfCharLimit } = dcAttributes;

	// If content is null or undefined, return it as is
	if (!content && content !== 0) {
		return content;
	}

	let processedContent;

	switch (type) {
		case 'select':
		case 'radio':
		case 'button_group':
			processedContent =
				typeof content === 'object' ? content.label : content;
			break;
		case 'checkbox':
			processedContent = Array.isArray(content)
				? content
						.map(item =>
							typeof item === 'object' ? item.label : item
						)
						.join(`${delimiterContent} `)
				: content;
			break;
		default:
			processedContent = content;
	}

	// Apply character limit for text and textarea fields
	if (
		['text', 'textarea'].includes(type) &&
		typeof processedContent === 'string' &&
		processedContent.length > 0 &&
		acfCharLimit &&
		acfCharLimit > 0
	) {
		processedContent = limitACFString(processedContent, acfCharLimit);
	}

	return processedContent;
};

export default getACFContentByType;
