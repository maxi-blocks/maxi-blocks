/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RawHTML, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	createTransitionObj,
	getAttributeKey,
	getAttributeValue,
	getBlockStyle,
	getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import * as backgroundLayers from './layers';
import ColorLayer from './colorLayer';
import GradientLayer from './gradientLayer';
import Icon from '@components/icon';
import ImageLayer from './imageLayer';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';
import {
	getLayerLabel,
	handleOnChangeLayer,
	onChangeLayer,
	setBreakpointToLayer,
} from './utils';
import SelectControl from '@components/select-control';
import ListControl from '@components/list-control';
import ListItemControl from '@components/list-control/list-item-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, isEmpty, omit } from 'lodash';

/**
 * Icons
 */
import { toolbarDrop, toolbarShow } from '@maxi-icons';
import { getDCValues } from '@extensions/DC';

/**
 * Component
 */
const getLayerCardContent = props => {
	const {
		breakpoint,
		isHover,
		isIB,
		layer,
		normalLayer,
		onChangeInline = null,
		onChange,
		previewRef,
		getBounds,
		getBlockClipPath, // for IB
		clientId,
	} = props;

	const handleGetBounds = () =>
		getBounds(
			`.maxi-background-displayer .maxi-background-displayer__${layer.order}`
		);

	const handleGetBlockClipPath = () => getBlockClipPath(layer.id);

	switch (layer.type) {
		case 'color':
			return (
				<ColorLayer
					key={`background-color-layer--${layer.order}`}
					colorOptions={layer}
					normalLayer={normalLayer}
					onChangeInline={obj => {
						previewRef.current.style.background =
							obj['background-color'];
						onChangeInline &&
							onChangeInline(
								obj,
								`.maxi-background-displayer__${layer.order}`
							);
					}}
					onChange={obj => {
						onChange(
							{
								...layer,
								...handleOnChangeLayer(obj, layer, isHover),
							},
							`.maxi-background-displayer__${layer.order}`
						);
					}}
					breakpoint={breakpoint}
					isHover={isHover}
					isIB={isIB}
					isLayer
					clientId={clientId}
					getBounds={handleGetBounds}
					getBlockClipPath={handleGetBlockClipPath}
				/>
			);
		case 'image':
			return (
				<ImageLayer
					key={`background-image-layer--${layer.order}`}
					imageOptions={layer}
					onChange={obj =>
						onChange({
							...layer,
							...handleOnChangeLayer(obj, layer),
						})
					}
					breakpoint={breakpoint}
					isHover={isHover}
					isIB={isIB}
					disableUpload={isHover || isIB}
					isLayer
					getBounds={handleGetBounds}
					getBlockClipPath={handleGetBlockClipPath}
				/>
			);
		case 'video':
			return (
				<VideoLayer
					key={`background-video-layer--${layer.order}`}
					videoOptions={layer}
					onChange={obj =>
						onChange({
							...layer,
							...handleOnChangeLayer(obj, layer),
						})
					}
					breakpoint={breakpoint}
					isHover={isHover}
					isIB={isIB}
					isLayer
				/>
			);
		case 'gradient':
			return (
				<GradientLayer
					key={`background-gradient-layer--${layer.order}`}
					gradientOptions={layer}
					onChange={obj =>
						onChange({
							...layer,
							...handleOnChangeLayer(obj, layer),
						})
					}
					breakpoint={breakpoint}
					isHover={isHover}
					isIB={isIB}
					isLayer
					getBounds={handleGetBounds}
					getBlockClipPath={handleGetBlockClipPath}
				/>
			);
		case 'shape':
			return (
				<SVGLayer
					key={`background-SVG-layer--${layer.order}`}
					SVGOptions={layer}
					onChange={obj =>
						onChange({
							...layer,
							...handleOnChangeLayer(obj, layer),
						})
					}
					layerOrder={layer.order}
					breakpoint={breakpoint}
					isHover={isHover}
					isLayer
					isIB={isIB}
				/>
			);
		default:
			return null;
	}
};

