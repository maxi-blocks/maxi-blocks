/**
 * WordPress dependencies
 */
import { useDispatch, useSelect, dispatch, select } from '@wordpress/data';
import {
	useEffect,
	render,
	createRoot,
	useLayoutEffect,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getPageFonts, loadFonts } from '../../extensions/text/fonts';

/**
 * Component
 */
const BlockStylesSaver = () => {
	const { isSaving, isPreviewing, isDraft, isCodeEditor } = useSelect(
		select => {
			const { isSavingPost, isPreviewingPost, getCurrentPostAttribute } =
				select('core/editor');
			const {
				__experimentalGetDirtyEntityRecords,
				isSavingEntityRecord,
			} = select('core');
			const { getEditorMode } =
				select('core/edit-site') || select('core/edit-post');

			const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();

			const isSaving =
				isSavingPost() ||
				dirtyEntityRecords.some(record =>
					isSavingEntityRecord(record.kind, record.name, record.key)
				);
			const isPreviewing = isPreviewingPost();
			const isDraft = getCurrentPostAttribute('status') === 'draft';
			const isCodeEditor = getEditorMode() === 'text';

			return {
				isSaving,
				isPreviewing,
				isDraft,
				isCodeEditor,
			};
		}
	);

	const { saveStyles } = useDispatch('maxiBlocks/styles');
	const { saveCustomData } = useDispatch('maxiBlocks/customData');
	const { saveSCStyles } = useDispatch('maxiBlocks/style-cards');

	useEffect(() => {
		if (isSaving && !isCodeEditor) {
			loadFonts(getPageFonts(), false);
			if (!isPreviewing && !isDraft) {
				saveStyles(true);
				saveCustomData(true);
			} else if (isPreviewing || isDraft) {
				saveStyles(false);
				saveCustomData(true);
				saveSCStyles(false);
			}
		}
	});

	useLayoutEffect(() => {
		const { getIsPageLoaded } = select('maxiBlocks');

		if (!getIsPageLoaded()) {
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
			// set the page as loaded so next added Maxi Blocks will be not pass the Suspense loading.
			setTimeout(() => {
				const blocks = getBlocks();
				const hasMaxiBlocks = blocks.some(isMaxiBlock);

				if (!hasMaxiBlocks) {
					dispatch('maxiBlocks').setIsPageLoaded(true);
				}
			}, 1000);
		}
	}, []);

	return null;
};

wp.domReady(() => {
	if (document.body.classList.contains('maxi-blocks--active')) {
		const wrapper = document.createElement('div');
		wrapper.id = 'maxi-blocks__saver';

		document.head.appendChild(wrapper);

		// check if createRoot is available (since React 18)
		if (typeof createRoot === 'function') {
			const root = createRoot(wrapper);
			root.render(<BlockStylesSaver />);
		} else {
			// for React 17 and below
			render(<BlockStylesSaver />, wrapper);
		}
	}
});
