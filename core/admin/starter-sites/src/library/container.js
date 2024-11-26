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
import MaxiImportPopUp from './maxiImportPopUp';
import LibraryToolbar from './toolbar';

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
	console.log('LibraryContainer props', props);
	const { type, url, title, templates, pages, patterns, cost, sc, contentXML } = props;

	// Add state to control import popup visibility
	const [showImport, setShowImport] = React.useState(false);

	// Handler for Import button click
	const handleImportClick = () => {
		setShowImport(true);
	};

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
			},
			additionalSearchParameters: {
				query_by: params,
				sort_by: 'post_date_int:desc',
			},
		});
	};

	const searchClientStarterSites = (() => {
		try {
			return typesenseInstantsearchAdapter(
				'name, category.lvl0, category.lvl1, cost'
			).searchClient;
		} catch (error) {
			console.error('Typesense initialization error:', error);
			return null;
		}
	})();

	/** Starter Sites Results */
	const starterSitesResults = ({ hit }) => {
		console.log('hit', hit);
		const wrapClassName =
			hit.cost?.[0] === 'Pro'
				? 'ais-InfiniteHits-item-pro'
				: 'ais-InfiniteHits-item-free';
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

	const maxiDetailsPopUp = (url, title, cost, templates, pages, patterns) => {
		return (
			<>
				<div className='maxi-cloud-container__details-popup_main-wrap'>
					<div className='maxi-cloud-container__details-popup_wrap'>
						<div>
							{templates.map(template => (
								<div
									key={template.name}
									className='maxi-cloud-container__details-popup_item'
								>
									<h3 key={template.name}>{template.name}</h3>
									<img
										src={template.screenshot}
										alt={template.name}
									/>
								</div>
							))}
							{pages.map(page => (
								<div
									key={page.name}
									className='maxi-cloud-container__details-popup_item'
								>
									<h3 key={page.name}>{page.name}</h3>
									<img
										src={page.screenshot}
										alt={page.name}
									/>
								</div>
							))}
							{patterns.map(pattern => (
								<div
									key={pattern.name}
									className='maxi-cloud-container__details-popup_item'
								>
									<h3 key={pattern.name}>{pattern.name}</h3>
									<img
										src={pattern.screenshot}
										alt={pattern.name}
									/>
								</div>
							))}
						</div>
					</div>
					<div className='maxi-cloud-container__details-popup_space'></div>
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

	return (
		<div className='maxi-cloud-container'>
			{type === 'preview' && (
				<LibraryToolbar
					{...props}
					onImportClick={handleImportClick}
					isImport={showImport}
				/>
			)}

			{showImport && (
				<div className='maxi-cloud-container__import'>
					<MaxiImportPopUp
						url={url}
						title={title}
						cost={cost}
						templates={templates}
						pages={pages}
						patterns={patterns}
						sc={sc}
						contentXML={contentXML}
						onRequestClose={() => setShowImport(false)}
					/>
				</div>
			)}

			{type === 'preview' && !showImport && (
				<div className='maxi-cloud-container__patterns'>
					{maxiDetailsPopUp(
						url,
						title,
						cost,
						templates,
						pages,
						patterns
					)}
				</div>
			)}

			{type === 'starter-sites' && (
				<div className='maxi-cloud-container__patterns'>
					<InstantSearch
						indexName='starter_sites'
						searchClient={searchClientStarterSites}
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
							<CustomClearRefinementsHidden />
						</div>
						<div className='maxi-cloud-container__patterns__content-patterns'>
							<Stats translations={resultsCount} />
							<InfiniteHits
								hitComponent={starterSitesResults}
								type='starter-sites'
							/>
						</div>
					</InstantSearch>
				</div>
			)}
		</div>
	);
};

export default LibraryContainer;
