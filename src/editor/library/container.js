/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, select, useSelect } from '@wordpress/data';
import { RawHTML, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../components/button';
import { updateSCOnEditor } from '../../extensions/style-cards';
// import { generateDataObject, injectImgSVG } from '../../extensions/svg/utils';

/**
 * External dependencies
 */
import algoliasearch from 'algoliasearch/lite';
import {
	InstantSearch,
	SearchBox,
	InfiniteHits,
	RefinementList,
	ClearRefinements,
	Menu,
	HierarchicalMenu,
	Stats,
} from 'react-instantsearch-dom';
import {
	REACT_APP_SECRET_ALGOLIA_ID,
	REACT_APP_SECRET_ALGOLIA_KEY,
} from '@env';

/**
 * Component
 */
const LibraryContainer = props => {
	const { type, onRequestClose } = props;

	const { styleCards, selectedSCKey, selectedSCValue } = useSelect(select => {
		const { receiveMaxiStyleCards, receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);

		const styleCards = receiveMaxiStyleCards();
		const { key: selectedSCKey, value: selectedSCValue } =
			receiveMaxiSelectedStyleCard();

		return { styleCards, selectedSCKey, selectedSCValue };
	});

	const { replaceBlock, updateBlockAttributes } =
		useDispatch('core/block-editor');
	const { saveMaxiStyleCards, setSelectedStyleCard } = useDispatch(
		'maxiBlocks/style-cards'
	);

	useEffect(() => {
		updateSCOnEditor(selectedSCValue);
	}, [selectedSCKey]);

	const searchClient = algoliasearch(
		REACT_APP_SECRET_ALGOLIA_ID,
		REACT_APP_SECRET_ALGOLIA_KEY
	);

	useEffect(() => {
		updateSCOnEditor(selectedSCValue);
	}, [selectedSCKey]);

	/** Patterns / Blocks */
	const MasonryItemPatterns = props => {
		const { previewIMG, isPro, serial, onRequestInsert, demoUrl } = props;

		return (
			<div className='maxi-cloud-masonry-card'>
				<div className='maxi-cloud-masonry-card__image'>
					<img src={previewIMG} alt={`Preview for ${serial}`} />
				</div>
				<div className='maxi-cloud-masonry-card__container'>
					<div className='maxi-cloud-masonry-card__buttons'>
						<Button
							className='maxi-cloud-masonry-card__button'
							href={demoUrl}
							target='_blank'
						>
							Preview
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

	const onRequestInsertPattern = parsedContent => {
		const clientId = select('core/block-editor').getSelectedBlockClientId();

		const isValid =
			select('core/block-editor').isValidTemplate(parsedContent);

		if (isValid) {
			replaceBlock(
				clientId,
				wp.blocks.rawHandler({
					HTML: parsedContent,
					mode: 'BLOCKS',
				})
			);
			onRequestClose();
		}
	};

	const patternsResults = ({ hit }) => {
		return (
			<MasonryItemPatterns
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				demoUrl={hit.demo_url}
				previewIMG={hit.preview_image_url}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_number}
				onRequestInsert={() =>
					onRequestInsertPattern(hit.gutenberg_code)
				}
			/>
		);
	};

	/** SVG Icons */
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

	/** Shapes */

	const onRequestInsertShape = svgCode => {
		const clientId = select('core/block-editor').getSelectedBlockClientId();
		// Add code to process the svg shape here

		// const SVGOptions = {};
		// const prefix = '';

		// const resData = generateDataObject(
		// 	SVGOptions[`${prefix}SVGData`],
		// 	svgCode
		// );
		// const resEl = injectImgSVG(svgCode, resData);

		const isValid = select('core/block-editor').isValidTemplate(svgCode);

		if (isValid) {
			updateBlockAttributes(clientId, {
				'background-svg-SVGCurrentElement': '',
				'background-svg-SVGElement': svgCode,
				'background-svg-SVGMediaID': null,
				'background-svg-SVGMediaURL': null,
				// 'background-svg-SVGData': resData,
			});
			onRequestClose();
		}
	};

	const svgShapeResults = ({ hit }) => {
		return (
			<MasonryItemSVG
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={hit.svg_code}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertShape(hit.svg_code)}
			/>
		);
	};

	/** Style Cards */

	const MasonryItemSC = props => {
		const { previewIMG, isPro, serial, onRequestInsert } = props;

		return (
			<div className='maxi-cloud-masonry-card'>
				<div className='maxi-cloud-masonry-card__container'>
					<div className='maxi-cloud-masonry-card__buttons'>
						<p className='maxi-cloud-masonry__serial-tag'>
							{serial}
						</p>
						<Button
							className='maxi-cloud-masonry-card__button'
							onClick={onRequestInsert}
						>
							Load
						</Button>
					</div>
					<div className='maxi-cloud-masonry-card__image'>
						<img src={previewIMG} alt={`Preview for ${serial}`} />
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

	const scResults = ({ hit }) => {
		return (
			<MasonryItemSC
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				previewIMG={hit.images.thumbnail.url}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertSC(hit.sc_code)}
			/>
		);
	};

	const resultsCount = {
		stats(nbHits, nbSortedHits, areHitsSorted) {
			return areHitsSorted && nbHits !== nbSortedHits
				? `Returned: ${nbSortedHits.toLocaleString()} results of ${nbHits.toLocaleString()}`
				: `Returned: ${nbHits.toLocaleString()} results`;
		},
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
							attribute='taxonomies.svg_category'
							defaultRefinement={['Filled']}
							showLoadingIndicator
						/>
						<Stats translations={resultsCount} />
						<InfiniteHits hitComponent={svgResults} />
					</div>
				</InstantSearch>
			)}

			{type === 'shape' && (
				<InstantSearch
					indexName='maxi_posts_svg_icon'
					searchClient={searchClient}
				>
					<div className='maxi-cloud-container__content-svg-shape'>
						<SearchBox
							submit={__('Find', 'maxi-blocks')}
							autoFocus
							searchAsYouType
							showLoadingIndicator
						/>
						<RefinementList
							className='hidden'
							attribute='taxonomies.svg_category'
							defaultRefinement={['Shape']}
							showLoadingIndicator
						/>
						<Stats translations={resultsCount} />
						<InfiniteHits hitComponent={svgShapeResults} />
					</div>
				</InstantSearch>
			)}

			{type === 'patterns' && (
				<div className='maxi-cloud-container__patterns'>
					<InstantSearch
						indexName='maxi_posts_post'
						searchClient={searchClient}
					>
						<div className='maxi-cloud-container__top-menu'>
							<Menu
								attribute='taxonomies.gutenberg_type'
								defaultRefinement='Block Patterns'
							/>
						</div>
						<div className='maxi-cloud-container__top'>
							<RefinementList attribute='taxonomies.cost' />
						</div>
						<div className='maxi-cloud-container__sidebar'>
							<RefinementList
								attribute='taxonomies.light_or_dark'
								defaultRefinement={['Light']}
							/>
							<SearchBox
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<HierarchicalMenu
								attributes={[
									'taxonomies_hierarchical.category.lvl0',
									'taxonomies_hierarchical.category.lvl1',
									'taxonomies_hierarchical.category.lvl2',
									'taxonomies_hierarchical.category.lvl3',
								]}
							/>
							<ClearRefinements />
						</div>
						<div className='maxi-cloud-container__content-patterns'>
							<Stats translations={resultsCount} />
							<InfiniteHits hitComponent={patternsResults} />
						</div>
					</InstantSearch>
				</div>
			)}

			{type === 'sc' && (
				<div className='maxi-cloud-container__sc'>
					<InstantSearch
						indexName='maxi_posts_style_card'
						searchClient={searchClient}
					>
						<div className='maxi-cloud-container__sidebar'>
							<SearchBox
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<div>Colour</div>
							<RefinementList attribute='taxonomies.sc_color' />
							<div>Style</div>
							<RefinementList attribute='taxonomies.sc_style' />
							<ClearRefinements />
						</div>
						<div className='maxi-cloud-container__content-sc'>
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
