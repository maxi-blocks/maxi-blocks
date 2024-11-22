/**
 * External dependencies
 */
import Masonry from 'masonry-layout';

const masonryGenerator = (type = 'patterns') => {
    if (type === 'preview' || type === 'switch-tone') return;

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
};

export default masonryGenerator;
