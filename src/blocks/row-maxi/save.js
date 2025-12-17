/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const name = 'maxi-blocks/row-maxi';

	// Build carousel data attributes
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const carouselDataAttrs = {};

	// Add breakpoint-specific carousel status - ONLY if true
	breakpoints.forEach(bp => {
		const status = attributes[`row-carousel-status-${bp}`];
		if (status === true) {
			carouselDataAttrs[`data-carousel-${bp}`] = true;

			// Add breakpoint-specific alignment - only if explicitly set
			const alignment = attributes[`row-carousel-alignment-${bp}`];
			if (alignment) {
				carouselDataAttrs[`data-carousel-alignment-${bp}`] = alignment;
			}
		}
	});

	// Check if any breakpoint has carousel enabled
	const carouselEnabled = breakpoints.some(
		bp => attributes[`row-carousel-status-${bp}`]
	);

	// Add carousel configuration if enabled
	if (carouselEnabled) {
		carouselDataAttrs['data-carousel-slides-per-view'] =
			attributes['row-carousel-slides-per-view'] || 1;
		carouselDataAttrs['data-carousel-column-gap'] =
			attributes['row-carousel-column-gap'] || 0;
		carouselDataAttrs['data-carousel-peek-offset'] =
			attributes['row-carousel-peek-offset'] || 0;
		carouselDataAttrs['data-carousel-trigger-width'] =
			attributes['row-carousel-trigger-width'] || '';
		carouselDataAttrs['data-carousel-loop'] =
			attributes['row-carousel-loop'];
		carouselDataAttrs['data-carousel-autoplay'] =
			attributes['row-carousel-autoplay'];
		carouselDataAttrs['data-carousel-autoplay-speed'] =
			attributes['row-carousel-autoplay-speed'];
		carouselDataAttrs['data-carousel-hover-pause'] =
			attributes['row-carousel-pause-on-hover'];
		carouselDataAttrs['data-carousel-interaction-pause'] =
			attributes['row-carousel-pause-on-interaction'];
		carouselDataAttrs['data-carousel-transition'] =
			attributes['row-carousel-transition'];
		carouselDataAttrs['data-carousel-transition-speed'] =
			attributes['row-carousel-transition-speed'];

		// Add arrow/dot icon content for JavaScript to use
		if (attributes['navigation-arrow-first-icon-content']) {
			carouselDataAttrs['data-arrow-first-icon'] =
				attributes['navigation-arrow-first-icon-content'];
		}
		if (attributes['navigation-arrow-second-icon-content']) {
			carouselDataAttrs['data-arrow-second-icon'] =
				attributes['navigation-arrow-second-icon-content'];
		}
		if (attributes['navigation-dot-icon-content']) {
			carouselDataAttrs['data-dot-icon'] =
				attributes['navigation-dot-icon-content'];
		}
	}

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			{...carouselDataAttrs}
			useInnerBlocks
			aria-label={attributes.ariaLabels?.row}
		/>
	);
};

export default save;
