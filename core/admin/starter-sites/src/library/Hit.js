/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import MasonryItem from './MasonryItem';

const Hit = ({ hit, type }) => {
    const wrapClassName =
        hit.cost?.[0] === 'Pro'
            ? 'ais-InfiniteHits-item-pro'
            : 'ais-InfiniteHits-item-free';
    if (type === 'patterns')
        return (
            <MasonryItem
                type='patterns'
                target='patterns'
                key={`maxi-cloud-masonry__item-${hit.post_id}`}
                demoUrl={hit.demo_url}
                toneUrl={hit.link_to_related}
                previewIMG={hit.preview_image_url}
                cost={hit.cost?.[0]}
                isPro={hit.cost?.[0] === 'Pro'}
                taxonomies={hit.category?.[0]}
                serial={hit.post_title}
                title={hit.post_title}
                className={wrapClassName}
            />
        );
    if (type === 'svg')
        return (
            <MasonryItem
                type='svg'
                target={hit.svg_category[0]}
                key={`maxi-cloud-masonry__item-${hit.post_id}`}
                svgCode={hit.svg_code}
                isPro={hit.cost?.[0] === 'Pro'}
                serial={hit.post_title}
            />
        );
    if (type === 'sc')
        return (
            <MasonryItem
                type='sc'
                target='style-cards'
                key={`maxi-cloud-masonry__item-${hit.post_id}`}
                previewIMG={hit.post_thumbnail}
                isPro={hit.cost === 'Pro'}
                serial={hit.post_title}
            />
        );
};

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default Hit;
