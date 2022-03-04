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
import { Button, ToggleSwitch } from '../../components';
import { updateSCOnEditor } from '../../extensions/style-cards';
import {
	imageUploader,
	svgAttributesReplacer,
	svgCurrentColorStatus,
	fitSvg,
} from './util';
import { injectImgSVG, generateDataObject } from '../../extensions/svg';
import DOMPurify from 'dompurify';

/**
 * External dependencies
 */
import algoliasearch from 'algoliasearch/lite';
import {
	InstantSearch,
	SearchBox,
	InfiniteHits,
	connectRefinementList,
	connectMenu,
	connectHierarchicalMenu,
	ClearRefinements,
	Menu,
	Stats,
} from 'react-instantsearch-dom';
import classnames from 'classnames';
import { uniq, isEmpty, uniqueId } from 'lodash';

const MasonryItem = props => {
	const {
		type,
		target,
		svgCode,
		isPro,
		serial,
		onRequestInsert,
		previewIMG,
		demoUrl,
		currentItemColorStatus = false,
		taxonomies,
	} = props;

	const masonryCardClasses = classnames(
		'maxi-cloud-masonry-card',
		`maxi-cloud-masonry-card__${target}`,
		type === 'svg' &&
			currentItemColorStatus &&
			'maxi-cloud-masonry-card__light'
	);

	return (
		<div className={masonryCardClasses}>
			{(type === 'patterns' || type === 'sc') && (
				<Button onClick={onRequestInsert}>
					<div className='maxi-cloud-masonry-card__container'>
						<div className='maxi-cloud-masonry-card__container__top-bar'>
							<div className='maxi-cloud-masonry__serial-tag'>
								{serial}
							</div>
						</div>
					</div>
					<div className='maxi-cloud-masonry-card__image'>
						{(type === 'patterns' || type === 'sc') && (
							<img
								src={previewIMG}
								alt={`Preview for ${serial}`}
							/>
						)}
					</div>
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
							{__('Load', 'maxi-blocks')}
						</Button>
						<div className='maxi-cloud-masonry-card__tags'>
							{isPro && (
								<span className='maxi-cloud-masonry-card__tags__pro-tag'>
									{__('PRO', 'maxi-blocks')}
								</span>
							)}
						</div>
					</div>
				</Button>
			)}
			{type === 'svg' && (
				<div
					className='maxi-cloud-masonry-card__svg-container'
					onClick={onRequestInsert}
				>
					<RawHTML
						style={{
							backgroundColor: currentItemColorStatus
								? '#000000'
								: '#ffffff',
						}}
						className='maxi-cloud-masonry-card__svg-container__code'
					>
						{svgCode}
					</RawHTML>
					<div className='maxi-cloud-masonry-card__svg-container__title'>
						{target === 'button-icon' || target.includes('Line')
							? serial.replace(' Line', '')
							: [
									'image-shape',
									'bg-shape',
									'sidebar-block-shape',
							  ].includes(target) || target.includes('Shape')
							? serial.replace(' Shape', '')
							: serial}
					</div>
					<span>{__('Load', 'maxi-block')}</span>
				</div>
			)}
		</div>
	);
};

/**
 * Component
 */
