const exportStyleCard = (function createJSONfile() {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	return function createAtag(data, fileName) {
		const json = JSON.stringify(data),
		blob = new Blob([json], {type: 'application/json'}),
		url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = fileName;
		a.click();
		window.URL.revokeObjectURL(url);
	};
}());

export default exportStyleCard;
