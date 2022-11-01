const setSVGContent = (content, color, type) => {
	const typeRegexString = ` ${type}=[^-]([^none])([^\\"]+)`;

	const svgRegExp = new RegExp(
		`data-${type}( data-hover-${type}|)${typeRegexString}`,
		'g'
	);
	const svgStr = ` data-${type}$&`;

	const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
	const fillStr = `${type}:${color}`;

	const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
	const fillStr2 = `${type}="${color}`;

	const newContent = (
		!content.match(svgRegExp) && (type === 'fill' || type === 'stroke')
			? content.replace(new RegExp(typeRegexString, 'g'), svgStr)
			: content
	)
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2);

	return newContent;
};

export default setSVGContent;
