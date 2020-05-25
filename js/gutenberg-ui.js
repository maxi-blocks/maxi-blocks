/**
 * Add a GE Library button to the toolbar.
 */
const { __, _x, _n, _nx } = wp.i18n;
document.addEventListener( 'DOMContentLoaded', addMaxiLayoutButton );

/**
 * Build the layout inserter button.
 */
function addMaxiLayoutButton() {
	let toolbar = document.querySelector( '.edit-post-header-toolbar' );
	if ( ! toolbar ) {
		console.log('no toolbar');
		return;
	}
	console.log('toolbar');
	let buttonDiv = document.createElement( 'div' );
	let html = '<div class="maxi-toolbar-layout">';
	html += `<a type="button" id="maxi-button__layout" class="button maxi-button maxi-button__toolbar" aria-label="${ __( 'Maxi Cloud Library', 'maxi-blocks' ) }">\
	</i><img src="/wp-content/plugins/maxi-blocks/img/maxi-logo.svg" /> ${ __( 'Maxi Cloud Library', 'maxi-blocks') }</a>`;
	html += `<a type="button"  href="/wp-admin/customize.php" target="_blank" id="maxi-button__go-to-customizer" class="button maxi-button maxi-button__toolbar" aria-label="${ __( 'Global Styles', 'maxi-blocks' ) }">\
	</i><img src="/wp-content/plugins/maxi-blocks/img/maxi-logo.svg" /> ${ __( 'Global Styles', 'maxi-blocks') }</a>`;
	html += '</div>';
	buttonDiv.innerHTML = html;
	toolbar.appendChild( buttonDiv );
	document.getElementById( 'maxi-button__layout' ).addEventListener( 'click', MaxiInsertLayout );
}

/**
 * Add the GE Library block on click.
 */
function MaxiInsertLayout() {
	let block = wp.blocks.createBlock( 'maxi-blocks/maxi-cloud' );
	wp.data.dispatch( 'core/editor' ).insertBlocks( block );
}
