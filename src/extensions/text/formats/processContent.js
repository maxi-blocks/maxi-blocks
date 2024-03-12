/**
 * Prevents losing general link format when the link is affecting whole content
 *
 * In case we add a whole link format, Gutenberg doesn't keep it when creators write new content.
 * This method fixes it
 *
 * @param {string}   rawContent
 * @param {string}   attributesContent
 * @param {number}   typingTimeoutContent
 * @param {Function} onChange
 * @param {Function} setTypingTimeoutContent
 * @returns {void}
 */
const processContent = (
	rawContent,
	attributesContent,
	typingTimeoutContent,
	onChange,
	setTypingTimeoutContent
) => {
	if (rawContent === attributesContent) {
		return;
	}

	/**
	 * Replace last space with &nbsp; to prevent losing him in Firefox #4194
	 * Does not replace spaces, which inside of HTML tags
	 */
	const replaceSpaces = content =>
		content.replace(/(?![^<]*>|[^<>]*<\/) $/, '&nbsp;');

	const content = replaceSpaces(rawContent);

	const isWholeLink =
		content.split('</a>').length === 2 &&
		content.startsWith('<a') &&
		content.indexOf('</a>') === content.length - 5;

	if (isWholeLink) {
		const newContent = content.replace('</a>', '');

		onChange({ content: `${newContent}</a>` });
	} else {
		if (typingTimeoutContent) clearTimeout(typingTimeoutContent);

		setTypingTimeoutContent(
			setTimeout(() => {
				onChange({ content });
			}, 100)
		);
	}
};

export default processContent;
