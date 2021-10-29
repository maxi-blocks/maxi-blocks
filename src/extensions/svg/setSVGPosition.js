import getSVGAspectRatio from './getSVGAspectRatio';

const setSVGPosition = (icon, value) => {
	const oldPreserveAspectRatio = getSVGAspectRatio(icon);
	let newPreserveAspectRatio = value;

	if (oldPreserveAspectRatio.includes('slice'))
		newPreserveAspectRatio += ' slice';

	if (oldPreserveAspectRatio.includes('meet'))
		newPreserveAspectRatio += ' meet';

	const newIcon = icon.replace(
		oldPreserveAspectRatio,
		newPreserveAspectRatio
	);

	return newIcon;
};

export default setSVGPosition;
