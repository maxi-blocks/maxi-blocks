/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, select, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { CheckboxControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { ToggleSwitch } from '../../components';
import { updateSCOnEditor } from '../../extensions/style-cards';
import {
	svgAttributesReplacer,
	svgCurrentColorStatus,
	fitSvg,
	onRequestInsertPattern,
} from './util';
import { injectImgSVG } from '../../extensions/svg';
// eslint-disable-next-line import/no-cycle
import DOMPurify from 'dompurify';
// import Icon from '../../components/icon';
/**
 * Internal dependencies
 */
import MasonryItem from './MasonryItem';
import masonryGenerator from './masonryGenerator';
import InfiniteHits from './InfiniteHits';

/**
 * External dependencies
 */
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import {
	InstantSearch,
	SearchBox,
	// InfiniteHits,
	connectRefinementList,
	connectMenu,
	connectHierarchicalMenu,
	connectCurrentRefinements,
	Menu,
	Stats,
	Configure,
} from 'react-instantsearch-dom';
import classnames from 'classnames';
import { isEmpty, uniqueId, orderBy, capitalize, unescape } from 'lodash';
import Masonry from 'masonry-layout';
import useInterval from '../../extensions/dom/useInterval';

/**
 * Icons
 */
import { arrowIcon } from '../../icons';

// const MasonryItem = props => {
// 	const {
// 		type,
// 		target,
// 		svgCode,
// 		isPro,
// 		serial,
// 		onRequestInsert,
// 		previewIMG,
// 		demoUrl,
// 		title,
// 		cost,
// 		toneUrl,
// 		currentItemColorStatus = false,
// 		className,
// 	} = props;

// 	const masonryCardClasses = classnames(
// 		'maxi-cloud-masonry-card',
// 		`maxi-cloud-masonry-card__${target}`,
// 		type === 'patterns' && `maxi-cloud-masonry-card__pattern-${serial}`,
// 		type === 'svg' &&
// 			currentItemColorStatus &&
// 			'maxi-cloud-masonry-card__light',
// 		className
// 	);

// 	const masonryCardId = `maxi-cloud-masonry-card__pattern-${serial}`;

// 	const patternsScContent = () => {
// 		return (
// 			<>
// 				<div className='maxi-cloud-masonry-card__container'>
// 					<div className='maxi-cloud-masonry-card__container__top-bar'>
// 						<div className='maxi-cloud-masonry__serial-tag'>
// 							{type === 'patterns' && title}
// 							{type === 'sc' && serial}
// 						</div>
// 					</div>
// 				</div>
// 				<div className='maxi-cloud-masonry-card__image'>
// 					<img src={previewIMG} alt={`Preview for ${serial}`} />
// 				</div>
// 				<div className='maxi-cloud-masonry-card__buttons'>
// 					{type === 'patterns' && (
// 						<>
// 							<MaxiModal
// 								type='preview'
// 								url={demoUrl}
// 								title={serial}
// 								onRequestInsert={onRequestInsert}
// 								cardId={masonryCardId}
// 								cost={cost}
// 								toneUrl={toneUrl}
// 							/>
// 							<Button
// 								className='maxi-cloud-masonry-card__button maxi-cloud-masonry-card__button-load'
// 								onClick={onRequestInsert}
// 							>
// 								{__('Insert', 'maxi-blocks')}
// 							</Button>
// 							<div className='maxi-cloud-masonry-card__tags'>
// 								{!isPro && (
// 									<span className='maxi-cloud-masonry-card__tags__tag maxi-cloud-masonry-card__tags__tag-free'>
// 										{__('Free', 'maxi-blocks')}
// 									</span>
// 								)}
// 								{isPro && (
// 									<span className='maxi-cloud-masonry-card__tags__tag maxi-cloud-masonry-card__tags__tag-pro'>
// 										{__('Pro', 'maxi-blocks')}
// 									</span>
// 								)}
// 							</div>
// 						</>
// 					)}
// 					{type === 'sc' && (
// 						<span className='maxi-cloud-masonry-card__button maxi-cloud-masonry-card__button-load'>
// 							{__('Insert', 'maxi-block')}
// 						</span>
// 					)}
// 				</div>
// 			</>
// 		);
// 	};

// 	return (
// 		<div className={masonryCardClasses} id={masonryCardId}>
// 			{type === 'sc' && (
// 				<Button onClick={onRequestInsert}>{patternsScContent()}</Button>
// 			)}
// 			{type === 'patterns' && patternsScContent()}
// 			{type === 'svg' && (
// 				<div
// 					className='maxi-cloud-masonry-card__svg-container'
// 					onClick={onRequestInsert}
// 				>
// 					<RawHTML
// 						style={{
// 							backgroundColor: currentItemColorStatus
// 								? '#000000'
// 								: '#ffffff',
// 						}}
// 						className='maxi-cloud-masonry-card__svg-container__code'
// 					>
// 						{svgCode}
// 					</RawHTML>
// 					<div className='maxi-cloud-masonry-card__svg-container__title'>
// 						{target === 'button-icon' ||
// 						target === 'search-icon' ||
// 						target.includes('Line') ||
// 						target.includes('video-icon')
// 							? serial.replace(' Line', '').replace(' line', '')
// 							: [
// 									'image-shape',
// 									'bg-shape',
// 									'sidebar-block-shape',
// 							  ].includes(target) || target.includes('Shape')
// 							? serial.replace(' shape', '')
// 							: serial}
// 					</div>
// 					<span>{__('Insert', 'maxi-block')}</span>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

const Accordion = ({ children, title, openByDefault = false }) => {
	const [isAccordionOpen, setAccordionOpen] = useState(openByDefault);

	const accordionClasses = classnames(
		'maxi-cloud-container__accordion',
		isAccordionOpen && 'maxi-cloud-container__accordion__open'
	);

	return (
		<div className={accordionClasses}>
			<div
				onClick={() => setAccordionOpen(!isAccordionOpen)}
				className='maxi-cloud-container__accordion__title'
			>
				{title}
			</div>
			<div className='maxi-cloud-container__accordion__content'>
				{children}
			</div>
		</div>
	);
};

// hack to fix issue #3930: top level tags resetting when we choose a second-level tag
const removeMenuBugFix = () => {
	const lists = document.querySelectorAll('.maxi__hide-top-tags');

	for (const list of lists) {
		list.classList.remove('maxi__hide-top-tags');
		const listElements = list.childNodes;
		for (const element of listElements) {
			element.classList.remove('maxi__show-top-tag');
		}
	}
};

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

const RefinementList = ({ items, refine }) => (
	<ul className='maxi-cloud-container__content__svg-categories'>
		{items.map(item => (
			<li key={item.label} className='ais-RefinementList-item'>
				<a
					href='#'
					onClick={event => {
						event.preventDefault();
						refine(item.value);
					}}
				>
					{capitalize(item.label)} ({item.count})
				</a>
				<ToggleSwitch
					selected={item.isRefined}
					onChange={val => refine(item.value)}
				/>
			</li>
		))}
	</ul>
);

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
		</div>
	);
};

