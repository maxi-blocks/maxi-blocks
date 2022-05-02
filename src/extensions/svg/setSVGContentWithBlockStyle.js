const setSVGContentWithBlockStyle = (content, fillColor, strokeColor) => {
	const fillRegExp = new RegExp('fill:([^none])([^\\}]+)', 'g');
	const fillStr = `fill:${fillColor}`;

	const fillRegExp2 = new RegExp('fill=[^-]([^none])([^\\"]+)', 'g');
	const fillStr2 = ` fill="${fillColor}`;

	const strokeRegExp = new RegExp('stroke:([^none])([^\\}]+)', 'g');
	const strokeStr = `stroke:${strokeColor}`;

	const strokeRegExp2 = new RegExp('stroke=[^-]([^none])([^\\"]+)', 'g');
	const strokeStr2 = ` stroke="${strokeColor}`;

	const newContent = content
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2)
		.replace(strokeRegExp, strokeStr)
		.replace(strokeRegExp2, strokeStr2);

	return newContent;
};

export default setSVGContentWithBlockStyle;
