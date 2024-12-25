import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import clipPath from './clipPath';

const clipPathHover = hoverAttributesCreator({
	obj: clipPath,
	sameValAttr: ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].map(
		breakpoint => `clip-path-status-${breakpoint}`
	),
});

export default clipPathHover;
