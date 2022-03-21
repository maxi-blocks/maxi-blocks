/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getPageFonts, loadFonts } from '../../extensions/text/fonts';

/**
 * Component
 */
const BlockStylesSaver = () => {
	const { isSaving, isPreviewing, isDraft } = useSelect(select => {
		const { isSavingPost, isPreviewingPost, getCurrentPostAttribute } =
			select('core/editor');

		const isSaving = isSavingPost();
		const isPreviewing = isPreviewingPost();
		const isDraft = getCurrentPostAttribute('status') === 'draft';

		return {
			isSaving,
			isPreviewing,
			isDraft,
		};
	});

	const { saveStyles } = useDispatch('maxiBlocks/styles');
	const { saveCustomData } = useDispatch('maxiBlocks/customData');
	const { saveSCStyles } = useDispatch('maxiBlocks/style-cards');

	useEffect(() => {
		if (isSaving) {
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

		wp.element.render(<BlockStylesSaver />, wrapper);
	}
});
