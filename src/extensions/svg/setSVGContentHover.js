const setSVGContentHover = (content, color, type) => {
	let newContent = content;

	const svgRegExp = new RegExp(`( ${type}=[^-]([^none])([^\\"]+))`, 'g');
	const svgStr = ` data-hover-${type}$1`;

	const cssRegExpOld = new RegExp(
		`((\.maxi-svg-icon-block__icon:hover \.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))(})`,
		'g'
	);
	const cssStrOld = '';

	const cssRegExp = new RegExp(
		`(((?<!hover)\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))`,
		'g'
	);
	const cssStr = `$1}.maxi-svg-icon-block__icon:hover $2{${type}:${color}`;

	newContent = newContent
		.replace(svgRegExp, svgStr)
		.replace(cssRegExpOld, cssStrOld)
		.replace(cssRegExp, cssStr);

	return newContent;
};

export default setSVGContentHover;
