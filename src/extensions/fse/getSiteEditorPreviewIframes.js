const getSiteEditorPreviewIframes = () =>
	document.querySelectorAll(
		'.edit-site-page-content .block-editor-block-preview__container iframe'
	);

export default getSiteEditorPreviewIframes;
