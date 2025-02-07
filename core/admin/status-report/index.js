document.addEventListener('DOMContentLoaded', function maxiStatusReport() {
	const copyButton = document.getElementById('maxi-copy-report');
	const successNotice = document.getElementById('maxi-copy-success');
	const reportContent = document.getElementById('maxi-copy-report-content');

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

		function showSuccess() {
			successNotice.style.display = 'block';
			setTimeout(function () {
				successNotice.style.display = 'none';
			}, 3000);
		}

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
	}
});
