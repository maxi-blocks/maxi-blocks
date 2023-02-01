/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import MasonryItem from './MasonryItem';
import {
	svgAttributesReplacer,
	svgCurrentColorStatus,
	fitSvg,
	onRequestInsertPattern,
} from './util';

const Hit = ({ hit }) => {
	const wrapClassName =
		hit.cost?.[0] === 'Pro'
			? 'ais-InfiniteHits-item-pro'
			: 'ais-InfiniteHits-item-free';

	/** Patterns / Blocks Results */
	const patternsResults = ({ hit }) => {
		const wrapClassName =
			hit.cost?.[0] === 'Pro'
				? 'ais-InfiniteHits-item-pro'
				: 'ais-InfiniteHits-item-free';
		return (
			<MasonryItem
				type='patterns'
				target='patterns'
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				title={hit.post_title}
				demoUrl={hit.demo_url}
				previewIMG={hit.preview_image_url}
				cost={hit.cost?.[0]}
				isPro={hit.cost?.[0] === 'Pro'}
				taxonomies={hit.category?.[0]}
				serial={hit.post_number}
				className={wrapClassName}
				onRequestInsert={() =>
					onRequestInsertPattern(
						hit.gutenberg_code,
						isChecked,
						isValidTemplate,
						onSelect,
						onRequestClose,
						replaceBlock,
						clientId
					)
				}
			/>
		);
	};
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
};

Hit.propTypes = {
	hit: PropTypes.object.isRequired,
};

export default Hit;
