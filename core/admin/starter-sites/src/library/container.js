/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import MasonryItem from './MasonryItem';
import masonryGenerator from './masonryGenerator';
import useInterval from './useInterval';
import InfiniteHits from './InfiniteHits';
import MaxiImportPopUp from './maxiImportPopUp';

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

// API configuration for Typesense search
const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;

/**
 * Results count component - displays number of search results
 */
const resultsCount = {
	stats(nbHits) {
		// Format the number of hits into a readable string
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

/**
 * Navigation/Header Area
 * Shows: Back button, "Acupuncture", "Free" navigation breadcrumbs, and close (X) button
 */
const MenuSelect = ({ items, currentRefinement, refine }) => {
	// Find Pro and Free elements from items array, or create defaults if not found
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

/**
 * HierarchicalMenu Component - Renders nested category menu
 * @param {Object} props
 * @param {Array} props.items - Menu items to display
 * @param {Function} props.refine - Function to update filters
 */
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

/**
 * ClearRefinements Component - Button to clear all filters
 * Also triggers a click on patterns button after clearing
 */
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

/**
 * Hidden clear refinements button
 */
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

// Connect components to InstantSearch functionality
const CustomMenuSelect = connectMenu(MenuSelect);
const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);
const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);
const CustomClearRefinementsHidden = connectCurrentRefinements(
	ClearRefinementsHidden
);

/**
 * Configure Typesense search adapter
 * @param {string} params - Search parameters
 */
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

// Initialize search client for starter sites
const searchClientStarterSites = (() => {
	try {
		return typesenseInstantsearchAdapter(
			'post_title, starter_sites_category, cost'
		).searchClient;
	} catch (error) {
		console.error('Typesense initialization error:', error);
		return null;
	}
})();

/**
 * Main Preview Area
 * Shows: Large preview image of the starter site
 */
const starterSitesResults = ({
	hit,
	onClickConnect,
	onLogOut,
	isQuickStart,
}) => {
	const wrapClassName =
		hit.cost?.[0] === 'Pro'
			? 'ais-InfiniteHits-item-pro'
			: 'ais-InfiniteHits-item-free';
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
			className={wrapClassName}
			onClickConnect={onClickConnect}
			onLogOut={onLogOut}
			isQuickStart={isQuickStart}
			description={hit.description}
		/>
	);
};

/**
 * Details Popup Component
 * Shows:
 * 1. Title "Acupuncture"
 * 2. Description text
 * 3. Action buttons (Live preview, Go Pro)
 * 4. Pages preview grid (showing Home Page, Blog Page, About Page, etc.)
 */
