const getSiteEditorIframe = () => {
	// Template part editor iframe
	const templatePartIframe =
		document.querySelector(
			'.edit-site-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
		)?.contentDocument ??
		document.querySelector(
			'.editor-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
		)?.contentDocument;

	if (templatePartIframe) return templatePartIframe;

	// Reusable block editor iframe (when clicking "Edit original")
	// This opens in a different context without the .edit-site-visual-editor__editor-canvas class
	const reusableIframe = document.querySelector(
		'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
	)?.contentDocument;

	return reusableIframe;
};

export default getSiteEditorIframe;