const getLayerCardTitle = props => {
	const { onChange, clientId, breakpoint, isHover, previewRef } = props;
	const layer = cloneDeep(props.layer);
	const { type } = layer;

	const regexLineToChange = /fill=".+?(?=")/;
	const colorStr = getColorRGBAString({
		firstVar: `color-${layer['background-svg-palette-color']}`,
		opacity: layer['background-svg-palette-opacity'],
		blockStyle: getBlockStyle(clientId),
	});
	const changeTo = `fill="${colorStr}"`;

	const newSvgElement = layer['background-svg-palette-status']
		? layer['background-svg-SVGElement']?.replace(
				regexLineToChange,
				changeTo
		  )
		: layer['background-svg-SVGElement'];

	const previewStyles = type => {
		switch (type) {
			case 'color': {
				const paletteStatus = getLastBreakpointAttribute({
					target: 'background-palette-status',
					breakpoint,
					attributes: layer,
					isHover,
				});

				if (paletteStatus) {
					const paletteColor = getLastBreakpointAttribute({
						target: 'background-palette-color',
						breakpoint,
						attributes: layer,
						isHover,
					});
					const paletteOpacity = getLastBreakpointAttribute({
						target: 'background-palette-opacity',
						breakpoint,
						attributes: layer,
						isHover,
					});

					return {
						background: getColorRGBAString({
							firstVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle: getBlockStyle(clientId),
						}),
					};
				}

				return {
					background: getLastBreakpointAttribute({
						target: 'background-color',
						breakpoint,
						attributes: layer,
						isHover,
					}),
				};
			}
			case 'gradient': {
				const bgGradient = getLastBreakpointAttribute({
					target: 'background-gradient',
					breakpoint,
					attributes: layer,
					isHover,
				});
				const bgGradientOpacity = getLastBreakpointAttribute({
					target: 'background-gradient-opacity',
					breakpoint,
					attributes: layer,
					isHover,
				});
				return {
					background: bgGradient,
					opacity: bgGradientOpacity,
				};
			}
			case 'image': {
				const { status: dcStatus, mediaUrl: dcMediaUrl } = getDCValues(
					getGroupAttributes(layer, 'dynamicContent'),
					{}
				);
				const bgImageURL = getAttributeValue({
					target: 'background-image-mediaURL',
					props: layer,
				});
				const bgImageOpacity = getLastBreakpointAttribute({
					target: 'background-image-opacity',
					breakpoint,
					attributes: layer,
					isHover,
				});

				const url = dcStatus ? dcMediaUrl : bgImageURL;

				return {
					background: !isEmpty(url) ? `url(${url})` : '',
					opacity: bgImageOpacity,
				};
			}
			case 'video': {
				const bgFallbackUrl = getLastBreakpointAttribute({
					target: 'background-video-fallbackURL',
					breakpoint,
					attributes: layer,
					isHover,
				});
				const bgVideoOpacity = getLastBreakpointAttribute({
					target: 'background-video-opacity',
					breakpoint,
					attributes: layer,
					isHover,
				});

				return {
					background: !isEmpty(bgFallbackUrl)
						? `url(${bgFallbackUrl})`
						: '',
					opacity: bgVideoOpacity,
				};
			}
			default:
				return {};
		}
	};

	const getTitle = type => {
		switch (type) {
			case 'color':
				return __('Background colour', 'maxi-blocks');
			case 'image':
				return __('Background image', 'maxi-blocks');
			case 'video':
				return __('Background video', 'maxi-blocks');
			case 'gradient':
				return __('Background gradient', 'maxi-blocks');
			case 'shape':
				return __('Background shape', 'maxi-blocks');
			default:
				return null;
		}
	};

	const onChangeDisplay = () => {
		const currentDisplay = getLastBreakpointAttribute({
			target: 'display',
			breakpoint,
			attributes: layer,
			isHover,
		});

		onChange({
			...layer,
			[getAttributeKey('display', isHover, false, breakpoint)]:
				currentDisplay === 'block' ? 'none' : 'block',
		});
	};

	const getIsDisplayed = () => {
		const currentDisplay = getLastBreakpointAttribute({
			target: 'display',
			breakpoint,
			attributes: layer,
			isHover,
		});

		return currentDisplay === 'block' ? 'block' : 'none';
	};

	return (
		<>
			<span className='maxi-background-layer__title__text'>
				<span
					className='maxi-background-layer__preview'
					ref={previewRef}
					style={previewStyles(type)}
				>
					{type === 'shape' && layer['background-svg-SVGElement'] && (
						<RawHTML>{newSvgElement}</RawHTML>
					)}
				</span>
				{getTitle(type)}
			</span>
			{breakpoint === 'general' && (
				<span
					className={classnames(
						'maxi-background-layer__title__mover',
						'maxi-list-item-control__title__mover',
						'maxi-list-item-control__ignore-open'
					)}
				>
					<Icon icon={toolbarDrop} />
				</span>
			)}
			<span
				className={classnames(
					'maxi-background-layer__title__display',
					`maxi-background-layer__title__display--${getIsDisplayed()}`,
					'maxi-list-item-control__ignore-move',
					'maxi-list-item-control__ignore-open'
				)}
				onClick={onChangeDisplay}
			>
				<Icon icon={toolbarShow} />
			</span>
		</>
	);
};

