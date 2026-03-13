/**
 * Returns if the block is in the preview iframe (for example on hover in block inserter)
 *
 * @param {*} blockEl
 * @returns {boolean}
 */
const PREVIEW_CONTAINER_SELECTOR =
	'.block-editor-block-preview__container, .block-editor-block-patterns-list__list-item';

const getIsHoverPreview = () => {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return false;
	}

	const previewFrame = window.frameElement;
	if (
		previewFrame &&
		previewFrame.closest?.(PREVIEW_CONTAINER_SELECTOR)
	) {
		return true;
	}

	return Boolean(document.body?.closest?.(PREVIEW_CONTAINER_SELECTOR));
};

export default getIsHoverPreview;
