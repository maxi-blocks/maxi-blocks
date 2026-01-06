/**
 * External dependencies
 */
import Masonry from 'masonry-layout';

const masonryInstances = new Map();

const cleanupMasonryInstances = () => {
	for (const [element, instance] of masonryInstances.entries()) {
		if (!document.body.contains(element)) {
			instance.destroy();
			masonryInstances.delete(element);
		}
	}
};

const buildMasonry = (element, options) => {
	const existingInstance = masonryInstances.get(element);

	if (existingInstance) {
		existingInstance.reloadItems();
		existingInstance.layout();
		return;
	}

	masonryInstances.set(element, new Masonry(element, options));
};

const masonryGenerator = (type = 'starter-sites') => {
	cleanupMasonryInstances();

	const popupWraps = document.querySelectorAll('.maxi-cloud-masonry');

	if (popupWraps && popupWraps.length > 0) {
		popupWraps.forEach(popupWrap => {
			buildMasonry(popupWrap, {
				itemSelector: '.maxi-cloud-container__details-popup_item',
				gutter: 16,
				transitionDuration: 0,
				stagger: 30,
			});
		});
		return;
	}

	const elem = document.querySelector(
		'.maxi-cloud-container__patterns__content-patterns .ais-InfiniteHits-list'
	);

	if (!elem) return;

	buildMasonry(elem, {
		itemSelector: '.ais-InfiniteHits-item',
		gutter: 16,
		transitionDuration: 0,
		stagger: 30,
	});
};

export default masonryGenerator;
