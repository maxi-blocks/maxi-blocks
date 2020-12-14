const { __, _x, _n, _nx } = wp.i18n;

(function (window, wp) {
	let layout_id = 'maxi-toolbar-layout';

	let layoutHtml = '<div id="' + layout_id + '">';
	layoutHtml += `<a type="button" href="javascript:void(0)" target="_blank" id="maxi-button__show-responsive" class="button maxi-button maxi-button__toolbar">\
	</i><img src="../wp-content/plugins/maxi-blocks/img/maxi-responsive.svg" /></a>`;
	layoutHtml += `<a type="button" id="maxi-button__layout" class="button maxi-button maxi-button__toolbar" aria-label="${__(
		'Maxi Cloud Library',
		'maxi-blocks'
	)}">\
	</i><img src="../wp-content/plugins/maxi-blocks/img/maxi-logo.svg" />${__(
		'Maxi Cloud Library',
		'maxi-blocks'
	)}</a>`;
	layoutHtml += `<a type="button" href="/wp-admin/customize.php" target="_blank" id="maxi-button__go-to-customizer" class="button maxi-button maxi-button__toolbar" aria-label="${__(
		'Global Styles',
		'maxi-blocks'
	)}">\
	</i><img src="../wp-content/plugins/maxi-blocks/img/maxi-logo.svg" />${__(
		'Global Styles',
		'maxi-blocks'
	)}</a>`;
	layoutHtml += '</div>';

	// check if gutenberg's editor root element is present.
	let editorEl = document.getElementById('editor');
	if (!editorEl) {
		// do nothing if there's no gutenberg root element on page.
		return;
	}

	let unsubscribe = wp.data.subscribe(function () {
		setTimeout(function () {
			if (!document.getElementById(layout_id)) {
				let toolbalEl = editorEl.querySelector(
					'.edit-post-header__toolbar'
				);
				if (toolbalEl instanceof HTMLElement) {
					toolbalEl.insertAdjacentHTML('beforeend', layoutHtml);

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

							if (responsiveToolbar.style.display === 'block') {
								responsiveToolbar.style.display = 'none';
								this.classList.remove('active-button');
							} else {
								responsiveToolbar.style.display = 'block';
								this.classList.add('active-button');
							}
						});

					document.addEventListener('click', function (e) {
						if (
							e.target &&
							e.target.className ===
								'maxi-responsive-selector__close'
						) {
							const responsiveToolbar = document.getElementById(
								'maxi-blocks__responsive-toolbar'
							);
							const responsiveToolbarButton = document.getElementById(
								'maxi-button__show-responsive'
							);

							responsiveToolbar.style.display = 'none';
							responsiveToolbarButton.classList.remove(
								'active-button'
							);
						}
					});
				}
			}
		}, 1);
	});
})(window, wp);

function MaxiInsertLayout() {
	let block = wp.blocks.createBlock('maxi-blocks/maxi-cloud');
	wp.data.dispatch('core/editor').insertBlocks(block);
}
