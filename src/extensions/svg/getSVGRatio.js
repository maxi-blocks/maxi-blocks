import getSVGAspectRatio from './getSVGAspectRatio';

const getSVGPosition = icon =>
	getSVGAspectRatio(icon)?.includes('slice') ? 'slice' : 'meet';

export default getSVGPosition;
