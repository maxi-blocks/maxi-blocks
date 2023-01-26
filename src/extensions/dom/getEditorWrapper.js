const getEditorWrapper = () => {
	const iframe = document
		.querySelector('iframe[name="editor-canvas"]')
		?.contentDocument.querySelector('.editor-styles-wrapper');
	if (iframe) {
		return iframe;
	}

	return document.querySelector('.editor-styles-wrapper');
};

export default getEditorWrapper;
