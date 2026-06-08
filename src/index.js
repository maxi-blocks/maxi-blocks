/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

// Extensions
import './extensions';

// CSS
import './css';

// Blocks
import './blocks/button-maxi';
import './blocks/cloud-maxi';
import './blocks/column-maxi';
import './blocks/container-maxi';
import './blocks/divider-maxi';
import './blocks/group-maxi';
import './blocks/image-maxi';
import './blocks/map-maxi';
import './blocks/number-counter-maxi';
import './blocks/row-maxi';
import './blocks/svg-icon-maxi';
import './blocks/text-maxi';
import './blocks/list-item-maxi';
import './blocks/slider-maxi';
import './blocks/slide-maxi';
import './blocks/accordion-maxi';
import './blocks/pane-maxi';
import './blocks/video-maxi';
import './blocks/search-maxi';

// Editor
import './editor/saver';
import './editor/toolbar-buttons';
// Lazy-load AI chat panel so the 2.8 MB attribute JSON
// only ships when the user actually opens the panel.
if (typeof wp !== 'undefined' && typeof wp.domReady === 'function') {
	wp.domReady(() => {
		const isBlockEditor =
			document.body?.classList?.contains('block-editor-page') ||
			document.querySelector('.block-editor') !== null;
		if (isBlockEditor) {
			import(
				/* webpackChunkName: "maxi-ai-chat-panel" */
				'./components/ai-chat-panel/mount'
			).then(({ mountAiChatPanel }) => {
				mountAiChatPanel();
			});
		}
	});
}
