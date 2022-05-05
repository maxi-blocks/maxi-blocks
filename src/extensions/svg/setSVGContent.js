const setSVGContent = (content, color, type) => {
	const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
	const fillStr = `${type}:${color}`;

	const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
	const fillStr2 = ` ${type}="${color}`;

	const newContent = content
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2);

	return newContent;
};

export default setSVGContent;
