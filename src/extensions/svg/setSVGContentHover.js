/* eslint-disable no-useless-escape */
const setSVGContentHover = (content, color, type) => {
	let newContent = content;

	const typeRegexString = ` ${type}=[^-]([^none])([^\\"]+)`;
	const svgExistsRegExp = new RegExp(`\\sdata-hover-${type}[\\s=>"']`);
	const svgStr = ` data-hover-${type}$&`;

	const cssRegExpOld = new RegExp(
		`((\.maxi-svg-icon-block__icon:hover \.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))(})`,
		'g'
	);
	const cssStrOld = '';

	const cssRegexString = `((\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))`;
	const cssRegExp = new RegExp(`hover${cssRegexString}`, 'g');
	const cssStr = `$1}.maxi-svg-icon-block__icon:hover $2{${type}:${color}`;

	newContent = (
		!newContent.match(svgExistsRegExp)
			? newContent.replace(new RegExp(typeRegexString, 'g'), svgStr)
			: newContent
	).replace(cssRegExpOld, cssStrOld);

	newContent = !newContent.match(cssRegExp)
		? newContent.replace(new RegExp(cssRegexString, 'g'), cssStr)
		: newContent;

	return newContent;
};

export default setSVGContentHover;
