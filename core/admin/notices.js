/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prettier/prettier */
/**
 * Ensure handlers are attached whether the script loads before or after DOMContentLoaded.
 * This script may be enqueued in the admin footer for the plugin-update notice,
 * so we cannot rely solely on DOMContentLoaded to register listeners.
 */
function setupMaxiAdminNotices() {
	const firstRow = document.querySelector(
		'tr.active.is-uninstallable[data-slug="maxi-blocks"]'
	);
	const secondRow = document.querySelector(
		'tr.plugin-update-tr.active.maxi-blocks-db-notice[data-slug="maxi-blocks"]'
	);

	// Check if both rows exist
	if (firstRow && secondRow) {
		// Get all td and th elements in the first row
		const cells = firstRow.querySelectorAll('td, th');
		cells.forEach(function (cell) {
			// Remove bottom border and box-shadow
			cell.style.borderBottom = 'none';
			cell.style.boxShadow = 'none';
		});
	}

	document.body.addEventListener('click', function (event) {
		if (event.target.closest('.maxi-blocks-db-notice .notice-dismiss')) {
			// Remove styles from the first tr when the dismiss button is clicked
			const firstRow = document.querySelector(
				'tr.active.is-uninstallable[data-slug="maxi-blocks"]'
			);
			if (firstRow) {
				const cells = firstRow.querySelectorAll('td, th');
				cells.forEach(function (cell) {
					cell.style.borderBottom = ''; // Resets the border-bottom style
					cell.style.boxShadow = ''; // Resets the box-shadow style
				});
			}

			fetch(maxiBlocks.rest_url, {
				method: 'POST',
				headers: {
					'X-WP-Nonce': maxiBlocks.nonce,
					'Content-Type': 'application/json',
				},
			})
				.then(response => {
					if (response.status === 204) {
						document.querySelector(
							'.maxi-blocks-db-notice'
						).style.display = 'none';
					}
				})
				.catch(error => console.error('Error:', error));
		}

		if (
			event.target.closest('#maxi-plugin-update-notice .notice-dismiss')
		) {
			fetch(
				maxiBlocks.rest_url.replace(
					'dismiss-notice',
					'dismiss-plugin-update-notice'
				),
				{
					method: 'POST',
					headers: {
						'X-WP-Nonce': maxiBlocks.nonce,
						'Content-Type': 'application/json',
					},
				}
			)
				.then(response => {
					if (response.status === 204) {
						// Successfully dismissed, hide the notice
						document.querySelector(
							'#maxi-plugin-update-notice'
						).style.display = 'none';
					}
				})
				.catch(error => console.error('Error:', error));
		}
	});
}
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', setupMaxiAdminNotices);
} else {
	setupMaxiAdminNotices();
}
