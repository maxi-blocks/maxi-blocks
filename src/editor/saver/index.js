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
import {
	useEffect,
	createRoot,
	useLayoutEffect,
	useState,
} from '@wordpress/element';

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

	// Track previous isSaving state to detect save completion
	const [prevIsSaving, setPrevIsSaving] = useState(false);

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

	// Update uniqueID cache after successful save
	useEffect(() => {
		if (prevIsSaving && !isSaving && !isCodeEditor) {
			// Save just completed - update cache with current editor blocks
			try {
				const blocks = select('maxiBlocks/blocks').getBlocks();
				if (blocks && Object.keys(blocks).length > 0) {
					const uniqueIDs = Object.keys(blocks);
					dispatch('maxiBlocks/blocks').addMultipleToUniqueIDCache(
						uniqueIDs
					);
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(
					'[UniqueID Cache] ❌ Failed to update cache after save:',
					JSON.stringify(error)
				);
			}
		}

		// Update previous state
		setPrevIsSaving(isSaving);
	}, [isSaving, prevIsSaving, isCodeEditor]);

	// When swapping to code editor, as all blocks are unmounted, we need to set the `isPageLoaded`
	// to false to ensure a good UX when coming back to the visual editor.
	// CRITICAL: Clear blockClientIds so when returning to visual, updateLastInsertedBlocks()
	// will detect ALL blocks as new insertions and trigger uniqueID regeneration correctly.
	useEffect(() => {
		if (isCodeEditor) {
			dispatch('maxiBlocks').setIsPageLoaded(false);
			// Clear blockClientIds so all blocks are treated as "new" when returning
			dispatch('maxiBlocks/blocks').saveBlockClientIds([]);
		}
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

			// OPTIMIZATION: Reduced delay from 1000ms to 100ms for faster code↔visual switching
			// UniqueID regeneration is now reliable because blockClientIds is cleared on code editor switch
			// This allows updateLastInsertedBlocks() to detect all blocks as new insertions
			setTimeout(() => {
				const blocks = getBlocks();
				const hasMaxiBlocks = blocks.some(isMaxiBlock);

				if (!hasMaxiBlocks) {
					dispatch('maxiBlocks').setIsPageLoaded(true);
				} else {
					// Give blocks minimal time to register, then allow rendering
					// Fast enough for good UX, slow enough for uniqueID regeneration
					setTimeout(() => {
						dispatch('maxiBlocks').setIsPageLoaded(true);
					}, 50);
				}
			}, 100);
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
