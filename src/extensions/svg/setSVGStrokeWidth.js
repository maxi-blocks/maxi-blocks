const setSVGStrokeWidth = (content, width) => {
	if (width) {
		const regexLineToChange = new RegExp('stroke-width:.+?(?=})', 'g');
		const changeTo = `stroke-width:${width}`;

		const regexLineToChange2 = new RegExp('stroke-width=".+?(?=")', 'g');
		const changeTo2 = `stroke-width="${width}`;

		const newContent = content
			.replace(regexLineToChange, changeTo)
			.replace(regexLineToChange2, changeTo2);

		return newContent;
	}

	return content;
};

export default setSVGStrokeWidth;