const HierarchicalMenu = ({ items, refine, type = 'firstLevel' }) => {
	// hack to fix issue #3930: top level tags resetting when we choose a second-level tag
	const fixMenuBug = el => {
		const topLevelParent =
			el.target === 'a'
				? el?.currentTarget?.parentNode?.parentNode?.parentNode
						?.parentNode
				: el?.parentNode?.parentNode?.parentNode;

		if (
			isEmpty(topLevelParent) ||
			topLevelParent.classList.contains('maxi__hide-top-tags')
		)
			return;

		const topLevelElements = topLevelParent?.childNodes;

		if (!isEmpty(topLevelElements)) {
			topLevelParent.classList.add('maxi__hide-top-tags');
			topLevelElements.forEach(element =>
				element.classList.add('maxi__show-top-tag')
			);
		}
	};
	return (
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
						<a
							href='#'
							onClick={event => {
								type === 'secondLevel' && fixMenuBug(event);
								event.preventDefault();
								refine(item.value);
							}}
						>
							<span>
								<span
									className='ais-HierarchicalMenu-item-arrow'
									visible={
										!isEmpty(item.items)
											? 'visible'
											: 'hide'
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
									type='secondLevel'
								/>
							)}
						</div>
					</li>
				))}
			</ul>
		)
	);
};

