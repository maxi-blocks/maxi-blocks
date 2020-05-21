/**
 * BLOCK: GE Library
 * A block to import other blocks or layotus directly from the online library
 */

/**
 * Import dependencies.
 */
import Edit from './edit';
import LayoutsProvider from './layouts-provider';
import { library } from '../../icons';
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
registerBlockType( 'maxi-blocks/maxi-cloud', {
	title: __( 'Library Maxi'),
	description: __( 'Add a pre-made block or template.'),
	icon: library,
	category: 'maxi-blocks',
	keywords: [
		__( 'layout', 'maxi-blocks' ),
		__( 'block', 'maxi-blocks' ),
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
	let html = '<div class="maxi-toolbar-layout">';
	html += `<a type="button" id="gxAddLayoutButton" class="button components-button components-icon-button" aria-label="${ __( 'Maxi Cloud Library', 'maxi-blocks' ) }">\
	</i><img src="/wp-content/plugins/maxi-blocks/img/maxi-logo.svg" /> ${ __( 'Maxi Cloud Library', 'maxi-blocks') }</a>`;
	html += `<a type="button"  href="/wp-admin/customize.php" target="_blank" id="gxGoToCustomizerButton" class="button components-button components-icon-button" aria-label="${ __( 'Global Styles', 'maxi-blocks' ) }">\
	</i><img src="/wp-content/plugins/maxi-blocks/img/maxi-logo.svg" /> ${ __( 'Global Styles', 'maxi-blocks') }</a>`;
	html += '</div>';
	buttonDiv.innerHTML = html;
	toolbar.appendChild( buttonDiv );
	document.getElementById( 'gxAddLayoutButton' ).addEventListener( 'click', abInsertLayout );
}

/**
 * Add the GE Library block on click.
 */
function abInsertLayout() {
	let block = wp.blocks.createBlock( 'maxi-blocks/maxi-cloud' );
	wp.data.dispatch( 'core/editor' ).insertBlocks( block );
}
