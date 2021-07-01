/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, select, useSelect } from '@wordpress/data';
import { RawHTML, useEffect, useState } from '@wordpress/element';
import { CheckboxControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../components/button';
import { updateSCOnEditor } from '../../extensions/style-cards';
import imageUploader from './util';
import { injectImgSVG, generateDataObject } from '../../extensions/svg/utils';
import DOMPurify from 'dompurify';

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
import { uniq, isEmpty, uniqueId, cloneDeep } from 'lodash';

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
	const { type, onRequestClose, blockStyle, layerId } = props;

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

	const onRequestInsertPattern = (parsedContent, usePlaceholderImage) => {
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
					console.error(
						__(
							"Error processing images' links and ids - counts do not match",
							'maxi-blocks'
						)
					);
					replaceBlock(
						clientId,
						wp.blocks.rawHandler({
							HTML: parsedContent,
							mode: 'BLOCKS',
						})
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

					imageUploader(url, usePlaceholderImage).then(data => {
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

	const [isChecked, setChecked] = useState(false);

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
						onRequestInsertPattern(hit.gutenberg_code, isChecked)
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

		const isValid = select('core/block-editor').isValidTemplate(svgCode);

		const {
			uniqueID,
			mediaID,
			mediaURL,
			'background-layers': bgLayers,
			'background-layers-status': bgLayersStatus,
			'background-svg-SVGData': svgData,
		} = select('core/block-editor').getBlockAttributes(clientId);

		if (isValid) {
			if (type === 'block-shape') {
				const clientId =
					select('core/block-editor').getSelectedBlockClientId();

				if (isValid) {
					updateBlockAttributes(clientId, { content: svgCode });
					onRequestClose();
				}
			}

			if (type === 'bg-shape' && bgLayersStatus) {
				const newBgLayers = cloneDeep(bgLayers);

				newBgLayers[layerId]['background-svg-SVGCurrentElement'] = '';
				newBgLayers[layerId]['background-svg-SVGElement'] = svgCode;

				updateBlockAttributes(clientId, {
					'background-layers': [...newBgLayers],
				});

				onRequestClose();
			}

			if (type === 'bg-shape' && !bgLayersStatus) {
				const cleanedContent = DOMPurify.sanitize(svgCode);
				const svg = document
					.createRange()
					.createContextualFragment(cleanedContent).firstElementChild;

				const SVGData = {
					[`${uniqueID}__${uniqueId()}`]: {
						color: '',
						imageID: mediaID,
						imageURL: mediaURL,
					},
				};
				const SVGOptions = {};
				const resData = generateDataObject(SVGOptions[SVGData], svg);
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

				updateBlockAttributes(clientId, {
					'background-svg-SVGCurrentElement': '',
					'background-svg-SVGElement': resEl.outerHTML,
					'background-svg-SVGMediaID': null,
					'background-svg-SVGMediaURL': null,
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

				const SVGOptions = {};
				const cleanedContent = DOMPurify.sanitize(svgCode);
				const svg = document
					.createRange()
					.createContextualFragment(cleanedContent).firstElementChild;
				const resData = generateDataObject(SVGOptions[SVGData], svg);
				const resEl = injectImgSVG(svg, resData);

				updateBlockAttributes(clientId, {
					SVGCurrentElement: '',
					SVGElement: injectImgSVG(resEl, SVGData).outerHTML,
					SVGData,
				});

				onRequestClose();
			}
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

	const PlaceholderCheckboxControl = () => {
		return (
			<CheckboxControl
				label='Use placeholder for all images'
				help='(do not download any images to your media library, use a generic grey image)'
				checked={isChecked}
				onChange={setChecked}
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
					<div
						className={`maxi-cloud-container__content-svg maxi-${blockStyle}`}
					>
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

			{type.includes('shape') && (
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
					<PlaceholderCheckboxControl />
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
