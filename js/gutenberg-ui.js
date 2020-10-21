/**
 * Add a GE Library button to the toolbar.
 */
const { __, _x, _n, _nx } = wp.i18n;
document.addEventListener('DOMContentLoaded', addMaxiLayoutButton);

/**
 * Build the layout inserter button.
 */
function addMaxiLayoutButton() {
	let toolbar = document.querySelector('.edit-post-header-toolbar');
	if (!toolbar) return;

	let buttonDiv = document.createElement('div');
	let html = '<div class="maxi-toolbar-layout">';
	html += `<a type="button" id="maxi-button__layout" class="button maxi-button maxi-button__toolbar" aria-label="${__(
		'Maxi Cloud Library',
		'maxi-blocks'
	)}">\
	</i><img src="../wp-content/plugins/maxi-blocks/img/maxi-logo.svg" />${__(
		'Maxi Cloud Library',
		'maxi-blocks'
	)}</a>`;
	html += `<a type="button" href="/wp-admin/customize.php" target="_blank" id="maxi-button__go-to-customizer" class="button maxi-button maxi-button__toolbar" aria-label="${__(
		'Global Styles',
		'maxi-blocks'
	)}">\
	</i><img src="../wp-content/plugins/maxi-blocks/img/maxi-logo.svg" />${__(
		'Global Styles',
		'maxi-blocks'
	)}</a>`;
	html += `<a type="button" href="javascript:void(0)" target="_blank" id="maxi-button__show-responsive" class="button maxi-button maxi-button__toolbar">\
	</i><img src="../wp-content/plugins/maxi-blocks/img/maxi-responsive.svg" /></a>`;
	html += '</div>';

	buttonDiv.innerHTML = html;
	toolbar.appendChild(buttonDiv);

	document
		.getElementById('maxi-button__layout')
		.addEventListener('click', MaxiInsertLayout);

	document
		.getElementById('maxi-button__show-responsive')
		.addEventListener('click', function (e) {
			e.preventDefault();

			const responsiveToolbar = document.getElementById(
				'maxi-blocks__responsive-toolbar'
			);

			if (responsiveToolbar.style.display == 'block') {
				responsiveToolbar.style.display = 'none';
				this.classList.remove('active-button');
			} else {
				responsiveToolbar.style.display = 'block';
				this.classList.add('active-button');
			}
		});
}

/**
 * Add the GE Library block on click.
 */
function MaxiInsertLayout() {
	let block = wp.blocks.createBlock('maxi-blocks/maxi-cloud');
	wp.data.dispatch('core/editor').insertBlocks(block);
}

jQuery(document).ready(function ($) {
	$('textarea#maxi_blocks_custom_ccs_page').on('keyup', function () {
		console.log('t change');
		let custom_css_code = $('textarea#maxi_blocks_custom_ccs_page').val();

		$('style#maxi-blocks-custom-ccs-page').text(custom_css_code);
		//wp.data.dispatch( 'core/editor' ).editPost( { maxi_custom_css_page: {custom_css_code} } );

		//jQuery('div.editor-post-link input.components-text-control__input').val('item-'+post_count);
	});
});
