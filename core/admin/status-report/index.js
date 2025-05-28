/* global ajaxurl, MaxiSystemReport */
document.addEventListener('DOMContentLoaded', function maxiStatusReport() {
	const copyButton = document.getElementById('maxi-copy-report');
	const successNotice = document.getElementById('maxi-copy-success');
	const reportContent = document.getElementById('maxi-copy-report-content');

	/**
	 * Shows success notice for 3 seconds
	 */
	function showSuccess() {
		successNotice.style.display = 'block';
		setTimeout(function () {
			successNotice.style.display = 'none';
		}, 3000);
	}

	/**
	 * Fallback copy method using document.execCommand
	 */
	function fallbackCopy() {
		// Make textarea visible but out of view
		reportContent.style.position = 'fixed';
		reportContent.style.top = '0';
		reportContent.style.left = '0';
		reportContent.style.opacity = '0';
		reportContent.style.display = 'block';

		// Select the text
		reportContent.select();
		reportContent.setSelectionRange(0, 99999); // For mobile devices

		try {
			// Execute copy command
			document.execCommand('copy');
			showSuccess();
		} catch (err) {
			console.error('Failed to copy text: ', err);
		} finally {
			// Restore textarea to hidden state
			reportContent.style.display = 'none';
		}
	}

	if (copyButton && successNotice && reportContent) {
		copyButton.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			const text = reportContent.value;

			// Try modern clipboard API first
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard
					.writeText(text)
					.then(showSuccess)
					.catch(fallbackCopy);
			} else {
				fallbackCopy();
			}
		});

		// Ensure notice is hidden by default
		successNotice.style.display = 'none';
	}

	// New download functionality
	const downloadButton = document.getElementById('maxi-download-report');
	if (downloadButton && reportContent) {
		downloadButton.addEventListener('click', function () {
			const filename = this.getAttribute('data-filename');
			const content = reportContent.value;

			// Create blob and download
			const blob = new Blob([content], { type: 'text/plain' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = filename || 'MaxiBlocks_Status_Report.txt';

			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		});
	}

	// Load frontend assets asynchronously
	const frontendAssetsSection = document.getElementById(
		'maxi-frontend-assets'
	);
	if (frontendAssetsSection) {
		frontendAssetsSection.innerHTML =
			'<tr><td colspan="4">' +
			'<div class="maxi-loading">Loading frontend assets...</div>' +
			'</td></tr>';

		fetch(ajaxurl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'action=maxi_get_frontend_assets',
		})
			.then(response => response.json())
			.then(data => {
				if (data.success && data.data) {
					// Clear existing content
					frontendAssetsSection.innerHTML = '';

					// Create header row
					const headerRow = document.createElement('tr');
					const headerCell = document.createElement('th');
					headerCell.colSpan = 4;
					headerCell.textContent =
						MaxiSystemReport.i18n.frontendAssets;
					headerRow.appendChild(headerCell);
					frontendAssetsSection.appendChild(headerRow);

					// CSS Files section
					const cssRow = document.createElement('tr');
					const cssCell = document.createElement('td');
					cssCell.colSpan = 4;
					cssCell.className = 'plugin-section';

					const cssTitle = document.createElement('strong');
					cssTitle.textContent = `${MaxiSystemReport.i18n.cssFiles} (${data.data.css.length})`;
					cssCell.appendChild(cssTitle);
					cssCell.appendChild(document.createElement('br'));

					data.data.css.forEach(css => {
						const cssText = document.createTextNode(css);
						cssCell.appendChild(cssText);
						cssCell.appendChild(document.createElement('br'));
					});

					cssRow.appendChild(cssCell);
					frontendAssetsSection.appendChild(cssRow);

					// JavaScript Files section
					const jsRow = document.createElement('tr');
					const jsCell = document.createElement('td');
					jsCell.colSpan = 4;
					jsCell.className = 'plugin-section';

					const jsTitle = document.createElement('strong');
					jsTitle.textContent = `${MaxiSystemReport.i18n.jsFiles} (${data.data.js.length})`;
					jsCell.appendChild(jsTitle);
					jsCell.appendChild(document.createElement('br'));

					data.data.js.forEach(js => {
						const jsText = document.createTextNode(js);
						jsCell.appendChild(jsText);
						jsCell.appendChild(document.createElement('br'));
					});

					jsRow.appendChild(jsCell);
					frontendAssetsSection.appendChild(jsRow);

					// Update report text content
					if (reportContent) {
						let text = reportContent.value;
						const assetsSection = '\n--- Frontend Assets ---\n';
						const endReport = '\n====== END SYSTEM REPORT ======';

						// Generate new assets text
						let newAssetsText = assetsSection;
						newAssetsText += `\nCSS Files (${data.data.css.length}):\n`;
						data.data.css.forEach(css => {
							newAssetsText += `- ${css}\n`;
						});
						newAssetsText += `\nJavaScript Files (${data.data.js.length}):\n`;
						data.data.js.forEach(js => {
							newAssetsText += `- ${js}\n`;
						});

						// Replace the loading placeholder with actual content
						const startIndex = text.indexOf(assetsSection);
						const endIndex = text.indexOf(endReport);
						if (startIndex !== -1 && endIndex !== -1) {
							text =
								text.substring(0, startIndex) +
								newAssetsText +
								text.substring(endIndex);
							reportContent.value = text;
						}
					}
				} else {
					frontendAssetsSection.innerHTML = '';
					const errorRow = document.createElement('tr');
					const errorCell = document.createElement('td');
					errorCell.colSpan = 4;
					errorCell.className = 'error';
					errorCell.textContent =
						MaxiSystemReport.i18n.errorLoadingAssets;
					errorRow.appendChild(errorCell);
					frontendAssetsSection.appendChild(errorRow);

					// Update error in report text
					if (reportContent) {
						let text = reportContent.value;
						text = text.replace(
							/--- Frontend Assets ---\n.*?\n(?=====)/s,
							`--- Frontend Assets ---\n${MaxiSystemReport.i18n.errorLoadingAssets}\n\n`
						);
						reportContent.value = text;
					}
				}
			})
			.catch(error => {
				frontendAssetsSection.innerHTML = '';
				const errorRow = document.createElement('tr');
				const errorCell = document.createElement('td');
				errorCell.colSpan = 4;
				errorCell.className = 'error';
				errorCell.textContent =
					MaxiSystemReport.i18n.errorLoadingAssets;
				errorRow.appendChild(errorCell);
				frontendAssetsSection.appendChild(errorRow);
				console.error('Error loading frontend assets:', error);

				// Update error in report text
				if (reportContent) {
					let text = reportContent.value;
					text = text.replace(
						/--- Frontend Assets ---\n.*?\n(?=====)/s,
						`--- Frontend Assets ---\n${MaxiSystemReport.i18n.errorLoadingAssets}\n\n`
					);
					reportContent.value = text;
				}
			});
	}
});
