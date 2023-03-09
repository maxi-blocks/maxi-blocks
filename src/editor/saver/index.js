/**
 * WordPress dependencies
 */
import { useEffect, render, createRoot } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

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
