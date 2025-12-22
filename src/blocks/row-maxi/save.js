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

	// Check if carousel is enabled (global, not breakpoint-specific)
	const carouselEnabled = attributes['row-carousel-status'];

	// If carousel is enabled, save status and all breakpoint-specific settings
	if (carouselEnabled) {
		// Add global carousel status for JavaScript detection
		carouselDataAttrs['data-carousel-status'] = true;
		breakpoints.forEach(bp => {
			// Add breakpoint-specific carousel settings
			const slidesPerView =
				attributes[`row-carousel-slides-per-view-${bp}`];
			if (slidesPerView !== undefined) {
				carouselDataAttrs[`data-carousel-slides-per-view-${bp}`] =
					slidesPerView;
			}

			const columnGap = attributes[`row-carousel-column-gap-${bp}`];
			if (columnGap !== undefined) {
				carouselDataAttrs[`data-carousel-column-gap-${bp}`] = columnGap;
			}

			const peekOffset = attributes[`row-carousel-peek-offset-${bp}`];
			if (peekOffset !== undefined) {
				carouselDataAttrs[`data-carousel-peek-offset-${bp}`] =
					peekOffset;
			}

			const loop = attributes[`row-carousel-loop-${bp}`];
			if (loop !== undefined) {
				carouselDataAttrs[`data-carousel-loop-${bp}`] = loop;
			}

			const autoplay = attributes[`row-carousel-autoplay-${bp}`];
			if (autoplay !== undefined) {
				carouselDataAttrs[`data-carousel-autoplay-${bp}`] = autoplay;
			}

			const autoplaySpeed =
				attributes[`row-carousel-autoplay-speed-${bp}`];
			if (autoplaySpeed !== undefined) {
				carouselDataAttrs[`data-carousel-autoplay-speed-${bp}`] =
					autoplaySpeed;
			}

			const pauseOnHover =
				attributes[`row-carousel-pause-on-hover-${bp}`];
			if (pauseOnHover !== undefined) {
				carouselDataAttrs[`data-carousel-hover-pause-${bp}`] =
					pauseOnHover;
			}

			const pauseOnInteraction =
				attributes[`row-carousel-pause-on-interaction-${bp}`];
			if (pauseOnInteraction !== undefined) {
				carouselDataAttrs[`data-carousel-interaction-pause-${bp}`] =
					pauseOnInteraction;
			}

			const transition = attributes[`row-carousel-transition-${bp}`];
			if (transition !== undefined) {
				carouselDataAttrs[`data-carousel-transition-${bp}`] =
					transition;
			}

			const transitionSpeed =
				attributes[`row-carousel-transition-speed-${bp}`];
			if (transitionSpeed !== undefined) {
				carouselDataAttrs[`data-carousel-transition-speed-${bp}`] =
					transitionSpeed;
			}

			// Add breakpoint-specific alignment
			const alignment = attributes[`row-carousel-alignment-${bp}`];
			if (alignment) {
				carouselDataAttrs[`data-carousel-alignment-${bp}`] = alignment;
			}
		});

		// Add global carousel configuration
		carouselDataAttrs['data-carousel-trigger-width'] =
			attributes['row-carousel-trigger-width'] || '';

		// Add arrow/dot status (breakpoint-specific)
		// Note: using "carousel" prefix to match getBreakpointSetting() in JavaScript
		breakpoints.forEach(bp => {
			const arrowStatus =
				attributes[`navigation-arrow-both-status-${bp}`];
			if (arrowStatus !== undefined) {
				carouselDataAttrs[`data-carousel-arrow-status-${bp}`] =
					arrowStatus;
			}

			const dotStatus = attributes[`navigation-dot-status-${bp}`];
			if (dotStatus !== undefined) {
				carouselDataAttrs[`data-carousel-dot-status-${bp}`] = dotStatus;
			}
		});

		// Add arrow/dot icon content for JavaScript to use (with defaults)
		carouselDataAttrs['data-arrow-first-icon'] =
			attributes['navigation-arrow-first-icon-content'] ||
			'<svg class="arrow-left-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M8.85 19l-7-7 7-7m-7 7h20.3"/></svg>';

		carouselDataAttrs['data-arrow-second-icon'] =
			attributes['navigation-arrow-second-icon-content'] ||
			'<svg class="arrow-right-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M15.15 5l7 7-7 7m7-7H1.85"/></svg>';

		carouselDataAttrs['data-dot-icon'] =
			attributes['navigation-dot-icon-content'] ||
			'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>';

		// Add active dot icon (falls back to normal dot icon if not set)
		carouselDataAttrs['data-active-dot-icon'] =
			attributes['active-navigation-dot-icon-content'] ||
			carouselDataAttrs['data-dot-icon'];
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
