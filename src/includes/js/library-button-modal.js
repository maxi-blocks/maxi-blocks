/**
 * BLOCK: GX Layout
 */

/**
 * Add a GX Layout button to the toolbar.
 */
document.addEventListener( 'DOMContentLoaded', addGXLayoutButton );

/**
 * Build the layout inserter button.
 */
function addGXLayoutButton() {
	let wp_toolbar = document.querySelector( '.list-reusable-blocks__container' );
	if ( ! wp_toolbar) {
		return;
	}
	let buttonDiv = document.createElement( 'div' );
	let html = '<div class="gx-toolbar-layout">';
	html += `<button id="gxAddLayoutButton" class="components-button components-icon-button" aria-label="${ __( 'Add Layout' ) }">\
	</i><img src="/wp-content/plugins/gutenberg-extra/img/GX-icon.png" /> ${ __( 'GX Library') }</button>`;
	html += '</div>';
	buttonDiv.innerHTML = html;
	if (wp_toolbar) wp_toolbar.next().append( buttonDiv );
	document.getElementById( 'gxAddLayoutButton' ).addEventListener( 'click', abInsertLayout );
}

/**
 * Add the GX Layout block on click.
 */
function abInsertLayout() {
	
}
