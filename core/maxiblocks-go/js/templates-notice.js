document.addEventListener(
	'DOMContentLoaded',
	function maxiBlocksGoTemplatesNotice() {
		const { nonce, ajaxUrl, adminUrl, importing, done, error, view } =
			// eslint-disable-next-line no-undef
			maxiblocks;
		const importButton = document.getElementById(
			'maxiblocks-go-notice-import-templates-patterns'
		);
		if (importButton) {
			const importStatusText = importButton.querySelector(
				'.maxiblocks-go-button__text'
			);
			const importStatusIcon = importButton.querySelector(
				'.maxiblocks-go-button__icon'
			);
			const originalButtonText = importStatusText.textContent;

			importButton.addEventListener(
				'click',
				function maxiBlocksGoTemplatesNoticeClick(event) {
					if (importButton.classList.contains('view-templates')) {
						event.preventDefault();
						window.location.href = `${adminUrl}site-editor.php?postType=wp_template&activeView=MaxiBlocks%20Go`;
						return;
					}
					importButton.classList.add('updating-message', 'disabled');
					importStatusText.textContent = importing || 'Importing...';
					importStatusIcon.classList.add('hidden');

					const xhr = new XMLHttpRequest();
					xhr.open('POST', ajaxUrl);
					xhr.setRequestHeader(
						'Content-Type',
						'application/x-www-form-urlencoded'
					);
					xhr.onload = function maxiBlocksGoTemplatesNoticeLoad() {
						if (xhr.status === 200) {
							const response = JSON.parse(xhr.responseText);
							if (response.success) {
								console.log(response.data);
								importButton.classList.replace(
									'updating-message',
									'updated-message'
								);
								importStatusText.textContent = done || 'Done';
								setTimeout(
									function maxiBlocksGoTemplatesNoticeTimeout() {
										importButton.classList.remove(
											'updated-message',
											'disabled'
										);
										importStatusText.textContent =
											view || 'View theme templates';
										importStatusIcon.classList.remove(
											'hidden'
										);
										importButton.classList.add(
											'view-templates'
										);
									},
									1000
								);
							} else {
								console.error('Error:', response.data);
								importButton.classList.remove(
									'updating-message',
									'disabled'
								);
								importStatusText.textContent =
									error || originalButtonText;
								// Display error message or perform any other actions
							}
						} else {
							console.error('AJAX error:', xhr.status);
							importButton.classList.remove(
								'updating-message',
								'disabled'
							);
							importStatusText.textContent =
								error || originalButtonText;
							// Display error message or perform any other actions
						}
					};
					xhr.onerror = function maxiBlocksGoTemplatesNoticeError() {
						console.error('AJAX error:', xhr.status);
						importButton.classList.remove(
							'updating-message',
							'disabled'
						);
						importStatusText.textContent =
							error || originalButtonText;
						// Display error message or perform any other actions
					};
					const data = `action=plugin_maxiblocks_go_copy_patterns&nonce=${nonce}`;
					xhr.send(data);
				}
			);

			const closeButton = document.querySelector(
				'.maxiblocks-go-notice .maxiblocks-go-notice__dismiss'
			);

			/**
			 * Event handler for close button click.
			 * Sends a request to dismiss the notice.
			 */
			if (closeButton) {
				/** @var {HTMLElement} noticeContainer - Container element for the notice. */
				const noticeContainer = document.querySelector(
					'.maxiblocks-go-notice'
				);

				/**
				 * Hides and removes the notice element from the DOM.
				 */
				const hideAndRemoveNotice = () => noticeContainer?.remove();
				closeButton?.addEventListener('click', async () => {
					const response = await fetch(ajaxUrl, {
						method: 'POST',
						headers: {
							'Content-Type':
								'application/x-www-form-urlencoded; charset=UTF-8',
						},
						body: `action=maxiblocks-go-theme-dismiss-templates-notice&nonce=${nonce}`,
					});

					if (response.status === 200) {
						hideAndRemoveNotice();
					}
				});
			}
		}
	}
);
