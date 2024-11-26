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
    if (type === 'starter-sites')
        return (
            <MasonryItem
                type='starter-sites'
                target='starter-sites'
                key={`maxi-cloud-masonry__item-${hit.id}`}
                demoUrl={hit.live_demo}
                previewIMG={hit.screenshot}
                cost={hit.cost?.[0]}
                isPro={hit.cost?.[0] === 'Pro'}
                taxonomies={hit.category?.[0]}
                serial={hit.name}
                title={hit.name}
                templates={hit.templates}
                pages={hit.pages}
                patterns={hit.patterns}
				sc={hit.sc}
				contentXML={hit.content_xml}
                className={wrapClassName}
            />
        );
};

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default Hit;
