const getSVGAspectRatio = svg =>
	svg?.split('preserveaspectratio="').pop().split('"')[0].split(' ')[1];

export default getSVGAspectRatio;
