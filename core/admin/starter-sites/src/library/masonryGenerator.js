/**
 * External dependencies
 */
import Masonry from 'masonry-layout';

const masonryGenerator = (type = 'starter-sites') => {
	console.log('masonryGenerator');
	const popupWrap = document.querySelector(
		'.maxi-cloud-container__details-popup_wrap'
	);
	console.log(popupWrap);
	if (popupWrap) {
		console.log('popupWrap');
		if (popupWrap) {
			// eslint-disable-next-line no-new
			new Masonry(popupWrap, {
				itemSelector: '.maxi-cloud-container__details-popup_item',
				gutter: 16,
				transitionDuration: 0,
				stagger: 30,
			});
		}
	} else {
		const elem = document.querySelector(
			'.maxi-cloud-container__patterns__content-patterns .ais-InfiniteHits-list'
		);

		if (elem) {
			// eslint-disable-next-line no-new
			new Masonry(elem, {
				itemSelector: '.ais-InfiniteHits-item',
				gutter: 16,
				transitionDuration: 0,
				stagger: 30,
			});
		}
	}
};

export default masonryGenerator;
