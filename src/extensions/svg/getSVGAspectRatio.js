const getSVGAspectRatio = svg =>
	svg?.split('preserveaspectratio="').pop().split('"')[0];

export default getSVGAspectRatio;
