/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

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
	const { saveFonts } = useDispatch('maxiBlocks/text');
	const { saveCustomData } = useDispatch('maxiBlocks/customData');
	const { saveSCStyles } = useDispatch('maxiBlocks/style-cards');

	useEffect(() => {
		if (isSaving) {
			if (!isPreviewing && !isDraft) {
				saveStyles(true);
				saveFonts(true);
				saveCustomData(true);
			} else if (isPreviewing || isDraft) {
				saveStyles(false);
				saveFonts(false);
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
