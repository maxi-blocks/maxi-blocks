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

// Keep all the necessary functions and constants
const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;

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

const CustomMenuSelect = connectMenu(MenuSelect);
const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);
const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);
const CustomClearRefinementsHidden = connectCurrentRefinements(
	ClearRefinementsHidden
);

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
			'post_title, starter_sites_category, cost'
		).searchClient;
	} catch (error) {
		console.error('Typesense initialization error:', error);
		return null;
	}
})();

const starterSitesResults = ({ hit, onClickConnect, onLogOut, isOnboarding }) => {
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
			isOnboarding={isOnboarding}
			description={hit.description}
		/>
	);
};

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
	isOnboarding,
	onRequestClose,
	description,
}) => {

	const firstPage = pages?.[0];
	const firstTemplate = templates?.[0];
	const mainPreviewImage = firstPage?.screenshot || firstTemplate?.screenshot;
	const [showImport, setShowImport] = React.useState(false);

	// Add event listener for closing details popup
	React.useEffect(() => {
		const handleCloseDetailsPopup = () => {
			if (onRequestClose) onRequestClose();
		};

		document.addEventListener('close-details-popup', handleCloseDetailsPopup);

		return () => {
			document.removeEventListener('close-details-popup', handleCloseDetailsPopup);
		};
	}, [onRequestClose]);

	const handleImportClick = () => {
		setShowImport(true);
	};

	const handleImportClose = () => {
		setShowImport(false);
	};

	const handleGoProClick = () => {
		window.open('https://maxiblocks.com/go/pro-library', '_blank');
	};

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
					isOnboarding={isOnboarding}
				/>
			) : (
				<div className='maxi-cloud-container__details-popup_main-wrap'>
					<div className='maxi-cloud-container__details-popup_columns'>
						{/* Left column - Preview */}
						<div className='maxi-cloud-container__details-popup_column-left'>
							{mainPreviewImage && (
								<div className='maxi-cloud-container__details-popup_main-preview'>
									<img src={mainPreviewImage} alt={title} />
								</div>
							)}
						</div>

						{/* Right column - Content */}
						<div className='maxi-cloud-container__details-popup_column-right'>
							<h2>{title}</h2>
							<p className='maxi-cloud-container__details-popup_description'>
								{description}
							</p>

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

							{/* Pages section */}
							<div className='maxi-cloud-container__details-popup_section'>
								<h3 className='maxi-cloud-container__details-popup_section-title'>
									{__(
										'Pages in this starter site',
										'maxi-blocks'
									)}{' '}
									({pages?.length || 0})
								</h3>
								<div className='maxi-cloud-masonry'>
									{pages?.map(page => (
										<div
											key={page.name}
											className='maxi-cloud-container__details-popup_item'
										>
											<img
												src={page.screenshot}
												alt={page.name}
											/>
											<span>{page.name}</span>
										</div>
									))}
								</div>
							</div>

							{/* Templates section */}
							{templates?.length > 0 && (
								<div className='maxi-cloud-container__details-popup_section'>
									<h3 className='maxi-cloud-container__details-popup_section-title'>
										{__(
											'Templates in this starter site',
											'maxi-blocks'
										)}{' '}
										({templates.length})
									</h3>
									<div className='maxi-cloud-masonry'>
										{templates.map(template => (
											<div
												key={template.name}
												className='maxi-cloud-container__details-popup_item'
											>
												<img
													src={template.screenshot}
													alt={template.name}
												/>
												<span>{template.name}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Patterns section */}
							{patterns?.length > 0 && (
								<div className='maxi-cloud-container__details-popup_section'>
									<h3 className='maxi-cloud-container__details-popup_section-title'>
										{__(
											'Patterns in this starter site',
											'maxi-blocks'
										)}{' '}
										({patterns.length})
									</h3>
									<div className='maxi-cloud-masonry'>
										{patterns.map(pattern => (
											<div
												key={pattern.name}
												className='maxi-cloud-container__details-popup_item'
											>
												<img
													src={pattern.screenshot}
													alt={pattern.name}
												/>
												<span>{pattern.name}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

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
 * Component
 */
const LibraryContainer = props => {
	const {
		type,
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
		isOnboarding,
		description,
	} = props;

	useInterval(masonryGenerator, 100);

	return (
		<div className='maxi-cloud-container'>
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
						isOnboarding={isOnboarding}
						description={description}
					/>
				</div>
			)}

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
						isOnboarding={isOnboarding}
						onRequestClose={onRequestClose}
						description={description}
					/>
				</div>
			)}

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
								isOnboarding={isOnboarding}
							/>
						</div>
					</InstantSearch>
				</div>
			)}
		</div>
	);
};

export default LibraryContainer;
