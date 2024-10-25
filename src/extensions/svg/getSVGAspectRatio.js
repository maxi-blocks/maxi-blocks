const getSVGAspectRatio = svg => {
	if (!svg || typeof svg !== 'string') return null;

	const match = svg.match(/preserveaspectratio="([^"]+)"/i);
	return match ? match[1] : null;
};

export default getSVGAspectRatio;
