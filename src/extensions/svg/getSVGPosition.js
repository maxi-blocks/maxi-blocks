import getSVGAspectRatio from './getSVGAspectRatio';

const getSVGPosition = icon => {
	const aspectRatio = getSVGAspectRatio(icon);
	return aspectRatio?.replace(/\s*(meet|slice)$/, '') || null;
};

export default getSVGPosition;
