const clientIdCleaner = html =>
	html
		.replace(/(data-block=")([a-zA-Z0-9:;\.\s\(\)\-\,]*)(")/g, '')
		.replace(/(id=")([a-zA-Z0-9:;\.\s\(\)\-\,]*)(")/g, '');

export default clientIdCleaner;
