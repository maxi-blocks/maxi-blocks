const getSiteEditorIframe = () =>
	document.querySelector(
		'.edit-site-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
	)?.contentDocument;

export default getSiteEditorIframe;
