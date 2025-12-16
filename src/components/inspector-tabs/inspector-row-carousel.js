/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RowCarouselControl from '@blocks/row-maxi/components/row-carousel-control';

const rowCarousel = ({ props }) => ({
	label: __('Carousel', 'maxi-blocks'),
	content: <RowCarouselControl props={props} />,
});

export default rowCarousel;
