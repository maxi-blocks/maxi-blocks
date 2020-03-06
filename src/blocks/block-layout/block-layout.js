/**
 * BLOCK: GE Library
 * A block to import other blocks or layotus directly from the online library
 */

/**
 * Import dependencies.
 */
import Edit from './../components/edit';
import LayoutsProvider from './../components/layouts-provider';
import iconsBlocks from '../../components/icons/icons-blocks.js';
import './style.scss';
import './editor.scss';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register the Layout block
 */
registerBlockType( 'gutenberg-extra/gx-layout', {
	title: __( 'Library Extra'),
	description: __( 'Add a pre-made block or layout.'),
	icon: iconsBlocks.library,
	category: 'gutenberg-extra-blocks',
	keywords: [
		__( 'layout', 'gutenberg-extra-blocks' ),
		__( 'block', 'gutenberg-extra-blocks' ),
	],
	attributes: {
	    className: {
	        type: 'string',
	        default: '',
	    },
	},

	/* Render the block components. */
	edit: props => {
		return <LayoutsProvider><Edit { ...props } /></LayoutsProvider>;
	},

	/* Save the block markup. */
	save: () => {
		return null;
	}
} );

/**
 * Add a GE Library button to the toolbar.
 */
document.addEventListener( 'DOMContentLoaded', addGXLayoutButton );

/**
 * Build the layout inserter button.
 */
function addGXLayoutButton() {
	let toolbar = document.querySelector( '.edit-post-header-toolbar' );
	if ( ! toolbar ) {
		return;
	}
	let buttonDiv = document.createElement( 'div' );
	let html = '<div class="gx-toolbar-layout">';
	html += `<a type="button" id="gxAddLayoutButton" class="button components-button components-icon-button" aria-label="${ __( 'GutenbergExtra Library', 'gutenberg-extra' ) }">\
	</i><img src="/wp-content/plugins/gutenberg-extra/img/gx-icon-white.svg" /> ${ __( 'GutenbergExtra Library', 'gutenberg-extra') }</a>`;
	html += `<a type="button"  href="/wp-admin/customize.php" target="_blank" id="gxGoToCustomizerButton" class="button components-button components-icon-button" aria-label="${ __( 'Global Styles', 'gutenberg-extra' ) }">\
	</i><img src="/wp-content/plugins/gutenberg-extra/img/gx-icon-white.svg" /> ${ __( 'Global Styles', 'gutenberg-extra') }</a>`;
	html += '</div>';
	buttonDiv.innerHTML = html;
	toolbar.appendChild( buttonDiv );
	document.getElementById( 'gxAddLayoutButton' ).addEventListener( 'click', abInsertLayout );
}

/**
 * Add the GE Library block on click.
 */
function abInsertLayout() {
	let block = wp.blocks.createBlock( 'gutenberg-extra/gx-layout' );
	wp.data.dispatch( 'core/editor' ).insertBlocks( block );
}
