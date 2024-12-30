/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import MasonryItem from './MasonryItem';

const Hit = ({ hit, type, isMaxiProActive, onClickConnect, onLogOut, isOnboarding }) => {
    const wrapClassName =
        hit.cost?.[0] === 'Pro'
            ? 'ais-InfiniteHits-item-pro'
            : 'ais-InfiniteHits-item-free';
    if (type === 'starter-sites')
        return (
            <MasonryItem
                type='starter-sites'
                target='starter-sites'
                key={`maxi-cloud-masonry__item-${hit.post_id}`}
                demoUrl={hit.live_demo_url}
                previewIMG={hit.screenshot_url}
                cost={hit.cost?.[0]}
                isPro={hit.cost?.[0] === 'Pro'}
                taxonomies={hit.starter_sites_category}
                serial={hit.post_id}
                title={hit.post_title}
                templates={hit.templates}
                pages={hit.pages}
                patterns={hit.patterns}
				sc={hit.sc_url}
				contentXML={hit.content_xml_url}
                className={wrapClassName}
				isMaxiProActive={isMaxiProActive}
				onClickConnect={onClickConnect}
				onLogOut={onLogOut}
				isOnboarding={isOnboarding}
            />
        );
};

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default Hit;
