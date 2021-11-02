import getSVGAspectRatio from './getSVGAspectRatio';

const setSVGRatio = (icon, value) => {
	const oldPreserveAspectRatio = getSVGAspectRatio(icon);

	const newPreserveAspectRatio = `${oldPreserveAspectRatio} ${value}`;

	const newIcon = icon
		.replaceAll(' meet', '')
		.replaceAll(' slice', '')
		.replace(oldPreserveAspectRatio, newPreserveAspectRatio);

	return newIcon;
};

export default setSVGRatio;
