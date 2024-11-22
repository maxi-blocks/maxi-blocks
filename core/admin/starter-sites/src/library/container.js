/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MasonryItem from './MasonryItem';
import masonryGenerator from './masonryGenerator';
import useInterval from './useInterval';
import InfiniteHits from './InfiniteHits';

/**
 * External dependencies
 */
import React from 'react';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter/src/TypesenseInstantsearchAdapter.js';
import {
	InstantSearch,
	SearchBox,
	connectMenu,
	connectHierarchicalMenu,
	connectCurrentRefinements,
	Stats,
	Configure,
} from 'react-instantsearch-dom';
import classnames from 'classnames';
import { isEmpty, unescape } from 'lodash';
import { arrowIcon } from '../icons';

const resultsCount = {
	stats(nbHits) {
		const resultsString = nbHits.toLocaleString();
		return (
			<span>
				<span>{__('Returned', 'maxi-blocks')}</span>
				<strong>{` ${resultsString} `}</strong>
				<span>
					{nbHits === 1
						? __('result', 'maxi-blocks')
						: __('results', 'maxi-blocks')}
				</span>
			</span>
		);
	},
};

const MenuSelect = ({ items, currentRefinement, refine }) => {
	const proElement = items.find(element => element.label === 'Pro') || {
		label: 'Pro',
		value: 'Pro',
		count: 0,
		isRefined: false,
	};
	const freeElement = items.find(element => element.label === 'Free') || {
		label: 'Free',
		value: 'Free',
		count: 0,
		isRefined: false,
	};

	return (
		<div className='top-Menu'>
			<button
				type='button'
				key='Pro'
				className={classnames(
					'maxi-cloud-container__content-svg-shape__button',
					proElement?.isRefined &&
						' maxi-cloud-container__content-svg-shape__button___pressed'
					// proClass
				)}
				value='Pro'
				onClick={event => {
					event.preventDefault();
					refine('Pro');
					proElement.isRefined = true;
				}}
			>
				Pro
			</button>
			<button
				type='button'
				key='Free'
				className={classnames(
					'maxi-cloud-container__content-svg-shape__button',
					freeElement?.isRefined &&
						' maxi-cloud-container__content-svg-shape__button___pressed'
					// freeClass
				)}
				value='Free'
				onClick={event => {
					event.preventDefault();
					refine('Free');
					freeElement.isRefined = true;
				}}
			>
				Free
			</button>
			<button
				type='button'
				value=''
				className={classnames(
					'maxi-cloud-container__content-svg-shape__button',
					isEmpty(currentRefinement) &&
						' maxi-cloud-container__content-svg-shape__button___pressed'
				)}
				onClick={event => {
					event.preventDefault();
					refine('');
				}}
			>
				{__('All', 'maxi-blocks')}
			</button>
		</div>
	);
};

