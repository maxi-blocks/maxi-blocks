import hoverAttributesCreator from '../hoverAttributesCreator';
import clipPath from './clipPath';

const clipPathHover = hoverAttributesCreator({
	obj: clipPath,
	sameValAttr: ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].map(
		breakpoint => `_cp.s-${breakpoint}` // clip-path-status
	),
});

export default clipPathHover;