const MaxiDetailsPopUp = ({
	url,
	title,
	cost,
	templates,
	pages,
	patterns,
	sc,
	contentXML,
	isMaxiProActive,
	isPro,
	isQuickStart,
	onRequestClose,
	description,
}) => {
	// State for showing import dialog
	const [showImport, setShowImport] = React.useState(false);

	// Setup event listener for closing popup
	React.useEffect(() => {
		const handleCloseDetailsPopup = () => {
			if (onRequestClose) onRequestClose();
		};

		document.addEventListener(
			'close-details-popup',
			handleCloseDetailsPopup
		);

		return () => {
			document.removeEventListener(
				'close-details-popup',
				handleCloseDetailsPopup
			);
		};
	}, [onRequestClose]);

	// Handler functions
	const handleImportClick = () => setShowImport(true);
	const handleImportClose = () => setShowImport(false);
	const handleGoProClick = () => {
		window.open('https://maxiblocks.com/go/pro-library', '_blank');
	};

	const firstPage = pages?.[0];
	const firstTemplate = templates?.[0];
	const mainPreviewImage = firstPage?.screenshot || firstTemplate?.screenshot;

	return (
		<>
			{showImport ? (
				<MaxiImportPopUp
					url={url}
					title={title}
					cost={cost}
					templates={templates}
					pages={pages}
					patterns={patterns}
					sc={sc}
					contentXML={contentXML}
					onRequestClose={handleImportClose}
					isMaxiProActive={isMaxiProActive}
					isQuickStart={isQuickStart}
				/>
			) : (
				<div className='maxi-cloud-container__details-popup_main-wrap'>
					<div className='maxi-cloud-container__details-popup_columns'>
						{/* Left Column - Main Preview Image */}
						<div className='maxi-cloud-container__details-popup_column-left'>
							{mainPreviewImage && (
								<div className='maxi-cloud-container__details-popup_main-preview'>
									<img src={mainPreviewImage} alt={title} />
								</div>
							)}
						</div>

						{/* Right Column - Content */}
						<div className='maxi-cloud-container__details-popup_column-right'>
							{/* Title and Description */}
							<h2>{title}</h2>
							<p className='maxi-cloud-container__details-popup_description'>
								{description}
							</p>

							{/* Combined Pages, Templates, and Patterns Section */}
							<div className='maxi-cloud-container__details-popup_section'>
								{/* Pages Section */}
								<h3 className='maxi-cloud-container__details-popup_section-title'>
									{__(
										'Pages in this starter site',
										'maxi-blocks'
									)}{' '}
									({pages?.length || 0})
								</h3>
								<div className='items-grid'>
									{pages?.map(page => (
										<div
											key={page.name}
											className='maxi-cloud-container__details-popup_item'
										>
											<span>{page.name}</span>
										</div>
									))}
								</div>

								{/* Templates Section */}
								{templates?.length > 0 && (
									<>
										<h3 className='maxi-cloud-container__details-popup_section-title'>
											{__(
												'Templates in this starter site',
												'maxi-blocks'
											)}{' '}
											({templates.length})
										</h3>
										<div className='items-grid'>
											{templates.map(template => (
												<div
													key={template.name}
													className='maxi-cloud-container__details-popup_item'
												>
													<span>{template.name}</span>
												</div>
											))}
										</div>
									</>
								)}

								{/* Patterns Section */}
								{patterns?.length > 0 && (
									<>
										<h3 className='maxi-cloud-container__details-popup_section-title'>
											{__(
												'Patterns in this starter site',
												'maxi-blocks'
											)}{' '}
											({patterns.length})
										</h3>
										<div className='items-grid'>
											{patterns.map(pattern => (
												<div
													key={pattern.name}
													className='maxi-cloud-container__details-popup_item'
												>
													<span>{pattern.name}</span>
												</div>
											))}
										</div>
									</>
								)}
							</div>

							{/* Action Buttons - Moved here after patterns section */}
							<div className='maxi-cloud-container__details-popup_actions'>
								<a
									href={url}
									target='_blank'
									rel='noopener noreferrer'
									className='maxi-cloud-container__details-popup_button maxi-cloud-container__details-popup_button-preview'
								>
									{__('Live preview', 'maxi-blocks')}
								</a>
								{isPro && !isMaxiProActive ? (
									<button
										type='button'
										className='maxi-cloud-container__details-popup_button maxi-cloud-container__details-popup_button-preview maxi-cloud-container__details-popup_button-go-pro'
										onClick={handleGoProClick}
									>
										{__('Go Pro', 'maxi-blocks')}
									</button>
								) : (
									<button
										type='button'
										className='maxi-cloud-container__details-popup_button maxi-cloud-container__details-popup_button-import'
										onClick={handleImportClick}
									>
										{title ===
										window.maxiStarterSites
											?.currentStarterSite
											? __('Reset', 'maxi-blocks')
											: __('Import', 'maxi-blocks')}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

/**
 * Gets default menu cost from URL parameters
 * Used to set initial filter state
 */
const getDefaultMenuCost = () => {
	const urlParams = new URLSearchParams(window.location.search);
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

/**
 * Main Container Component
 * Handles the overall layout and view switching between:
 * - Preview mode (showing details popup)
 * - Import mode
 * - Starter sites listing
 */
const LibraryContainer = props => {
	const {
		type, // View type: 'preview', 'starter-sites', or import mode
		url,
		title,
		templates,
		pages,
		patterns,
		cost,
		sc,
		contentXML,
		isImport,
		onRequestClose,
		isMaxiProActive,
		isPro,
		onClickConnect,
		onLogOut,
		isQuickStart,
		description,
	} = props;

	// Periodically run masonry layout generator
	useInterval(masonryGenerator, 100);

	return (
		<div className='maxi-cloud-container'>
			{/* Import popup */}
			{isImport && (
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
						onRequestClose={onRequestClose}
						isMaxiProActive={isMaxiProActive}
						isQuickStart={isQuickStart}
						description={description}
					/>
				</div>
			)}

			{/* Preview/details popup */}
			{type === 'preview' && !isImport && (
				<div className='maxi-cloud-container__patterns maxi-cloud-container__details'>
					<MaxiDetailsPopUp
						url={url}
						title={title}
						cost={cost}
						templates={templates}
						pages={pages}
						patterns={patterns}
						sc={sc}
						contentXML={contentXML}
						isMaxiProActive={isMaxiProActive}
						isPro={isPro}
						isQuickStart={isQuickStart}
						onRequestClose={onRequestClose}
						description={description}
					/>
				</div>
			)}

			{/* Starter sites listing with search */}
			{type === 'starter-sites' && (
				<div className='maxi-cloud-container__patterns'>
					<InstantSearch
						indexName='starter_site'
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
								attributes={['starter_sites_category']}
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
								isMaxiProActive={isMaxiProActive}
								onClickConnect={onClickConnect}
								onLogOut={onLogOut}
								isQuickStart={isQuickStart}
							/>
						</div>
					</InstantSearch>
				</div>
			)}
		</div>
	);
};

export default LibraryContainer;
