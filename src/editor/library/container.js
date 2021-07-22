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
						{type === 'sc' || type === 'patterns'
							? __('Load', 'maxi-blocks')
							: __('+', 'maxi-blocks')}
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

			const imagesLinks = [];
			const imagesIds = [];

			const allImagesRegexp = new RegExp('mediaID":(.*)",', 'g');

			const allImagesLinks = parsedContent.match(allImagesRegexp);

			const allImagesLinksParsed = allImagesLinks.map(image => {
				const parsed = image.replace(/\\/g, '');

				const idRegexp = new RegExp('(?<=":)(.*?)(?=,")', 'g');
				const id = parsed.match(idRegexp);
				imagesIds.push(id);

				const urlRegexp = new RegExp(
					'(?<=mediaURL":")(.*?)(?=",)',
					'g'
				);
				const url = parsed.match(urlRegexp);
				imagesLinks.push(url);

				return null;
			});

			if (!isEmpty(allImagesLinksParsed)) {
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

		const currentSvgAttr =
			select('core/block-editor').getBlock(clientId).attributes;

		const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];

		const newSvgClass = `.${currentSvgAttr.uniqueID} .${svgClass}`;
		const replaceIt = `.${svgClass}`;

		const fillColor = !currentSvgAttr['svg-palette-fill-color-status']
			? currentSvgAttr['svg-fill-color']
			: `var(--maxi-${blockStyle}-icon-fill, var(--maxi-${blockStyle}-color-${currentSvgAttr['svg-palette-fill-color']}))`;

		const lineColor = !currentSvgAttr['svg-palette-line-color-status']
			? currentSvgAttr['svg-line-color']
			: `var(--maxi-${blockStyle}-icon-line, var(--maxi-${blockStyle}-color-${currentSvgAttr['svg-palette-line-color']}))`;

		const fillRegExp = new RegExp('fill:[^n]+?(?=})', 'g');
		const fillStr = `fill:${fillColor}`;

		const fillRegExp2 = new RegExp('[^-]fill="[^n]+?(?=")', 'g');
		const fillStr2 = ` fill="${fillColor}`;

		const strokeRegExp = new RegExp('stroke:[^n]+?(?=})', 'g');
		const strokeStr = `stroke:${lineColor}`;

		const strokeRegExp2 = new RegExp('[^-]stroke="[^n]+?(?=")', 'g');
		const strokeStr2 = ` stroke="${lineColor}`;

		const newContent = svgCode
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		const finalSvgCode = newContent.replaceAll(replaceIt, newSvgClass);

		const isValid =
			select('core/block-editor').isValidTemplate(finalSvgCode);

		if (isValid) {
			updateBlockAttributes(clientId, { content: finalSvgCode });
			onRequestClose();
		}
	};

	const svgResults = ({ hit }) => {
		const currentSvgAttr = select('core/block-editor').getBlock(
			select('core/block-editor').getSelectedBlockClientId()
		).attributes;

		const fillColor = !currentSvgAttr['svg-palette-fill-color-status']
			? currentSvgAttr['svg-fill-color']
			: `var(--maxi-${blockStyle}-icon-fill, var(--maxi-${blockStyle}-color-${currentSvgAttr['svg-palette-fill-color']}))`;

		const lineColor = !currentSvgAttr['svg-palette-line-color-status']
			? currentSvgAttr['svg-line-color']
			: `var(--maxi-${blockStyle}-icon-line, var(--maxi-${blockStyle}-color-${currentSvgAttr['svg-palette-line-color']}))`;

		const fillRegExp = new RegExp('fill:[^n]+?(?=})', 'g');
		const fillStr = `fill:${fillColor}`;

		const fillRegExp2 = new RegExp('[^-]fill="[^n]+?(?=")', 'g');
		const fillStr2 = ` fill="${fillColor}`;

		const strokeRegExp = new RegExp('stroke:[^n]+?(?=})', 'g');
		const strokeStr = `stroke:${lineColor}`;

		const strokeRegExp2 = new RegExp('[^-]stroke="[^n]+?(?=")', 'g');
		const strokeStr2 = ` stroke="${lineColor}`;

		const newContent = hit.svg_code
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		return (
			<MasonryItem
				type='svg'
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={newContent}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertSVG(newContent)}
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
			if (type === 'block-shape' || type === 'sidebar-block-shape') {
				const clientId =
					select('core/block-editor').getSelectedBlockClientId();

				const SVGData = {
					[`${uniqueID}__${uniqueId()}`]: {
						color: '',
						imageID: mediaID,
						imageURL: mediaURL,
					},
				};

				updateBlockAttributes(clientId, {
					shapeSVGElement: svgCode,
					shapeSVGData: SVGData,
				});

				onRequestClose();
			}

			if (type === 'bg-shape') {
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

				if (!bgLayersStatus) {
					updateBlockAttributes(clientId, {
						'background-svg-SVGElement': resEl.outerHTML,
						'background-svg-SVGMediaID': null,
						'background-svg-SVGMediaURL': null,
						'background-svg-SVGData': resData,
					});
				} else {
					const newBgLayers = cloneDeep(bgLayers);

					newBgLayers[layerId]['background-svg-SVGElement'] =
						resEl.outerHTML;
					newBgLayers[layerId]['background-svg-SVGMediaID'] = '';
					newBgLayers[layerId]['background-svg-SVGMediaURL'] = '';
					newBgLayers[layerId]['background-svg-SVGData'] = resData;

					updateBlockAttributes(clientId, {
						'background-layers': [...newBgLayers],
					});
				}

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
					SVGElement: injectImgSVG(resEl, SVGData).outerHTML,
					SVGData,
				});

				onRequestClose();
			}

			if (type === 'button-icon') {
				const cleanedContent = DOMPurify.sanitize(svgCode);

				updateBlockAttributes(clientId, {
					'icon-content': cleanedContent,
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
			return (
				type !== 'sc' &&
				type !== 'patterns' && (
					<span>
						<strong>{nbHits.toLocaleString()}</strong>
						<span>results</span>
					</span>
				)
			);
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
					<div className='maxi-cloud-container__content-svg-shape'>
						<div className='maxi-cloud-container__content-svg-shape__search-bar'>
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
						</div>
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
						<div className='maxi-cloud-container__content-svg-shape__search-bar'>
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
						</div>
						<InfiniteHits hitComponent={svgShapeResults} />
					</div>
				</InstantSearch>
			)}

			{type === 'button-icon' && (
				<InstantSearch
					indexName='maxi_posts_svg_icon'
					searchClient={searchClient}
				>
					<div className='maxi-cloud-container__content-svg-shape'>
						<div className='maxi-cloud-container__content-svg-shape__search-bar'>
							<SearchBox
								submit={__('Find', 'maxi-blocks')}
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<RefinementList
								className='hidden'
								attribute='taxonomies.svg_category'
								defaultRefinement={['Line']}
								showLoadingIndicator
							/>
							<Stats translations={resultsCount} />
						</div>
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
						<div className='maxi-cloud-container__patterns__sidebar'>
							<SearchBox
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<PlaceholderCheckboxControl />
							<div className='maxi-cloud-container__patterns__sidebar__top-menu'>
								<Menu
									attribute='taxonomies.gutenberg_type'
									defaultRefinement='Block Patterns'
								/>
							</div>
							<div className='maxi-cloud-container__patterns__sidebar__top'>
								<RefinementList attribute='taxonomies.cost' />
							</div>
							<RefinementList
								attribute='taxonomies.light_or_dark'
								defaultRefinement={['Light']}
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
						indexName='maxi_posts_style_card'
						searchClient={searchClient}
					>
						<div className='maxi-cloud-container__sc__sidebar'>
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
