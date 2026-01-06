/**
 * External dependencies
 */
import Masonry from 'masonry-layout';

let masonryInstance = null;
let masonryElement = null;

const masonryGenerator = (type = 'patterns') => {
	if (type === 'preview' || type === 'switch-tone') return;

	const elem = document.querySelector(
		'.maxi-cloud-container__patterns__content-patterns .ais-InfiniteHits-list'
	);

	if (!elem) return;

	if (masonryInstance && masonryElement === elem) {
		masonryInstance.reloadItems();
		masonryInstance.layout();
		return;
	}

	if (masonryInstance) {
		masonryInstance.destroy();
	}

	masonryElement = elem;
	masonryInstance = new Masonry(elem, {
		itemSelector: '.ais-InfiniteHits-item',
		gutter: 16,
		transitionDuration: 0,
		stagger: 30,
	});
};

export default masonryGenerator;
