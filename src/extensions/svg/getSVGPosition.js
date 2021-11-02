import getSVGAspectRatio from './getSVGAspectRatio';

const getSVGPosition = icon =>
	getSVGAspectRatio(icon)?.replaceAll(' meet', '').replaceAll(' slice', '');

export default getSVGPosition;
