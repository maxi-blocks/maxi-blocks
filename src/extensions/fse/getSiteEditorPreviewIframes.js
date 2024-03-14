const getSiteEditorPreviewIframes = () =>
	document.querySelectorAll(
		'.edit-site-page-content .block-editor-block-preview__container iframe, .block-editor-block-preview__container .block-editor-block-preview__content iframe'
	);

export default getSiteEditorPreviewIframes;
