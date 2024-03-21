const isInSiteEditorPreviewIframe = () => {
	const elements = document.querySelectorAll(
		'.edit-site-page-content .block-editor-block-preview__container iframe, .block-editor-block-preview__container .block-editor-block-preview__content iframe, .block-editor-block-patterns-list__list-item .block-editor-block-preview__content iframe, .edit-site-page-content .block-editor-block-preview__container img, .block-editor-block-preview__container .block-editor-block-preview__content img, .block-editor-block-patterns-list__list-item .block-editor-block-preview__content img'
	);
	return elements.length > 0;
};

export default isInSiteEditorPreviewIframe;
