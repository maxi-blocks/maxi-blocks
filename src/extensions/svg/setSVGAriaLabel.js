const setSVGAriaLabel = (value, getIcon, target) => {
	const svg = new DOMParser()
		.parseFromString(getIcon(target), 'text/html')
		.documentElement.querySelector('svg');

	if (!svg) return null;

	svg.setAttribute('aria-label', value);
	return svg.outerHTML;
};

export default setSVGAriaLabel;
