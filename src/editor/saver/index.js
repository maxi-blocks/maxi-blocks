/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Component
 */
const BlockStylesSaver = () => {
	const { isSaving, isPreviewing } = useSelect(select => {
		const { isSavingPost, isPreviewingPost } = select('core/editor');

		const isSaving = isSavingPost();
		const isPreviewing = isPreviewingPost();

		return {
			isSaving,
			isPreviewing,
		};
	});

	const { saveStyles } = useDispatch('maxiBlocks/styles');
	const { saveCustomData } = useDispatch('maxiBlocks/customData');
	const { saveSCStyles } = useDispatch('maxiBlocks/style-cards');

	useEffect(() => {
		if (isSaving && !isPreviewing) {
			saveStyles(true);
			saveCustomData(true);
			saveSCStyles(true);
		} else if (isSaving && isPreviewing) {
			saveStyles(false);
			saveCustomData(true);
			saveSCStyles(false);
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
