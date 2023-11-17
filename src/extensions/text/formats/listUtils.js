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
 * @param {string} content   Text content
 * @param {number} wpVersion WordPress version
 *
 * @returns {string} New formatted string
 */
export const fromTextToList = (content, wpVersion) => {
	if (
		wpVersion >= 6.4 &&
		(!content || content === '' || content === '<li></li>')
	) {
		return '<li><span class="list-item-placeholder" contenteditable="true">&zwnj;</span></li>';
	}
	return `<li>${content.replace(/<br>/gi, '</li><li>')}</li>`;
};
