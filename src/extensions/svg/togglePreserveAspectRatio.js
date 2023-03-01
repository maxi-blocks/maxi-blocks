/**
 *
 * @param {string}  content SVG content string
 * @param {boolean} toggle  Toggle preserveAspectRatio
 * @return {string}         SVG content string
 */
const togglePreserveAspectRatio = (content, toggle) => {
	const svg = new DOMParser().parseFromString(content, 'text/html').body
		.firstChild;

	if (!svg || svg.tagName !== 'svg') return content;

	if (toggle) {
		svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
	} else {
		svg.removeAttribute('preserveAspectRatio');
	}

	return svg.outerHTML;
};

export default togglePreserveAspectRatio;
