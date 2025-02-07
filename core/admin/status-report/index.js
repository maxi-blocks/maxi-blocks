document.addEventListener('DOMContentLoaded', function maxiStatusReport() {
	const copyButton = document.getElementById('maxi-copy-report');
	if (copyButton) {
		copyButton.addEventListener('click', function () {
			const table = document.querySelector('.maxi-status-table');
			const successNotice = document.getElementById('maxi-copy-success');

			if (table) {
				const text = table.innerText;
				navigator.clipboard.writeText(text).then(function () {
					successNotice.style.display = 'block';
					setTimeout(function () {
						successNotice.style.display = 'none';
					}, 3000);
				});
			}
		});
	}
});
