/**
 * WordPress dependencies
 */
import {
	useDispatch,
	useSelect,
	dispatch,
	select,
	subscribe,
} from '@wordpress/data';
import { useEffect, createRoot, useLayoutEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getPageFonts, loadFonts } from '@extensions/text/fonts';
import { getIsSiteEditor, getIsTemplatePart } from '@extensions/fse';
import MaxiBlocksSaveBlocker from '@editor/save-blocker';

/**
 * Component
 */
const BlockStylesSaver = () => {
	const {
		isSaving,
		isPreviewing,
		isPublishing,
		isDraft,
		isCodeEditor,
		allStylesAreSaved,
		isPageLoaded,
		hasTemplateChanged,
	} = useSelect(select => {
		const {
			isSavingPost,
			isPreviewingPost,
			getCurrentPostAttribute,
			isPublishingPost,
		} = select('core/editor');
		const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } =
			select('core');
		const { getEditorMode } =
			select('core/edit-site') || select('core/edit-post');
		const { getIsPageLoaded } = select('maxiBlocks');
		const { getAllStylesAreSaved } = select('maxiBlocks/styles');

		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();

		const isSaving =
			isSavingPost() ||
			dirtyEntityRecords.some(record =>
				isSavingEntityRecord(record.kind, record.name, record.key)
			);
		const isPublishing = isPublishingPost();
		const isPreviewing = isPreviewingPost();
		const isDraft = getCurrentPostAttribute('status') === 'auto-draft';
		const isCodeEditor = getEditorMode() === 'text';
		const allStylesAreSaved = getAllStylesAreSaved();
		const isPageLoaded = getIsPageLoaded();

		const hasTemplateChanged = getIsSiteEditor() && getIsTemplatePart();

		return {
			isSaving,
			isPreviewing,
			isPublishing,
			isDraft,
			isCodeEditor,
			allStylesAreSaved,
			isPageLoaded,
			hasTemplateChanged,
		};
	});

	const { saveStyles } = useDispatch('maxiBlocks/styles');
	const { saveCustomData } = useDispatch('maxiBlocks/customData');
	const { saveSCStyles } = useDispatch('maxiBlocks/style-cards');

	useEffect(() => {
		if (isSaving && !isCodeEditor) {
			loadFonts(getPageFonts(), false);

			if (!isPreviewing && (!isDraft || isPublishing)) {
				saveStyles(true);
				saveCustomData(true);
			} else if (isPreviewing || isDraft) {
				saveStyles(false);
				saveCustomData(true);
				saveSCStyles(false);
			}
		}
	});

	// When swapping to code editor, as all blocks are unmounted, we need to set the `isPageLoaded`
	// to false to ensure a good UX when coming back to the visual editor.
	useEffect(() => {
		if (isCodeEditor) dispatch('maxiBlocks').setIsPageLoaded(false);
	}, [isCodeEditor]);

	// In FSE, when the template part is changed, we need to set the `isPageLoaded` to false to ensure
	// a good UX as with the `isPageLoaded` equal to false the load of the editor is smoother.
	// However, we need to prevent infinite loops by only resetting when hasTemplateChanged actually changes
	useEffect(() => {
		// Only reset isPageLoaded if we're in FSE, page is loaded, AND hasTemplateChanged is true
		// This prevents the infinite loop where setting isPageLoaded=false triggers this effect again
		if (getIsSiteEditor() && isPageLoaded && hasTemplateChanged) {
			dispatch('maxiBlocks').setIsPageLoaded(false);
		}
	}, [hasTemplateChanged]); // Only depend on hasTemplateChanged, not isPageLoaded

	useLayoutEffect(() => {
		if (!isPageLoaded) {
			const isMaxiBlock = block => {
				if (block.name.includes('maxi-blocks/')) return true;

				if (block.innerBlocks.length) {
					return block.innerBlocks.some(isMaxiBlock);
				}

				return false;
			};

			const { getBlocks } = select('core/block-editor');

			// Waits one second before it checks if the page is a new page or has maxi blocks.
			// In case it has maxi blocks, it will wait for them to load. If it doesn't, it will
			// set the page as loaded so next added MaxiBlocks will be not pass the Suspense loading.
			setTimeout(() => {
				const blocks = getBlocks();
				const hasMaxiBlocks = blocks.some(isMaxiBlock);

				if (!hasMaxiBlocks) {
					dispatch('maxiBlocks').setIsPageLoaded(true);
				} else {
					// If there are MaxiBlocks, give them time to start loading, then set page as loaded
					// This prevents indefinite waiting and allows React to render all blocks normally
					setTimeout(() => {
						dispatch('maxiBlocks').setIsPageLoaded(true);
					}, 100);
				}
			}, 1000);
		}
	}, [isPageLoaded]);

	useEffect(() => {
		if (!allStylesAreSaved) {
			const forbidUpdateUnsubscribe = subscribe(() => {
				const publishButton = document.querySelector(
					'.editor-post-publish-button'
				);

				if (publishButton)
					publishButton.setAttribute('aria-disabled', 'true');

				const saveDraftButton = document.querySelector(
					'.editor-post-save-draft'
				);

				if (saveDraftButton)
					saveDraftButton.setAttribute('aria-disabled', 'true');

				const previewButton = document.querySelector(
					'.editor-post-preview'
				);

				if (previewButton)
					previewButton.setAttribute('aria-disabled', 'true');
			});

			return () => forbidUpdateUnsubscribe();
		}

		const publishButton = document.querySelector(
			'.editor-post-publish-button'
		);

		if (publishButton) publishButton.setAttribute('aria-disabled', 'false');

		const saveDraftButton = document.querySelector(
			'.editor-post-save-draft'
		);

		if (saveDraftButton)
			saveDraftButton.setAttribute('aria-disabled', 'false');

		const previewButton = document.querySelector('.editor-post-preview');

		if (previewButton) previewButton.setAttribute('aria-disabled', 'false');

		return () => {};
	}, [allStylesAreSaved]);

	return <MaxiBlocksSaveBlocker />;
};

wp.domReady(() => {
	if (document.body.classList.contains('maxi-blocks--active')) {
		const wrapper = document.createElement('div');
		wrapper.id = 'maxi-blocks__saver';

		document.head.appendChild(wrapper);

		const root = createRoot(wrapper);
		root.render(<BlockStylesSaver />);
	}
});