const LibraryContainer = props => {
	const { type, onRequestClose, blockStyle, onSelect } = props;

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

	const searchClient = algoliasearch(
		'39ZZ3SLI6Z',
		'6ed8ae6d1c430c6a76e0720f74eab91c'
	);

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

	const [isChecked, setChecked] = useState(false);

	/** Patterns / Blocks */
	const onRequestInsertPattern = (parsedContent, usePlaceholderImage) => {
		const isValid = isValidTemplate(parsedContent);

		if (isValid) {
			const loadingMessage = `<h3>${__(
				'LOADING…',
				'maxi-blocks'
			)}<span class="maxi-spinner"></span></h3>`;

			onSelect({ content: loadingMessage });

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

	const getShapeType = type => {
		switch (type) {
			case 'button-icon':
				return 'icon';
			case 'sidebar-block-shape':
				return 'shape';
			case 'bg-shape':
				return 'shape';
			default:
				return type;
		}
	};

	/** Patterns / Blocks Results */
	const patternsResults = ({ hit }) => {
		return (
			<>
				<MasonryItem
					type='patterns'
					key={`maxi-cloud-masonry__item-${hit.post_id}`}
					demoUrl={hit.demo_url}
					previewIMG={hit.preview_image_url}
					isPro={hit.taxonomies.cost === 'pro'}
					taxonomies={hit.taxonomies?.category?.[0]}
					serial={hit.post_number}
					onRequestInsert={() =>
						onRequestInsertPattern(hit.gutenberg_code, isChecked)
					}
				/>
			</>
		);
	};

	/** SVG Icons */
	const onRequestInsertSVG = (svgCode, svgType) => {
		const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];
		const newSvgClass = `${svgClass}__${uniqueId()}`;
		const replaceIt = `${svgClass}`;

		const finalSvgCode = svgAttributesReplacer(
			blockStyle,
			svgCode
		).replaceAll(replaceIt, newSvgClass);

		if (isValidTemplate(finalSvgCode)) {
			onSelect({ content: finalSvgCode });
			onSelect({ svgType });
			onRequestClose();
		}
	};

	/** SVG Icons Results */
	const svgResults = ({ hit }) => {
		const newContent = svgAttributesReplacer(blockStyle, hit.svg_code);
		const svgType = hit.taxonomies.svg_category[0];
		const shapeType = getShapeType(type);

		return (
			<MasonryItem
				type='svg'
				target={svgType}
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={newContent}
				isPro={hit.taxonomies.cost === 'pro'}
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
	const onRequestInsertShape = svgCode => {
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

				const SVGOptions = {};
				const newSvgCode = svgCode
					.replace(/width="(.*?)"/g, '')
					.replace(/height="(.*?)"/g, '');
				const cleanedContent = DOMPurify.sanitize(newSvgCode);

				const svg = document
					.createRange()
					.createContextualFragment(cleanedContent).firstElementChild;
				const resData = generateDataObject(SVGOptions[SVGData], svg);
				const resEl = injectImgSVG(svg, resData);

				onSelect({
					SVGElement: injectImgSVG(resEl, SVGData).outerHTML,
					SVGData,
				});

				onRequestClose();
			}

			if (type === 'button-icon') {
				const cleanedContent = DOMPurify.sanitize(svgCode);

				onSelect({
					'icon-content': cleanedContent,
				});

				onRequestClose();
			}
		}
	};

	/** Shapes Results */
	const svgShapeResults = ({ hit }) => {
		const shapeType = getShapeType(type);

		const newContent = svgAttributesReplacer(
			blockStyle,
			hit.svg_code,
			shapeType
		);

		return (
			<MasonryItem
				type='svg'
				target={type}
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				svgCode={newContent}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertShape(newContent)}
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
				key={`maxi-cloud-masonry__item-${hit.post_id}`}
				previewIMG={hit.images.thumbnail.url}
				isPro={hit.taxonomies.cost === 'pro'}
				serial={hit.post_title}
				onRequestInsert={() => onRequestInsertSC(hit.sc_code)}
			/>
		);
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

	const PlaceholderCheckboxControl = () => {
		return (
			<CheckboxControl
				className='use-placeholer-all-images'
				label={__('Use placeholder for all images', 'maxi-blocks')}
				help={__(
					'(do not download any images to your media library, use a generic grey image)',
					'maxi-blocks'
				)}
				checked={isChecked}
				onChange={setChecked}
			/>
		);
	};

	const RefinementList = ({ items, refine }) => (
		<ul>
			{items.map(item => (
				<li key={item.label} className='ais-RefinementList-item'>
					<a
						href='#'
						onClick={event => {
							event.preventDefault();
							refine(item.value);
						}}
					>
						{item.label} ({item.count})
					</a>
					<ToggleSwitch
						selected={item.isRefined}
						onChange={val => refine(item.value)}
					/>
				</li>
			))}
		</ul>
	);

	const CustomRefinementList = connectRefinementList(RefinementList);

	const MenuSelect = ({ items, currentRefinement, refine }) => {
		return (
			<div>
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
						items[0].isRefined = true;
					}}
				>
					{__('All', 'maxi-blocks')}
				</button>
				{items.map(item => (
					<button
						type='button'
						key={item.label}
						className={classnames(
							'maxi-cloud-container__content-svg-shape__button',
							item.isRefined &&
								' maxi-cloud-container__content-svg-shape__button___pressed'
						)}
						value={item.value}
						onClick={event => {
							event.preventDefault();
							refine(item.value);
							item.isRefined = true;
						}}
					>
						{item.label}
					</button>
				))}
			</div>
		);
	};

	const CustomMenuSelect = connectMenu(MenuSelect);

	const HierarchicalMenu = ({ items, refine }) => (
		<ul>
			{items.map(item => (
				<li key={item.label} className='ais-HierarchicalMenu-item'>
					<a
						href='#'
						onClick={event => {
							event.preventDefault();
							refine(item.value);
						}}
					>
						{item.label} ({item.count})
					</a>
					<ToggleSwitch
						selected={item.isRefined}
						onChange={val => refine(item.value)}
					/>
					{item.items && (
						<HierarchicalMenu items={item.items} refine={refine} />
					)}
				</li>
			))}
		</ul>
	);

	const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);

	return (
		<div className='maxi-cloud-container'>
			{type === 'svg' && (
				<div className='maxi-cloud-container__svg-icon'>
					<InstantSearch
						indexName='maxi_posts_svg_icon'
						searchClient={searchClient}
					>
						<div className='maxi-cloud-container__sc__sidebar'>
							<SearchBox
								submit={__('Find', 'maxi-blocks')}
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<CustomHierarchicalMenu
								attributes={[
									'taxonomies_hierarchical.svg_tag.lvl0',
									'taxonomies_hierarchical.svg_tag.lvl1',
								]}
								limit={10}
								showMore
								showLoadingIndicator
								showMoreLimit={10}
							/>
							<ClearRefinements />
						</div>
						<div className='maxi-cloud-container__content-svg-shape'>
							<div className='maxi-cloud-container__content-svg-shape__search-bar'>
								<CustomMenuSelect
									className='maxi-cloud-container__content-svg-shape__categories'
									attribute='taxonomies.svg_category'
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
							<CustomRefinementList
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
							<CustomRefinementList
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
						<div className='maxi-cloud-container__patterns__top-menu'>
							<CustomMenuSelect
								className='maxi-cloud-container__content-patterns__cost'
								attribute='taxonomies.cost'
							/>
							<Menu
								attribute='taxonomies.gutenberg_type'
								defaultRefinement='Block Patterns'
							/>
						</div>
						<div className='maxi-cloud-container__patterns__sidebar'>
							<Menu
								attribute='taxonomies.light_or_dark'
								defaultRefinement='Light'
								transformItems={items =>
									items.map(item => ({
										...item,
										label: `${item.label} 
											${__('tone', 'maxi-blocks')}`,
									}))
								}
							/>
							<SearchBox
								autoFocus
								searchAsYouType
								showLoadingIndicator
							/>
							<PlaceholderCheckboxControl />
							<CustomHierarchicalMenu
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
							<Accordion
								title={__('Colour', 'maxi-blocks')}
								openByDefault
							>
								<CustomRefinementList attribute='taxonomies.sc_color' />
							</Accordion>
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
