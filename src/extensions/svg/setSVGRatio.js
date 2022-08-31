const setSVGRatio = (icon, value) =>
	value === 'meet'
		? icon.replaceAll(' slice', ' meet')
		: icon.replaceAll(' meet', ' slice');

export default setSVGRatio;
