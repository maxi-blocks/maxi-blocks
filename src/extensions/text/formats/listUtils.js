/**
 * Transform list formatted text to plain text
 *
 * @param {string} content Text content
 *
 * @returns {string} New formatted string
 */
export const fromListToText = content => {
	return content
		.replace(/(<\/li><li>|<ol>|<ul>)/gi, '<br>')
		.replace(/(<\/li>|<li>|<\/ul>|<\/ol>)/gi, '');
};

/**
 * Transform plain text to list formatted text
 *
 * @param {string} content Text content
 *
 * @returns {string} New formatted string
 */
export const fromTextToList = content => {
	return `<li>${content.replace(/<br>/gi, '</li><li>')}</li>`;
};
