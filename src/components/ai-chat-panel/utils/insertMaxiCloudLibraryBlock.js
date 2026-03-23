/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '@extensions/fse';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import { clickOpenCloudPlaceholder } from './aiCloudModalDriver';

/**
 * @param {{ name?: string, attributes?: Record<string, *> }|null|undefined} block
 * @returns {boolean}
 */
const isEmptyMaxiCloudBlock = block =>
	block?.name === 'maxi-blocks/maxi-cloud' &&
	! block.attributes?.preview &&
	isEmpty( block.attributes?.content );

/**
 * Prefer the selected block if it is an empty Cloud block; otherwise the first empty Cloud block in the tree.
 *
 * @returns {string|null} clientId or null
 */
const findReuseEmptyMaxiCloudClientId = () => {
	const selectedId = select( 'core/block-editor' ).getSelectedBlockClientId();
	if ( selectedId ) {
		const selected = select( 'core/block-editor' ).getBlock( selectedId );
		if ( isEmptyMaxiCloudBlock( selected ) ) {
			return selectedId;
		}
	}
	let found = null;
	goThroughMaxiBlocks( block => {
		if ( isEmptyMaxiCloudBlock( block ) ) {
			found = block.clientId;
			return true;
		}
		return false;
	} );
	return found;
};

/**
 * Selects the block and clicks the Cloud placeholder inside that block’s DOM (avoids opening another block’s library).
 *
 * @param {string} clientId
 * @returns {Promise<boolean>} True if a placeholder control was activated.
 */
const openExistingEmptyMaxiCloudBlock = async clientId => {
	dispatch( 'core/block-editor' ).selectBlock( clientId );
	const placeholderSelectors = [
		'.maxi-block-library__placeholder button.components-button',
		'.maxi-block-library__modal-button__placeholder',
		'.maxi-block-library__placeholder .maxi-block-library__modal-button__placeholder',
	];
	for ( let attempt = 0; attempt < 6; attempt++ ) {
		await new Promise( resolve => {
			setTimeout( resolve, attempt === 0 ? 60 : 90 );
		} );
		const wrap = document.querySelector( `[data-block="${ clientId }"]` );
		if ( wrap ) {
			for ( const sel of placeholderSelectors ) {
				const btn = wrap.querySelector( sel );
				if ( btn && ! btn.disabled ) {
					btn.click();
					return true;
				}
			}
		}
	}
	return clickOpenCloudPlaceholder();
};

/**
 * Inserts maxi-blocks/maxi-cloud using the same placement rules as the editor
 * responsive toolbar Cloud Library action.
 *
 * Reuses an existing **empty** Cloud block (typically left after AI closed the library) instead of inserting a duplicate.
 *
 * @returns {Promise<void>}
 */
export async function insertMaxiCloudLibraryBlock() {
	const reuseId = findReuseEmptyMaxiCloudClientId();
	if ( reuseId ) {
		await openExistingEmptyMaxiCloudBlock( reuseId );
		return;
	}

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
