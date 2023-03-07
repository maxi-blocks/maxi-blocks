const getSVGAspectRatio = svg => {
	if (!svg) return null;
	return svg.includes('preserveaspectratio')
		? svg?.split('preserveaspectratio="')?.pop()?.split('"')[0]
		: null;
};

export default getSVGAspectRatio;