const HierarchicalMenu = ({ items, refine }) =>
	!isEmpty(items) && (
		<ul>
			{items.map(item => (
				<li
					key={item.label}
					className={
						item.isRefined
							? 'ais-HierarchicalMenu-item ais-HierarchicalMenu-item--selected'
							: 'ais-HierarchicalMenu-item'
					}
				>
					{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
					<a
						href='#'
						onClick={event => {
							event.preventDefault();
							refine(item.value);
						}}
					>
						<span>
							<span
								className='ais-HierarchicalMenu-item-arrow'
								visible={
									!isEmpty(item.items) ? 'visible' : 'hide'
								}
							>
								{arrowIcon}
							</span>
							{unescape(item.label)}
						</span>
						<span>{item.count}</span>
					</a>
					<div className='sub_menu-wrapper'>
						{item.items && (
							<HierarchicalMenu
								items={item.items}
								refine={refine}
							/>
						)}
					</div>
				</li>
			))}
		</ul>
	);

const ClearRefinements = ({ items, refine }) => (
	<div className='ais-ClearRefinements'>
		<button
			type='button'
			className='ais-ClearRefinements-button'
			onClick={() => {
				refine(items);
				setTimeout(() => {
					const patternsButton = document.querySelector(
						'.maxi-cloud-container__patterns__top-menu .ais-Menu-list > .ais-Menu-item:first-child a'
					);
					patternsButton?.click();
				}, '10');
			}}
		>
			{__('Clear filters', 'maxi-blocks')}
		</button>
	</div>
);

const ClearRefinementsHidden = ({ items, refine }) => (
	<div className='ais-ClearRefinements maxi-hidden maxi-clear-for-type'>
		<button
			className='ais-ClearRefinements-button'
			onClick={() => {
				refine(items);
			}}
		>
			{__('Clear Hidden', 'maxi-blocks')}
		</button>
	</div>
);

/**
 * Component
 */
const LibraryContainer = props => {
	const { type, url, title } = props;

	const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
	const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;

	const typesenseInstantsearchAdapter = params => {
		return new TypesenseInstantSearchAdapter({
			server: {
				apiKey,
				nodes: [
					{
						host: apiHost,
						port: '443',
						protocol: 'https',
					},
				],
				cacheSearchResultsForSeconds: 2 * 60, // Cache search results for 2 minutes
			},
			additionalSearchParameters: {
				query_by: params,
				sort_by: 'post_date_int:desc',
			},
		});
	};

	// Add error handling
	const searchClientPatterns = (() => {
		try {
			return typesenseInstantsearchAdapter(
				'post_title, post_number, category.lvl0, category.lvl1, cost'
			).searchClient;
		} catch (error) {
			console.error('Typesense initialization error:', error);
			return null;
		}
	})();

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

	const CustomMenuSelect = connectMenu(MenuSelect);
	const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);

	const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);
	const CustomClearRefinementsHidden = connectCurrentRefinements(
		ClearRefinementsHidden
	);

	useInterval(masonryGenerator, 100);

	const maxiPreviewIframe = (url, title) => {
		return (
			<>
				<div
					className='maxi-cloud-container__preview-tablet__label'
					style={{ display: 'none' }}
				>
					{__(
						'Tablet / iPad simulator | Viewport 768px x 1024px',
						'maxi-blocks'
					)}
				</div>
				<div
					className='maxi-cloud-container__preview-mobile__label'
					style={{ display: 'none' }}
				>
					{__(
						'Mobile / iPhone simulator | Viewport 390px x 844px',
						'maxi-blocks'
					)}
				</div>
				<div className='maxi-cloud-container__preview-iframe_main-wrap'>
					<div className='maxi-cloud-container__preview-iframe_wrap'>
						<div>
							<iframe
								className='maxi-cloud-container__preview-iframe'
								src={url}
								title={title}
								width='100%'
								height='100%'
							/>
						</div>
					</div>
					<div className='maxi-cloud-container__preview-iframe_space'></div>
				</div>
			</>
		);
	};

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const getDefaultMenuCost = () => {
		const cost = urlParams?.get('plan');
		switch (cost) {
			case 'pro':
				return 'Pro';
			case 'free':
				return 'Free';
			default:
				return '';
		}
	};

	const processTypeMenuClick = () => {
		const onClickTypeButton = button => {
			button.addEventListener(
				'click',
				function (e) {
					e.preventDefault();
					const clearButton = document.querySelector(
						'.maxi-clear-for-type .ais-ClearRefinements-button'
					);
					clearButton?.click();
				},
				false
			);
		};
		const typeButtons = document.querySelectorAll(
			'.maxi-cloud-container__patterns__top-menu .ais-Menu-list .ais-Menu-item a'
		);

		for (let i = 0; i < typeButtons?.length; i++) {
			onClickTypeButton(typeButtons[i]);
		}
	};

	return (
		<div className='maxi-cloud-container'>
			{(type === 'preview' || type === 'switch-tone') && (
				<div className='maxi-cloud-container__patterns'>
					{maxiPreviewIframe(url, title)}
				</div>
			)}

			{type === 'patterns' && (
				<div className='maxi-cloud-container__patterns'>
					<InstantSearch
						indexName='post'
						searchClient={searchClientPatterns}
					>
						<Configure hitsPerPage={20} />
						<div className='maxi-cloud-container__patterns__sidebar'>
							<CustomMenuSelect
								className='maxi-cloud-container__content-patterns__cost'
								attribute='cost'
								defaultRefinement={getDefaultMenuCost()}
							/>
							<SearchBox
								autoFocus
								searchAsYouType
								reset='X'
								translations={{
									resetTitle: 'Clear',
								}}
							/>
							<CustomHierarchicalMenu
								attributes={['category.lvl0', 'category.lvl1']}
								limit={20}
							/>
							<CustomClearRefinements />
							<CustomClearRefinementsHidden
								transformItems={items =>
									items.filter(
										item =>
											item.attribute !== 'gutenberg_type'
									)
								}
							/>
						</div>
						<div className='maxi-cloud-container__patterns__content-patterns'>
							<Stats translations={resultsCount} />
							<InfiniteHits
								hitComponent={patternsResults}
								type='patterns'
							/>
						</div>
					</InstantSearch>
				</div>
			)}
		</div>
	);
};

export default LibraryContainer;