const ClearRefinements = ({ items, refine }) => {
	return (
		<button
			type='button'
			className={`ais-ClearRefinements-button ais-ClearRefinements-button${
				!items.length ? '--disabled' : ''
			}`}
			onClick={e => {
				e.preventDefault();
				// refine(items);
				removeMenuBugFix();
				const allButton = document.querySelector(
					'.top-Menu > button:first-child'
				);
				allButton?.click();

				const patternsButton = document.querySelector(
					'.maxi-cloud-container__patterns__top-menu .ais-Menu-list > .ais-Menu-item:nth-child(2):not(.ais-Menu-item--selected) a'
				);
				patternsButton?.click();

				const lightButton = document.querySelector(
					'.maxi-cloud-container__patterns__sidebar > .ais-Menu .ais-Menu-list > .ais-Menu-item:first-child:not(.ais-Menu-item--selected) a'
				);
				lightButton?.click();

				setTimeout(() => {
					const listItem = document.querySelector(
						'.maxi-cloud-container__patterns__sidebar > ul .ais-HierarchicalMenu-item--selected > a'
					);
					listItem?.click();
				}, '100');
			}}
			disabled={!items.length}
		>
			{__('Clear filters', 'maxi-blocks')}
		</button>
	);
};

/**
 * Component
 */
