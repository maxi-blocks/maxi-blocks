const downloadTextFile = (data, fileName) => {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';

	// Need stringify twice to get 'text/plain' mime type
	const json = JSON.stringify(JSON.stringify(data));
	const blob = new Blob([json], { type: 'text/plain' });
	const url = window.URL.createObjectURL(blob);

	a.href = url;
	a.download = fileName;
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
};

export default downloadTextFile;
