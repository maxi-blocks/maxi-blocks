const setSVGContent = (content, color, type) => {
	const svgRegExp = new RegExp(
		`(?<!data-${type})(?<!data-${type} data-hover-${type})( ${type}=[^-]([^none])([^\\"]+))`,
		'g'
	);
	const svgStr = ` data-${type}$1`;

	const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
	const fillStr = `${type}:${color}`;

	const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
	const fillStr2 = `${type}="${color}`;

	const newContent = content
		.replace(svgRegExp, svgStr)
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2);

	return newContent;
};

export default setSVGContent;
