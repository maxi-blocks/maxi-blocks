// &panel=documentation-&-support will open the tab in the accordion
document.addEventListener('DOMContentLoaded', function maxiTabsPanels() {
	const urlStr = window.location.href;
	const url = new URL(urlStr);
	const toCheck = url.searchParams.get('panel');
	console.log(toCheck);
	const checkBox = document.getElementById(toCheck);
	if (checkBox) checkBox.checked = true;
});
