const getSiteEditorIframe = () =>
	document.querySelector(
		'iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
	)?.contentDocument;

export default getSiteEditorIframe;
