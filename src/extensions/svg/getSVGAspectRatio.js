const getSVGAspectRatio = svg =>
	svg.includes('preserveaspectratio')
		? svg?.split('preserveaspectratio="')?.pop()?.split('"')[0]
		: null;

export default getSVGAspectRatio;
