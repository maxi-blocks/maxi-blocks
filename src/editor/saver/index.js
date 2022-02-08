/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getAllFonts, loadFonts } from '../../extensions/text/fonts';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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

	const getPageFonts = () => {
		const { getBlocks } = select('core/block-editor');
		let response = {};

		const getBlockFonts = blocks => {
			Object.entries(blocks).forEach(([key, block]) => {
				const { attributes, innerBlocks, name } = block;

				if (name.includes('maxi') && !isEmpty(attributes)) {
					const typography = {
						...getGroupAttributes(attributes, 'typography'),
					};

					response = {
						...response,
						...getAllFonts(typography),
					};
				}

				if (!isEmpty(innerBlocks)) getBlockFonts(innerBlocks);
			});

			return null;
		};

		getBlockFonts(getBlocks());

		return response;
	};

	useEffect(() => {
		if (isSaving) {
			loadFonts(getPageFonts());
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
