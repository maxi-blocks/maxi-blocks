/**
 * Returns if the block is in the preview iframe (for example on hover in block inserter)
 *
 * @param {*} blockEl
 * @returns {boolean}
 */
const getIsHoverPreview = () =>
	document.querySelector('.block-editor-block-preview__container');

export default getIsHoverPreview;
