/**
 * BLOCK: GX Layout
 * A block to import other blocks or layotus directly from the online library
 */

/**
 * Import dependencies.
 */
import Edit from './../components/edit';
import LayoutsProvider from './../components/layouts-provider';
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
registerBlockType( 'gutenberg-den/gx-layout', {
	title: __( 'GX Layout'),
	description: __( 'Add a pre-made block or layout.'),
	icon: 'layout',
	category: 'gutenberg-den-blocks',
	keywords: [
		__( 'layout', 'gutenberg-den-blocks' ),
		__( 'block', 'gutenberg-den-blocks' ),
	],

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
 * Add a GX Layout button to the toolbar.
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
	html += `<button id="gxAddLayoutButton" class="components-button components-icon-button" aria-label="${ __( 'Add Layout' ) }">\
	</i><img src="/wp-content/plugins/gutenberg-den/img/gx-icon.png" /> ${ __( 'GX Library') }</button>`;
	html += '</div>';
	buttonDiv.innerHTML = html;
	toolbar.appendChild( buttonDiv );
	document.getElementById( 'gxAddLayoutButton' ).addEventListener( 'click', abInsertLayout );
}

/**
 * Add the GX Layout block on click.
 */
function abInsertLayout() {
	let block = wp.blocks.createBlock( 'gutenberg-den/gx-layout' );
	wp.data.dispatch( 'core/editor' ).insertBlocks( block );
}
