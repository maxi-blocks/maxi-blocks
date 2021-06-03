/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { useState, useEffect, RawHTML } from '@wordpress/element';

import { parse } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import TopbarFilter from './topbarFilter';
import Masonry from './masonry';
import Button from '../../components/button';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import algoliasearch from 'algoliasearch/lite';
import {
	InstantSearch,
	SearchBox,
	Hits,
	Pagination,
	RefinementList,
} from 'react-instantsearch-dom';

/**
 * Component
 */
const LibraryContainer = props => {
	const { type, onRequestClose } = props;

	const searchClient = algoliasearch(
		'39ZZ3SLI6Z',
		'6ed8ae6d1c430c6a76e0720f74eab91c'
	);

	const { replaceBlocks, updateBlockAttributes } =
		useDispatch('core/block-editor');

	const MasonryItemSVG = props => {
		const { svgCode, isPro, serial, onRequestInsert, categories, tags } =
			props;

		return (
			<div className='maxi-cloud-masonry-card'>
				<div className='maxi-cloud-masonry-card__image'>
					<RawHTML>{svgCode}</RawHTML>
				</div>
				<div className='maxi-cloud-masonry-card__container'>
					<div className='maxi-cloud-masonry-card__buttons'>
						<Button
							className='maxi-cloud-masonry-card__button'
							onClick={onRequestInsert}
						>
							Insert
						</Button>
					</div>
					<div className='maxi-cloud-masonry-card__tags'>
						{isPro && (
							<span className='maxi-cloud-masonry__pro-tag'>
								PRO
							</span>
						)}
						<p className='maxi-cloud-masonry__serial-tag'>
							{serial}
						</p>
					</div>
				</div>
			</div>
		);
	};

	const onRequestInsertSVG = svgCode => {
		const clientId = select('core/block-editor').getSelectedBlockClientId();
		const { uniqueID } =
			select('core/editor').getBlock(clientId).attributes;

		const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];

		const newSvgClass = `.${uniqueID} .${svgClass}`;
		const replaceIt = `.${svgClass}`;

		const finalSvgCode = svgCode.replaceAll(replaceIt, newSvgClass);

		const isValid =
			select('core/block-editor').isValidTemplate(finalSvgCode);

		if (isValid) {
			updateBlockAttributes(clientId, { content: finalSvgCode });
			onRequestClose();
		}
	};

	const results = ({ hit }) => {
		return (
			<MasonryItemSVG
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={hit.svg_code}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertSVG(hit.svg_code)}
			/>
		);
	};

	return (
		<div className='maxi-cloud-container'>
			<div className='maxi-cloud-container__sidebar'>
				{type === 'svg' && (
					<InstantSearch
						indexName='maxi_posts_svg_icon'
						searchClient={searchClient}
					>
						<SearchBox />
						<RefinementList attribute='taxonomies.svg_tag' />
						<div className='maxi-cloud-container__content'>
							<Hits hitComponent={results} />
							<Pagination />
						</div>
					</InstantSearch>
				)}

				{/* {type === 'patterns' && (
				
				)} */}
			</div>
		</div>
	);
};

export default LibraryContainer;
