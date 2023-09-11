document.addEventListener('DOMContentLoaded', function maxiAdmin() {
	// &panel=documentation-support will open the tab in the accordion
	const urlStr = window.location.href;
	const url = new URL(urlStr);
	const toCheck = url.searchParams.get('panel');
	const checkBox = document.getElementById(toCheck);
	if (checkBox) checkBox.checked = true;

	// Hide the "Pro" tab if the user is not logged in
	const proDiv = document.getElementById('maxi-dashboard_main-content_pro');
	if (proDiv) proDiv.style.display = 'none';

	const notProDiv = document.getElementById(
		'maxi-dashboard_main-content_not-pro'
	);
	if (notProDiv) {
		notProDiv.style.display = 'block';
		document.getElementById(
			'maxi-dashboard_main-content_pro-not-pro'
		).style.display = 'block';
	}
});
