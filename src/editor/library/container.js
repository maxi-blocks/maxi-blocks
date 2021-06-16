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
import { uniq, isEmpty } from 'lodash';

const imageUploader = async imageSrc => {
	try {
		const ajaxurl = wp.ajax.settings.url;
		const response = await fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_upload_pattern_image&maxi_image_to_upload=${imageSrc}`
		);

		if (!response.ok) {
			console.warn(
				__(
					'The Cloud server is down, using the placeholder image',
					'maxi-blocks'
				)
			);
			// TODO: return the placeholder image here
			return null;
		}

		const data = await response.json();
		if (data.error === '404') {
			console.warn(
				__(
					'The original image not found (404) on the Cloud Site, using the placeholder image',
					'maxi-blocks'
				)
			);
			// TODO: return the placeholder image here
			return null;
		}
		return data;
	} catch (err) {
		console.error(__(`Error uploading the image: ${err}`, 'maxi-blocks'));
	}
	return null;
};

const MasonryItem = props => {
	const {
		type,
		svgCode,
		isPro,
		serial,
		onRequestInsert,
		previewIMG,
		demoUrl,
	} = props;

	return (
		<div className='maxi-cloud-masonry-card'>
			{type !== 'sc' && (
				<div className='maxi-cloud-masonry-card__image'>
					{type === 'svg' && <RawHTML>{svgCode}</RawHTML>}
					{type === 'patterns' && (
						<img src={previewIMG} alt={`Preview for ${serial}`} />
					)}
				</div>
			)}
			<div className='maxi-cloud-masonry-card__container'>
				{type !== 'patterns' && (
					<p className='maxi-cloud-masonry__serial-tag'>{serial}</p>
				)}
				<div className='maxi-cloud-masonry-card__buttons'>
					{type === 'patterns' && (
						<Button
							className='maxi-cloud-masonry-card__button'
							href={demoUrl}
							target='_blank'
						>
							{__('Preview', 'maxi-blocks')}
						</Button>
					)}
					<Button
						className='maxi-cloud-masonry-card__button'
						onClick={onRequestInsert}
					>
						{type !== 'sc' && __('Insert', 'maxi-blocks')}
						{type === 'sc' && __('Load', 'maxi-blocks')}
					</Button>
				</div>
				{type === 'sc' && (
					<div className='maxi-cloud-masonry-card__image'>
						<img src={previewIMG} alt={`Preview for ${serial}`} />
					</div>
				)}
				<div className='maxi-cloud-masonry-card__tags'>
					{isPro && (
						<span className='maxi-cloud-masonry__pro-tag'>PRO</span>
					)}
					{type === 'patterns' && (
						<p className='maxi-cloud-masonry__serial-tag'>
							{serial}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

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
		'39ZZ3SLI6Z',
		'6ed8ae6d1c430c6a76e0720f74eab91c'
	);

	/** Patterns / Blocks */

	const onRequestInsertPattern = parsedContent => {
		const isValid =
			select('core/block-editor').isValidTemplate(parsedContent);

		if (isValid) {
			const clientId =
				select('core/block-editor').getSelectedBlockClientId();

			const loadingMessage = `<h3>${__(
				'LOADING…',
				'maxi-blocks'
			)}<span class="maxi-spinner"></span></h3>`;

			updateBlockAttributes(clientId, { content: loadingMessage });

			onRequestClose();

			const imagesRegexp = new RegExp(
				'(?=https).*?(?:jpeg|jpg|png|svg)',
				'g'
			);
			const imagesLinks = parsedContent.match(imagesRegexp);

			const idsRegexp = new RegExp('(?<=mediaID":)(.*?)(?=,)', 'g');
			const imagesIds = parsedContent.match(idsRegexp);

			if (!isEmpty(imagesLinks)) {
				let tempContent = parsedContent;
				const imagesLinksUniq = uniq(imagesLinks);
				const imagesIdsUniq = uniq(imagesIds);
				let counter = imagesLinksUniq.length;
				const checkCounter = imagesIdsUniq.length;

				if (counter !== checkCounter) {
					// TODO: show a human-readable error here
					console.error(
						__(
							"Error processing images' links and ids - counts do not match",
							'maxi-blocks'
						)
					);
					return;
				}

				const imagesUniq = imagesIdsUniq.reduce(
					(o, k, i) => ({ ...o, [k]: imagesLinksUniq[i] }),
					{}
				);

				Object.entries(imagesUniq).map(image => {
					const id = image[0];
					const url = image[1];

					imageUploader(url).then(data => {
						tempContent = tempContent.replaceAll(url, data.url);
						tempContent = tempContent.replaceAll(id, data.id);
						counter -= 1;
						if (counter === 0) {
							replaceBlock(
								clientId,
								wp.blocks.rawHandler({
									HTML: tempContent,
									mode: 'BLOCKS',
								})
							);
						}
					});
					return null;
				});
			} else {
				// no images to process
				replaceBlock(
					clientId,
					wp.blocks.rawHandler({
						HTML: parsedContent,
						mode: 'BLOCKS',
					})
				);
			}
		} else {
			// not valid gutenberg code
			// TODO: show a human-readable error here
			console.error(__('The Code is not valid', 'maxi-blocks'));
			onRequestClose();
		}
	};

	const patternsResults = ({ hit }) => {
		return (
			<>
				<MasonryItem
					type='patterns'
					key={`maxi-cloud-masonry__item-${hit.post_id}`}
					demoUrl={hit.demo_url}
					previewIMG={hit.preview_image_url}
					isPro={hit.taxonomies.cost === 'pro'}
					serial={hit.post_number}
					onRequestInsert={() =>
						onRequestInsertPattern(hit.gutenberg_code)
					}
				/>
			</>
		);
	};

	/** SVG Icons */

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
			<MasonryItem
				type='svg'
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
			<MasonryItem
				type='svg'
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={hit.svg_code}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertShape(hit.svg_code)}
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

	const scResults = ({ hit }) => {
		return (
			<MasonryItem
				type='sc'
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
