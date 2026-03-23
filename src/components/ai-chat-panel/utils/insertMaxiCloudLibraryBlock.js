/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '@extensions/fse';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';

/**
 * Inserts maxi-blocks/maxi-cloud using the same placement rules as the editor
 * responsive toolbar Cloud Library action.
 *
 * @returns {void}
 */
export function insertMaxiCloudLibraryBlock() {
	const { insertBlock } = dispatch( 'core/block-editor' );
	let rootClientId;
	const isFSE = getIsSiteEditor();

	const isTemplateMode =
		! isFSE &&
		select( 'core/editor' )?.getRenderingMode?.() === 'template-locked';

	if ( isFSE ) {
		const postId = select( 'core/edit-site' ).getEditedPostId();
		const postType = select( 'core/edit-site' ).getEditedPostType();

		if (
			postType === 'wp_template' ||
			postType === 'wp_block' ||
			postType === 'wp_template_part'
		) {
			insertBlock( createBlock( 'maxi-blocks/maxi-cloud' ) );
		}

		if ( postType && postId ) {
			goThroughMaxiBlocks( block => {
				if ( block.name === 'core/post-content' ) {
					rootClientId = block.clientId;
					return true;
				}
				return false;
			} );
		}
	}

	if ( isFSE || isTemplateMode ) {
		if ( isTemplateMode && ! rootClientId ) {
			goThroughMaxiBlocks( block => {
				if ( block.name === 'core/post-content' ) {
					rootClientId = block.clientId;
					return true;
				}
				return false;
			} );
		}
	}

	if ( rootClientId || ( ! isFSE && ! isTemplateMode ) ) {
		insertBlock(
			createBlock( 'maxi-blocks/maxi-cloud' ),
			undefined,
			rootClientId
		);
	}
}
