const getSVGAspectRatio = svg => {
	if (!svg || !svg.includes('preserveaspectratio')) return null;
	return svg?.split('preserveaspectratio="')?.pop()?.split('"')[0];
};

export default getSVGAspectRatio;
