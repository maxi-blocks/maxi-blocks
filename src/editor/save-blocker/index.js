/**
 * WordPress dependencies
 */
import { useSelect, useDispatch, subscribe } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Component to prevent saving until all MaxiBlocks are fully rendered
 *
 * This component monitors the rendering state of all MaxiBlocks and prevents
 * saving/publishing until all blocks have completed their rendering process.
 */
const MaxiBlocksSaveBlocker = () => {
	const { allBlocksFullyRendered } = useSelect(select => {
		const maxiBlocksSelect = select('maxiBlocks');

		return {
			allBlocksFullyRendered:
				maxiBlocksSelect.getAllBlocksFullyRendered(),
		};
	});

	const { lockPostSaving, unlockPostSaving } = useDispatch('core/editor');

	useEffect(() => {
		const canSave = allBlocksFullyRendered;

		if (!canSave) {
			// Lock saving with a specific reason
			lockPostSaving('maxi-blocks-rendering');

			// Also disable UI buttons as fallback
			const forbidSaveUnsubscribe = subscribe(() => {
				const publishButton = document.querySelector(
					'.editor-post-publish-button'
				);
				const saveDraftButton = document.querySelector(
					'.editor-post-save-draft'
				);
				const previewButton = document.querySelector(
					'.editor-post-preview'
				);

				if (publishButton) {
					publishButton.setAttribute('aria-disabled', 'true');
					publishButton.setAttribute(
						'title',
						'Please wait for MaxiBlocks to finish rendering'
					);
				}
				if (saveDraftButton) {
					saveDraftButton.setAttribute('aria-disabled', 'true');
					saveDraftButton.setAttribute(
						'title',
						'Please wait for MaxiBlocks to finish rendering'
					);
				}
				if (previewButton) {
					previewButton.setAttribute('aria-disabled', 'true');
					previewButton.setAttribute(
						'title',
						'Please wait for MaxiBlocks to finish rendering'
					);
				}
			});

			return () => forbidSaveUnsubscribe();
		}

		// Unlock saving when all blocks are ready
		unlockPostSaving('maxi-blocks-rendering');

		// Re-enable UI buttons
		const publishButton = document.querySelector(
			'.editor-post-publish-button'
		);
		const saveDraftButton = document.querySelector(
			'.editor-post-save-draft'
		);
		const previewButton = document.querySelector('.editor-post-preview');

		if (publishButton) {
			publishButton.setAttribute('aria-disabled', 'false');
			publishButton.removeAttribute('title');
		}
		if (saveDraftButton) {
			saveDraftButton.setAttribute('aria-disabled', 'false');
			saveDraftButton.removeAttribute('title');
		}
		if (previewButton) {
			previewButton.setAttribute('aria-disabled', 'false');
			previewButton.removeAttribute('title');
		}

		return () => {};
	}, [allBlocksFullyRendered, lockPostSaving, unlockPostSaving]);

	return null;
};

export default MaxiBlocksSaveBlocker;