const LibraryContainer = props => {
	const { type, onRequestClose, blockStyle, onSelect, url, title, prefix } =
		props;

	const {
		styleCards,
		selectedSCKey,
		selectedSCValue,
		clientId,
		isValidTemplate,
	} = useSelect(select => {
		const { isValidTemplate, getSelectedBlockClientId } =
			select('core/block-editor');
		const clientId = getSelectedBlockClientId();

		const { receiveMaxiStyleCards, receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);
		const styleCards = receiveMaxiStyleCards();
		const { key: selectedSCKey, value: selectedSCValue } =
			receiveMaxiSelectedStyleCard();

		return {
			styleCards,
			selectedSCKey,
			selectedSCValue,
			clientId,
			isValidTemplate,
		};
	});

	const { replaceBlock } = useDispatch('core/block-editor');
	const { saveMaxiStyleCards, setSelectedStyleCard } = useDispatch(
		'maxiBlocks/style-cards'
	);

	useEffect(() => {
		if (selectedSCValue) updateSCOnEditor(selectedSCValue);
	}, [selectedSCKey]);

	const typesenseInstantsearchAdapter = params => {
		return new TypesenseInstantSearchAdapter({
			server: {
				apiKey: '0DpJlIVm3kKOiQ9kAPTklrXrIbFLgWk6', // Be sure to use an API key that only allows search operations
				nodes: [
					{
						host: '24q17endjv0kacilp-1.a1.typesense.net',
						port: '443',
						protocol: 'https',
					},
				],
			},
			// The following parameters are directly passed to Typesense's search API endpoint.
			//  So you can pass any parameters supported by the search endpoint below.
			//  query_by is required.
			additionalSearchParameters: {
				query_by: params,
				sort_by: 'post_date_int:desc',
			},
		});
	};
	const searchClientPatterns = typesenseInstantsearchAdapter(
		'post_title, post_number, category.lvl0, category.lvl1'
	).searchClient;

	const searchClientSc = typesenseInstantsearchAdapter(
		'post_title, sc_color'
	).searchClient;

	const searchClientSvg = typesenseInstantsearchAdapter(
		'post_title, svg_tag.lvl0, svg_tag.lvl1, svg_tag.lvl2, svg_category'
	).searchClient;

	const [isChecked, setChecked] = useState(false);

	const getShapeType = type => {
		switch (type) {
			case 'button-icon':
			case 'accordion-icon':
			case 'accordion-icon-active':
			case 'search-icon':
			case 'video-icon-play':
			case 'video-icon-close':
				return 'icon';
			case 'sidebar-block-shape':
			case 'bg-shape':
				return 'shape';
			default:
				return type;
		}
	};

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

	/** SVG Icons */
	const onRequestInsertSVG = (svgCode, svgType) => {
		const style = svgCode.substr(
			svgCode.indexOf('<style>') + 7,
			svgCode.indexOf('</style>') - svgCode.indexOf('<style>') - 7
		);
		const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];

		const hoverStyle = style
			.replaceAll(svgClass, `${svgClass}:hover`)
			.replaceAll('icon-stroke', 'icon-stroke-hover')
			.replaceAll('icon-fill', 'icon-fill-hover');

		const withHoverStyle = svgCode.replace(style, style + hoverStyle);
		const newSvgClass = `${svgClass}__${uniqueId()}`;
		const replaceIt = `${svgClass}`;

		const finalSvgCode = svgAttributesReplacer(withHoverStyle).replaceAll(
			replaceIt,
			newSvgClass
		);

		if (isValidTemplate(finalSvgCode)) {
			onSelect({ content: finalSvgCode });
			onSelect({ svgType });
			onRequestClose();
		}
	};

	/** SVG Icons Results */
	const svgResults = ({ hit }) => {
		const newContent = svgAttributesReplacer(hit.svg_code);
		const svgType = hit.svg_category[0];
		const shapeType = getShapeType(type);

		return (
			<MasonryItem
				type='svg'
				target={svgType}
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={newContent}
				isPro={hit.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertSVG(newContent, svgType)}
				currentItemColorStatus={svgCurrentColorStatus(
					blockStyle,
					shapeType
				)}
			/>
		);
	};

	/** Shapes */
	const onRequestInsertShape = (svgCode, svgType) => {
		const {
			uniqueID,
			mediaID,
			mediaURL,
			'background-svg-SVGData': svgData,
		} = select('core/block-editor').getBlockAttributes(clientId);

		if (isValidTemplate(svgCode)) {
			if (type === 'sidebar-block-shape') {
				const SVGData = {
					[`${uniqueID}__${uniqueId()}`]: {
						color: '',
						imageID: mediaID,
						imageURL: mediaURL,
					},
				};

				onSelect({
					shapeSVGElement: svgCode,
					shapeSVGData: SVGData,
				});

				onRequestClose();
			}

			if (type === 'bg-shape') {
				const cleanedContent = DOMPurify.sanitize(fitSvg(svgCode));
				const svg = document
					.createRange()
					.createContextualFragment(cleanedContent).firstElementChild;

				const resData = {
					[`${uniqueID}__${uniqueId()}`]: {},
				};

				resData[Object.keys(resData)[0]].color = svgData
					? svgData[Object.keys(svgData)[0]].color
					: '';
				resData[Object.keys(resData)[0]].imageID = svgData
					? svgData[Object.keys(svgData)[0]].imageID
					: '';
				resData[Object.keys(resData)[0]].imageURL = svgData
					? svgData[Object.keys(svgData)[0]].imageURL
					: '';

				const resEl = injectImgSVG(svg, resData);

				onSelect({
					'background-svg-SVGElement': resEl.outerHTML,
					'background-svg-SVGData': resData,
				});

				onRequestClose();
			}

			if (type === 'image-shape') {
				const SVGData = {
					[`${uniqueID}__${uniqueId()}`]: {
						color: '',
						imageID: mediaID,
						imageURL: mediaURL,
					},
				};

				const newSvgCode = svgCode
					.replace(/width="(.*?)"/g, '')
					.replace(/height="(.*?)"/g, '');
				const cleanedContent = DOMPurify.sanitize(newSvgCode);

				const svg = document
					.createRange()
					.createContextualFragment(cleanedContent).firstElementChild;

				onSelect({
					SVGElement: injectImgSVG(svg, SVGData).outerHTML,
					SVGData,
				});

				onRequestClose();
			}

			if (
				[
					'button-icon',
					'video-icon-play',
					'video-icon-close',
					'accordion-icon',
					'search-icon',
				].includes(type)
			) {
				onSelect({
					[`${prefix}icon-content`]: svgCode,
					[`${prefix}svgType`]: svgType,
				});

				onRequestClose();
			}

			if (type === 'accordion-icon-active') {
				onSelect({
					'active-icon-content': svgCode,
					svgTypeActive: svgType,
				});

				onRequestClose();
			}
		}
	};

	/** Shapes Results */
	const svgShapeResults = ({ hit }) => {
		const shapeType = getShapeType(type);
		const svgType = hit.svg_category[0];

		const newContent = svgAttributesReplacer(hit.svg_code, shapeType);

		return (
			<MasonryItem
				type='svg'
				target={type}
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={newContent}
				isPro={hit.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() =>
					onRequestInsertShape(newContent, svgType)
				}
				currentItemColorStatus={
					type === 'image-shape' || type === 'bg-shape'
						? false
						: svgCurrentColorStatus(blockStyle, shapeType)
				}
			/>
		);
	};

	/** Style Cards */
	const onRequestInsertSC = card => {
		const parsedCard = JSON.parse(card);

		const newId = `sc_${new Date().getTime()}`;

		const newAllSCs = {
			...styleCards,
			[newId]: parsedCard,
		};

		saveMaxiStyleCards(newAllSCs);
		updateSCOnEditor(parsedCard);
		setSelectedStyleCard(newId);

		onRequestClose();
	};

	/** Style Cards Results */
	const scResults = ({ hit }) => {
		return (
			<MasonryItem
				type='sc'
				target='style-cards'
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				previewIMG={hit.post_thumbnail}
				isPro={hit.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertSC(hit.sc_code)}
			/>
		);
	};

	// eslint-disable-next-line react/no-unstable-nested-components
	const PlaceholderCheckboxControl = () => {
		return (
			<CheckboxControl
				className='use-placeholder-all-images'
				label={__(
					'Swap stock images for placeholders to save disk space',
					'maxi-blocks'
				)}
				checked={isChecked}
				onChange={setChecked}
			/>
		);
	};

	const CustomRefinementList = connectRefinementList(RefinementList);
	const CustomMenuSelect = connectMenu(MenuSelect);
	const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);
	const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);

	const masonryGenerator = () => {
		const elem = document.querySelector(
			'.maxi-cloud-container__patterns__content-patterns .ais-InfiniteHits-list'
		);

		if (elem) {
			// eslint-disable-next-line no-new
			new Masonry(elem, {
				itemSelector: '.ais-InfiniteHits-item',
				gutter: 16,
			});
		}
	};

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
					<div className='maxi-cloud-container__preview-iframe_space' />
				</div>
			</>
		);
	};

	return (
		<div className='maxi-cloud-container'>
			{type === 'svg' && (
				<div className='maxi-cloud-container__svg-icon'>
					<InstantSearch
						indexName='svg_icon'
						searchClient={searchClientSvg}
					>
						<Configure hitsPerPage={49} />
						<div className='maxi-cloud-container__svg-icon__sidebar'>
							<SearchBox
								submit={__('Find', 'maxi-blocks')}
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<CustomHierarchicalMenu
								attributes={['svg_tag.lvl0', 'svg_tag.lvl1']}
								limit={100}
							/>
							<CustomClearRefinements />
						</div>
						<div className='maxi-cloud-container__content-svg-shape'>
							<div className='maxi-cloud-container__content-svg-shape__search-bar'>
								<CustomMenuSelect
									className='maxi-cloud-container__content-svg-shape__categories'
									attribute='svg_category'
									translations={{
										seeAllOption: __(
											'All icons',
											'maxi-blocks'
										),
									}}
								/>
							</div>
							<div className='maxi-cloud-container__sc__content-sc'>
								<Stats translations={resultsCount} />
								<InfiniteHits hitComponent={svgResults} />
							</div>
						</div>
					</InstantSearch>
				</div>
			)}

			{(type.includes('shape') || type.includes('video-icon')) && (
				<InstantSearch
					indexName='svg_icon'
					searchClient={searchClientSvg}
				>
					<Configure hitsPerPage={49} />
					<div className='maxi-cloud-container__svg-shape'>
						<div className='maxi-cloud-container__svg-shape__sidebar maxi-cloud-container__hide-categories'>
							{type.includes('shape') && (
								<SearchBox
									submit={__('Find', 'maxi-blocks')}
									autoFocus
									searchAsYouType
									showLoadingIndicator
								/>
							)}
							{type === 'video-icon-play' && (
								<SearchBox
									submit={__('Find', 'maxi-blocks')}
									defaultRefinement='play'
									autoFocus
									searchAsYouType
									showLoadingIndicator
								/>
							)}
							{type === 'video-icon-close' && (
								<SearchBox
									submit={__('Find', 'maxi-blocks')}
									defaultRefinement='cross'
									autoFocus
									searchAsYouType
									showLoadingIndicator
								/>
							)}
							<CustomHierarchicalMenu
								attributes={['svg_tag.lvl0', 'svg_tag.lvl1']}
								limit={100}
							/>
							{type.includes('shape') && (
								<CustomRefinementList
									className='hidden'
									attribute='svg_category'
									defaultRefinement={['Shape']}
									showLoadingIndicator
								/>
							)}
						</div>
						<div className='maxi-cloud-container__content-svg-shape'>
							{type.includes('video-icon') && (
								<div className='maxi-cloud-container__content-svg-shape__search-bar'>
									<CustomMenuSelect
										className='maxi-cloud-container__content-svg-shape__categories'
										attribute='svg_category'
										translations={{
											seeAllOption: __(
												'All icons',
												'maxi-blocks'
											),
										}}
									/>
								</div>
							)}
							<div className='maxi-cloud-container__sc__content-sc'>
								<Stats translations={resultsCount} />
								<InfiniteHits hitComponent={svgShapeResults} />
							</div>
						</div>
					</div>
				</InstantSearch>
			)}

			{(type === 'button-icon' ||
				type === 'search-icon' ||
				type === 'accordion-icon' ||
				type === 'accordion-icon-active') && (
				<InstantSearch
					indexName='svg_icon'
					searchClient={searchClientSvg}
				>
					<Configure hitsPerPage={49} />
					<div className='maxi-cloud-container__svg-shape'>
						<div className='maxi-cloud-container__svg-shape__sidebar'>
							<SearchBox
								submit={__('Find', 'maxi-blocks')}
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<CustomHierarchicalMenu
								attributes={['svg_tag.lvl0', 'svg_tag.lvl1']}
								limit={100}
							/>
							<CustomClearRefinements />
						</div>
						<div className='maxi-cloud-container__content-svg-shape'>
							<div className='maxi-cloud-container__content-svg-shape__search-bar'>
								<CustomMenuSelect
									className='maxi-cloud-container__content-svg-shape__categories'
									attribute='svg_category'
									defaultRefinement='Line'
									translations={{
										seeAllOption: __(
											'All icons',
											'maxi-blocks'
										),
									}}
								/>
							</div>
							<div className='maxi-cloud-container__sc__content-sc'>
								<Stats translations={resultsCount} />
								<InfiniteHits hitComponent={svgShapeResults} />
							</div>
						</div>
					</div>
				</InstantSearch>
			)}
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
						<div className='maxi-cloud-container__patterns__top-menu'>
							<Menu
								attribute='gutenberg_type'
								defaultRefinement='Patterns'
								transformItems={items => {
									const itemsReturn = [];

									const firstItem = items.find(
										item => item.label === 'Pages'
									);
									if (firstItem) itemsReturn[0] = firstItem;
									else
										itemsReturn[0] = {
											label: 'Pages',
											value: 'Pages',
											count: 0,
											isRefined: false,
										};

									const secondItem = items.find(
										item => item.label === 'Patterns'
									);
									if (secondItem) itemsReturn[1] = secondItem;
									else
										itemsReturn[1] = {
											label: 'Patterns',
											value: 'Patterns',
											count: 0,
											isRefined: false,
										};

									itemsReturn.push({
										label: 'Go pro',
										value: 'Go pro',
										isRefined: false,
									});
									return itemsReturn;
								}}
							/>
						</div>
						<div className='maxi-cloud-container__patterns__sidebar'>
							<CustomMenuSelect
								className='maxi-cloud-container__content-patterns__cost'
								attribute='cost'
							/>
							<Menu
								attribute='light_or_dark'
								defaultRefinement='Light'
								transformItems={items => {
									const itemsReturn = items.map(item => {
										return {
											...item,
											label: `${item.label}
											${__('tone', 'maxi-blocks')}`,
										};
									});
									const firstItem = itemsReturn[0];
									const secondItem = itemsReturn[1];
									if (secondItem?.label?.includes('Light')) {
										itemsReturn[0] = secondItem;
										itemsReturn[1] = firstItem;
									}
									if (
										itemsReturn.length === 1 &&
										itemsReturn[0]?.count === 0
									) {
										return [
											{
												count: 0,
												isRefined: false,
												label: 'Light tone',
												value: 'Light',
											},
											{
												count: 0,
												isRefined: false,
												label: 'Dark tone',
												value: 'Dark',
											},
										];
									}
									return itemsReturn;
								}}
							/>
							<SearchBox
								autoFocus
								searchAsYouType
								reset='X'
								translations={{
									resetTitle: 'Clear',
								}}
							/>
							<PlaceholderCheckboxControl />
							<CustomHierarchicalMenu
								attributes={['category.lvl0', 'category.lvl1']}
								limit={100}
							/>
							<CustomClearRefinements />
						</div>
						<div className='maxi-cloud-container__patterns__content-patterns'>
							<Stats translations={resultsCount} />
							<InfiniteHits hitComponent={patternsResults} />
						</div>
					</InstantSearch>
				</div>
			)}
			{type === 'sc' && (
				<div className='maxi-cloud-container__sc'>
					<InstantSearch
						indexName='style_card'
						searchClient={searchClientSc}
					>
						<Configure hitsPerPage={9} />
						<div className='maxi-cloud-container__sc__sidebar'>
							<SearchBox
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<Accordion
								title={__('Colour', 'maxi-blocks')}
								openByDefault
							>
								<CustomRefinementList
									attribute='sc_color'
									limit={20}
									transformItems={items =>
										orderBy(items, 'label', 'asc')
									}
								/>
							</Accordion>
							<CustomClearRefinements />
						</div>
						<div className='maxi-cloud-container__sc__content-sc'>
							<Stats translations={resultsCount} />
							<InfiniteHits hitComponent={scResults} />
						</div>
					</InstantSearch>
				</div>
			)}
		</div>
	);
};

export default LibraryContainer;
