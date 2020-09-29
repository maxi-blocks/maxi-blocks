export const fromListToText = content => {
	return content
		.replace(/(<\/li><li>|<ol>|<ul>)/gi, '<br>')
		.replace(/(<\/li>|<li>|<\/ul>|<\/ol>)/gi, '');
};

export const fromTextToList = content => {
	return `<li>${content.replace(/<br>/gi, '</li><li>')}</li>`;
};
