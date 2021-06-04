/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { useState, useEffect, RawHTML } from '@wordpress/element';

import { parse } from '@wordpress/blocks';

/**
 * Internal dependencies searchState={{
    query: 'iphone',
    refinementList: {
      brand: ['Apple'],
    },
  }}
 */
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
	InfiniteHits,
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

	/** Patterns / Blocks */
	const MasonryItem = props => {
		const { previewIMG, isPro, serial, onRequestInsert } = props;

		return (
			<div className='maxi-cloud-masonry-card'>
				<div className='maxi-cloud-masonry-card__image'>
					<img src={previewIMG} alt={`Preview for ${serial}`} />
				</div>
				<div className='maxi-cloud-masonry-card__container'>
					<div className='maxi-cloud-masonry-card__buttons'>
						<Button className='maxi-cloud-masonry-card__button'>
							Preview
						</Button>
						<Button className='maxi-cloud-masonry-card__button'>
							Update
						</Button>
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

	const onRequestInsert = parsedContent => {
		const clientId = select('core/block-editor').getSelectedBlockClientId();

		const isValid =
			select('core/block-editor').isValidTemplate(parsedContent);

		if (isValid) {
			replaceBlocks(clientId, parsedContent);
			onRequestClose();
		}
	};

	/** SVGs */
	const MasonryItemSVG = props => {
		const { svgCode, isPro, serial, onRequestInsert } = props;

		return (
			<div className='maxi-cloud-masonry-card'>
				<div className='maxi-cloud-masonry-card__image'>
					<RawHTML>{svgCode}</RawHTML>
				</div>
				<div className='maxi-cloud-masonry-card__container'>
					<p className='maxi-cloud-masonry__serial-tag'>{serial}</p>
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

	const svgResults = ({ hit }) => {
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
			{type === 'svg' && (
				<InstantSearch
					indexName='maxi_posts_svg_icon'
					searchClient={searchClient}
				>
					<div className='maxi-cloud-container__content-svg'>
						<SearchBox
							submit={__('Find', 'maxi-blocks')}
							autoFocus
							searchAsYouType
							showLoadingIndicator
						/>
						<RefinementList
							className='hidden'
							attribute='taxonomies.attachmentcategory'
							defaultRefinement={['Filled']}
							showLoadingIndicator
						/>
						<InfiniteHits hitComponent={svgResults} />
					</div>
				</InstantSearch>
			)}

			{/* {type === 'patterns' && (
				
				)} */}
		</div>
	);
};

export default LibraryContainer;
