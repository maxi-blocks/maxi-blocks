/**
 * Internal dependencies
 */
import getIsTemplatePart from './getIsTemplatePart';

const getSiteEditorIframe = () =>
	document.querySelector(
		`.edit-site-visual-editor .components-resizable-box__container${
			getIsTemplatePart() ? '.has-show-handle' : ':not(.has-show-handle)'
		} iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas`
	)?.contentDocument;

export default getSiteEditorIframe;
