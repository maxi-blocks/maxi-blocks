<?php
/**
 * Compatibility related functionality.
 *
 * Handles things like PHP version requirements
 * not met, unregistering blocks, etc.
 *
 * This file should remain PHP 5.2 compatible.
 *
 * @package GXBlocks\Compatibility
 */

if ( PHP_VERSION_ID < 50600 ) {
	add_action( 'enqueue_block_editor_assets', 'gx_blocks_unregister_incompatible_blocks' );
}
/**
 * Unregisters certain blocks on sites
 * running PHP < 5.6.
 */
function gx_blocks_unregister_incompatible_blocks() {
	?>
	<script>
		window.addEventListener( 'DOMContentLoaded', function() {
			wp.domReady( function() {
				wp.blocks.unregisterBlockType( 'maxi-blocks/newsletter' );
				wp.blocks.unregisterBlockType( 'maxi-blocks/ab-layouts' );
			} );
		} );
	</script>
	<?php
}
