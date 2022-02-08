import getSVGAspectRatio from './getSVGAspectRatio';

const getSVGRatio = icon =>
	getSVGAspectRatio(icon)?.includes('meet') ? 'meet' : 'slice';

export default getSVGRatio;
