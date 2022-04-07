/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getAttributeValue,
	getBlockStyle,
	getColorRGBAString,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as backgroundLayers from './layers';
import ColorLayer from './colorLayer';
import GradientLayer from './gradientLayer';
import Icon from '../icon';
import ImageLayer from './imageLayer';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';
import { setBreakpointToLayer } from './utils';
import SelectControl from '../select-control';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';
import classnames from 'classnames';
import { isEmpty, cloneDeep, isEqual, findIndex } from 'lodash';

/**
 * Icons
 */
import { moveRight, toolbarDrop, toolbarShow } from '../../icons';
import { handleSetAttributes } from '../../extensions/maxi-block/withMaxiProps';

/**
 * Component
 */
const LayerCard = props => {
	const {
		onChange,
		onOpen,
		isOpen,
		onRemove,
		clientId,
		breakpoint,
		isHover,
		handleOnChangeLayer,
	} = props;
	const layer = cloneDeep(props.layer);
	const { type } = layer;

	const classes = classnames(
		'maxi-background-layer',
		isOpen && 'maxi-background-layer__open'
	);

	const regexLineToChange = new RegExp('fill=".+?(?=")');
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

				return {
					background: !isEmpty(bgImageURL)
						? `url(${bgImageURL})`
						: '',
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

	const layerContent = {
		color: (
			<ColorLayer
				key={`background-color-layer--${layer.order}`}
				colorOptions={layer}
				onChange={obj =>
					onChange({ ...layer, ...handleOnChangeLayer(obj, layer) })
				}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		image: (
			<ImageLayer
				key={`background-image-layer--${layer.order}`}
				imageOptions={layer}
				onChange={obj =>
					onChange({ ...layer, ...handleOnChangeLayer(obj, layer) })
				}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		video: (
			<VideoLayer
				key={`background-video-layer--${layer.order}`}
				videoOptions={layer}
				onChange={obj =>
					onChange({ ...layer, ...handleOnChangeLayer(obj, layer) })
				}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		gradient: (
			<GradientLayer
				key={`background-gradient-layer--${layer.order}`}
				gradientOptions={layer}
				onChange={obj =>
					onChange({ ...layer, ...handleOnChangeLayer(obj, layer) })
				}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		shape: (
			<SVGLayer
				key={`background-SVG-layer--${layer.order}`}
				SVGOptions={layer}
				onChange={obj =>
					onChange({ ...layer, ...handleOnChangeLayer(obj, layer) })
				}
				layerOrder={layer.order}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
	};

	return (
		<div className={classes}>
			<div
				className='maxi-background-layer__row'
				onClick={({ target }) => {
					if (
						!target
							?.closest('span')
							?.classList?.contains(
								'maxi-background-layer__ignore-open'
							)
					)
						onOpen(!!isOpen);
				}}
			>
				<span className='maxi-background-layer__arrow'>
					{moveRight}
				</span>
				<div className='maxi-background-layer__title'>
					<span className='maxi-background-layer__title__id' />
					<span className='maxi-background-layer__title__text'>
						<span
							className='maxi-background-layer__preview'
							style={previewStyles(type)}
						>
							{type === 'shape' &&
								layer['background-svg-SVGElement'] && (
									<RawHTML>{newSvgElement}</RawHTML>
								)}
						</span>
						{getTitle(type)}
					</span>
					{breakpoint === 'general' && (
						<span
							className={classnames(
								'maxi-background-layer__title__mover',
								'maxi-background-layer__ignore-open'
							)}
						>
							<Icon icon={toolbarDrop} />
						</span>
					)}
					<span
						className={classnames(
							'maxi-background-layer__title__display',
							`maxi-background-layer__title__display--${getIsDisplayed()}`,
							'maxi-background-layer__ignore-move',
							'maxi-background-layer__ignore-open'
						)}
						onClick={onChangeDisplay}
					>
						<Icon icon={toolbarShow} />
					</span>
					{(!isHover || (isHover && layer.isHover)) && (
						<span
							className={classnames(
								'maxi-background-layer__title__remover',
								'maxi-background-layer__ignore-move',
								'maxi-background-layer__ignore-open'
							)}
							onClick={onRemove}
						/>
					)}
				</div>
			</div>
			{isOpen && (
				<div className='maxi-background-layer__content maxi-background-layer__ignore-move'>
					{layerContent[type]}
				</div>
			)}
		</div>
	);
};

const BackgroundLayersControl = ({
	layersOptions,
	layersHoverOptions,
	isHover = false,
	onChange,
	clientId,
	breakpoint,
}) => {
	const layers = cloneDeep(layersOptions);
	const layersHover = cloneDeep(layersHoverOptions);
	const allLayers = [...layers, ...layersHover];

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

	// WILL BE DELETED AFTER BACKGROUND LAYERS ARE UPDATED
	if (!allLayers.every(layer => layer.order)) {
		allLayers.forEach((layer, index, array) => {
			layer.order = getLayerUniqueParameter('order', array);
		});

		const normalLayers = allLayers.filter(layer => !layer.isHover);
		const hoverLayers = allLayers.filter(layer => layer.isHover);

		onChange({
			'background-layers': normalLayers,
			'background-layers-hover': hoverLayers,
		});
	}
	//

	allLayers.sort((a, b) => a.order - b.order);

	const [selector, changeSelector] = useState(null);

	const getLayerLabel = type => {
		switch (type) {
			case 'color':
				return 'colorOptions';
			case 'image':
				return 'imageOptions';
			case 'video':
				return 'videoOptions';
			case 'gradient':
				return 'gradientOptions';
			case 'shape':
				return 'SVGOptions';
			default:
				return false;
		}
	};

	const getObject = type => {
		return {
			...setBreakpointToLayer({
				layer: backgroundLayers[getLayerLabel(type)],
				breakpoint,
				isHover,
			}),
			order: getLayerUniqueParameter('order'),
			id: getLayerUniqueParameter('id'),
		};
	};

	const onLayersDrag = (fromIndex, toIndex) => {
		const layer = allLayers.splice(fromIndex, 1)[0];

		allLayers.splice(toIndex, 0, layer);

		allLayers.forEach((layer, i) => {
			allLayers[i].order = i;
		});

		const normalLayers = allLayers.filter(layer => !layer.isHover);
		const hoverLayers = allLayers.filter(layer => layer.isHover);

		onChange({
			'background-layers': normalLayers,
			'background-layers-hover': hoverLayers,
		});
	};

	const handleOnChangeLayer = (layer, currentLayer) =>
		handleSetAttributes({
			obj: layer,
			attributes: currentLayer,
			onChange: result => result,
			defaultAttributes: setBreakpointToLayer({
				layer: backgroundLayers[getLayerLabel(currentLayer.type)],
				breakpoint,
				isHover,
			}),
		});

	const onChangeLayer = layer => {
		const isHoverLayer = layer.isHover;
		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers);

		allLayers.forEach((lay, i) => {
			if (lay.order === layer.order) {
				const index = findIndex(newLayers, { order: layer.order });

				newLayers[index] = layer;
			}
		});

		if (!isEqual(newLayers, isHoverLayer ? layersHover : layers))
			onChange({
				[`background-layers${isHoverLayer ? '-hover' : ''}`]: newLayers,
			});
	};

	const onAddLayer = layer => {
		const isHoverLayer = layer.isHover;
		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers);

		newLayers.push(layer);

		onChange({
			[`background-layers${isHoverLayer ? '-hover' : ''}`]: newLayers,
		});
	};

	const onRemoveLayer = ({ order, isHover: isHoverLayer }) => {
		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers).filter(
			lay => lay.order !== order
		);

		onChange({
			[`background-layers${isHover ? '-hover' : ''}`]: newLayers,
		});

		changeSelector(null);
	};

	return (
		<div className='maxi-background-control__layers'>
			<div>
				{!isEmpty(allLayers) && (
					<ReactDragListView
						onDragEnd={(fromIndex, toIndex) =>
							onLayersDrag(fromIndex, toIndex)
						}
						nodeSelector='div.maxi-background-layer'
						handleSelector='span.maxi-background-layer__title__mover'
						ignoreSelector='.maxi-background-layer__ignore-move'
					>
						<div className='maxi-background-layers_options'>
							{[...(!isHover ? layers : allLayers)].map(
								(layer, i) => (
									<LayerCard
										key={`maxi-background-layers__${
											layer.order
										}${isHover ? '--hover' : ''}`}
										isHover={isHover}
										clientId={clientId}
										layer={layer}
										onChange={onChangeLayer}
										onOpen={isOpen => {
											if (isOpen) changeSelector(null);
											else
												selector !== layer.order
													? changeSelector(
															layer.order
													  )
													: changeSelector(null);
										}}
										isOpen={selector === layer.order}
										onRemove={() => {
											onRemoveLayer(layer);
										}}
										breakpoint={breakpoint}
										handleOnChangeLayer={
											handleOnChangeLayer
										}
									/>
								)
							)}
						</div>
					</ReactDragListView>
				)}
				<SelectControl
					className='maxi-background-control__add-layer'
					value='Add new layer'
					options={[
						{
							label: __('Add new layer', 'maxi-blocks'),
							value: 'normal',
						},
						{
							label: __('Background color', 'maxi-blocks'),
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

						changeSelector(newLayer.order);
					}}
				/>
			</div>
		</div>
	);
};

export default BackgroundLayersControl;
