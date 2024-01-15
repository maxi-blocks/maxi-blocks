import getSiteEditorPreviewIframes from './getSiteEditorPreviewIframes';

const getSiteEditorPreviewIframesBodies = () => {
	const iframes = getSiteEditorPreviewIframes();
	if (!iframes) return [];

	const bodies = [];
	iframes.forEach(iframe => {
		const body = iframe.contentDocument.querySelector(
			'.editor-styles-wrapper'
		);
		if (body) bodies.push(body);
	});

	return bodies;
};

export default getSiteEditorPreviewIframesBodies;