const BackgroundLayersControl = ({
	layersOptions,
	layersHoverOptions,
	transition,
	isHover = false,
	isIB = false,
	onChangeInline,
	onChange,
	clientId,
	blockAttributes,
	breakpoint,
	disableAddLayer,
	getBounds,
	getBlockClipPath, // for IB
}) => {
	const previewRef = useRef(null);

	const layers = cloneDeep(layersOptions);
	const layersHover = cloneDeep(layersHoverOptions);
	const allLayers = [...layers, ...layersHover];
	const normalLayersSource =
		isIB && blockAttributes?.['background-layers']
			? blockAttributes['background-layers']
			: layers;

	const getLayerUniqueParameter = (parameter, layers = allLayers) =>
		layers && !isEmpty(layers)
			? Math.max(
					...layers.map(layer =>
						typeof layer[parameter] === 'number'
							? layer[parameter]
							: 0
					)
			  ) + 1
			: 1;

	allLayers.sort((a, b) => a.order - b.order);

	const getObject = type => {
		return {
			...setBreakpointToLayer({
				layer: backgroundLayers[getLayerLabel(type)],
				breakpoint: 'general',
				isHover,
			}),
			order: getLayerUniqueParameter('order'),
			id: getLayerUniqueParameter('id'),
		};
	};

	const onLayersDrag = (localFromIndex, localToIndex) => {
		const indexedLayers = !isHover ? layers : allLayers;
		const fromIndex = allLayers.indexOf(indexedLayers[localFromIndex]);
		const toIndex = allLayers.indexOf(indexedLayers[localToIndex]);

		const layer = allLayers.splice(fromIndex, 1)[0];

		allLayers.splice(toIndex, 0, layer);

		allLayers.forEach((layer, i) => {
			allLayers[i].order = i + 1;
		});

		const normalLayers = allLayers.filter(layer => !layer.isHover);
		const hoverLayers = allLayers.filter(layer => layer.isHover);

		onChange({
			'background-layers': normalLayers,
			'background-layers-hover': hoverLayers,
		});
	};

	const onAddLayer = layer => {
		const isHoverLayer = layer.isHover;
		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers);

		newLayers.push(layer);

		onChange({
			[`background-layers${isHoverLayer ? '-hover' : ''}`]: newLayers,
			...(!isHoverLayer
				? {
						transition: {
							...transition,
							transform: {
								...transition.transform,
								[`_${layer.id}`]: createTransitionObj(),
							},
						},
				  }
				: {}),
		});
	};

	const onRemoveLayer = ({ order, isHover: isHoverLayer }) => {
		let idOfRemovedLayer;

		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers).filter(
			lay => {
				if (lay.order !== order) {
					return true;
				}

				idOfRemovedLayer = lay.id;
				return false;
			}
		);

		onChange({
			[`background-layers${isHover ? '-hover' : ''}`]: newLayers,
			transition: {
				...transition,
				transform: omit(transition.transform, `_${idOfRemovedLayer}`),
			},
		});
	};

	return (
		<div className='maxi-background-control__layers'>
			<div>
				{!isEmpty(allLayers) && (
					<ListControl onListItemsDrag={onLayersDrag}>
						{[...(!isHover ? layers : allLayers)].map(layer => {
							const normalLayer = layer.isHover
								? normalLayersSource.find(normalLayer => {
										if (normalLayer.isHover) return false;
										if (normalLayer.id && layer.id)
											return normalLayer.id === layer.id;
										return (
											normalLayer.order === layer.order
										);
								  })
								: null;

							return (
								<ListItemControl
									key={`maxi-background-layers__${
										layer.order
									}${isHover ? '--hover' : ''}`}
									className='maxi-background-layer'
									title={getLayerCardTitle({
										isHover,
										clientId,
										layer,
										onChange: (rawLayer, target = false) =>
											onChangeLayer(
												rawLayer,
												onChange,
												layersHover,
												layers,
												target
											),
										breakpoint,
										previewRef,
									})}
									content={getLayerCardContent({
										breakpoint,
										isHover,
										isIB,
										layer,
										normalLayer,
										onChangeInline,
										onChange: (rawLayer, target = false) =>
											onChangeLayer(
												rawLayer,
												onChange,
												layersHover,
												layers,
												target
											),
										previewRef,
										getBounds,
										getBlockClipPath, // for IB
										clientId,
									})}
									id={layer.order}
									onRemove={() => onRemoveLayer(layer)}
									isCloseButton={
										!disableAddLayer &&
										(!isHover || (isHover && layer.isHover))
									}
								/>
							);
						})}
					</ListControl>
				)}
				{!disableAddLayer && !isHover && (
					<SelectControl
						__nextHasNoMarginBottom
						className='maxi-background-control__add-layer'
						value='Add new layer'
						options={[
							{
								label: __('Add new layer', 'maxi-blocks'),
								value: 'normal',
							},
							{
								label: __('Background colour', 'maxi-blocks'),
								value: 'color',
							},
							{
								label: __('Background image', 'maxi-blocks'),
								value: 'image',
							},
							{
								label: __('Background video', 'maxi-blocks'),
								value: 'video',
							},
							{
								label: __('Background gradient', 'maxi-blocks'),
								value: 'gradient',
							},
							{
								label: __('Background shape', 'maxi-blocks'),
								value: 'shape',
							},
						]}
						onChange={val => {
							const newLayer = getObject(val);
							onAddLayer(newLayer);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default BackgroundLayersControl;
