import getSiteEditorIframe from './getSiteEditorIframe';

const getSiteEditorIframeBody = () =>
	getSiteEditorIframe()?.querySelector('.editor-styles-wrapper');

export default getSiteEditorIframeBody;
