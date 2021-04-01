/**
 * WordPress dependencies
 */
const { useEffect } = wp.element;
const { useDispatch, useSelect } = wp.data;

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

	useEffect(() => {
		if (isSaving && !isPreviewing) {
			saveStyles(true);
			saveCustomData(true);
		} else if (isSaving && isPreviewing) {
			saveStyles(false);
			saveCustomData(true);
		}
	}, [isSaving]);

	return null;
};

// if (document.body.classList.contains('maxi-blocks--active')) {
const wrapper = document.createElement('div');
wrapper.id = 'maxi-blocks__saver';

document.head.appendChild(wrapper);

wp.element.render(<BlockStylesSaver />, wrapper);
// }
