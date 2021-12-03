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

/**
 * Component
 */
const LayerCard = props => {
	const {
		onChange,
		onOpen,
		isOpen,
		onRemove,
		layerId,
		clientId,
		breakpoint,
		isHover,
	} = props;
	const layer = cloneDeep(props.layer);
	const { type } = layer;

	const classes = classnames(
		'maxi-background-layer',
		isOpen && 'maxi-background-layer__open'
	);

	const regexLineToChange = new RegExp('fill=".+?(?=")');
	const colorStr = getColorRGBAString({
		firstVal: `color-${layer['background-palette-svg-color']}`,
		opacity: layer['background-palette-svg-opacity'],
		blockStyle: getBlockStyle(clientId),
	});
	const changeTo = `fill="${colorStr}"`;

	const newSvgElement = layer['background-palette-svg-color-status']
		? layer['background-svg-SVGElement']?.replace(
				regexLineToChange,
				changeTo
		  )
		: layer['background-svg-SVGElement'];

	const previewStyles = type => {
		switch (type) {
			case 'color': {
				const paletteStatus = getLastBreakpointAttribute(
					'background-palette-color-status',
					breakpoint,
					layer,
					isHover
				);

				if (paletteStatus) {
					const paletteColor = getLastBreakpointAttribute(
						'background-palette-color',
						breakpoint,
						layer,
						isHover
					);
					const paletteOpacity = getLastBreakpointAttribute(
						'background-palette-opacity',
						breakpoint,
						layer,
						isHover
					);

					return {
						background: getColorRGBAString({
							firstVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle: getBlockStyle(clientId),
						}),
					};
				}

				return {
					background: getLastBreakpointAttribute(
						'background-color',
						breakpoint,
						layer,
						isHover
					),
				};
			}
			case 'gradient': {
				const bgGradient = getLastBreakpointAttribute(
					'background-gradient',
					breakpoint,
					layer,
					isHover
				);
				const bgGradientOpacity = getLastBreakpointAttribute(
					'background-gradient-opacity',
					breakpoint,
					layer,
					isHover
				);
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
				const bgImageOpacity = getLastBreakpointAttribute(
					'background-image-opacity',
					breakpoint,
					layer,
					isHover
				);

				return {
					background: !isEmpty(bgImageURL)
						? `url(${bgImageURL})`
						: '',
					opacity: bgImageOpacity,
				};
			}
			case 'video': {
				const bgFallbackUrl = getLastBreakpointAttribute(
					'background-video-fallbackURL',
					breakpoint,
					layer,
					isHover
				);
				const bgVideoOpacity = getLastBreakpointAttribute(
					'background-video-opacity',
					breakpoint,
					layer,
					isHover
				);

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
		const currentDisplay = getLastBreakpointAttribute(
			'display',
			breakpoint,
			layer,
			isHover
		);

		onChange({
			...layer,
			[getAttributeKey('display', isHover, false, breakpoint)]:
				currentDisplay === 'block' ? 'none' : 'block',
		});
	};

	const getIsDisplayed = () => {
		const currentDisplay = getLastBreakpointAttribute(
			'display',
			breakpoint,
			layer,
			isHover
		);

		return currentDisplay === 'block' ? 'block' : 'none';
	};

	const layerContent = {
		color: (
			<ColorLayer
				key={`background-color-layer--${layer.id}`}
				colorOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		image: (
			<ImageLayer
				key={`background-image-layer--${layer.id}`}
				imageOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		video: (
			<VideoLayer
				key={`background-video-layer--${layer.id}`}
				videoOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		gradient: (
			<GradientLayer
				key={`background-gradient-layer--${layer.id}`}
				gradientOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
				isLayer
			/>
		),
		shape: (
			<SVGLayer
				key={`background-SVG-layer--${layer.id}`}
				SVGOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				layerId={layerId}
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

	allLayers.sort((a, b) => a.id - b.id);

	const [selector, changeSelector] = useState(null);

	const getNewLayerId = () =>
		allLayers && !isEmpty(allLayers)
			? allLayers.reduce((layerA, layerB) =>
					layerA.id > layerB.id ? layerA : layerB
			  ).id + 1
			: 1;

	const getObject = type => {
		switch (type) {
			case 'color':
				return {
					...setBreakpointToLayer({
						layer: backgroundLayers.colorOptions,
						breakpoint,
						isHover,
					}),
					id: getNewLayerId(),
				};
			case 'image':
				return {
					...setBreakpointToLayer({
						layer: backgroundLayers.imageOptions,
						breakpoint,
						isHover,
					}),
					id: getNewLayerId(),
				};
			case 'video':
				return {
					...setBreakpointToLayer({
						layer: backgroundLayers.videoOptions,
						breakpoint,
						isHover,
					}),
					id: getNewLayerId(),
				};
			case 'gradient':
				return {
					...setBreakpointToLayer({
						layer: backgroundLayers.gradientOptions,
						breakpoint,
						isHover,
					}),
					id: getNewLayerId(),
				};
			case 'shape':
				return {
					...setBreakpointToLayer({
						layer: backgroundLayers.SVGOptions,
						breakpoint,
						isHover,
					}),
					id: getNewLayerId(),
				};
			default:
				break;
		}

		return false;
	};

	const onLayersDrag = (fromIndex, toIndex) => {
		const layer = allLayers.splice(fromIndex, 1)[0];

		allLayers.splice(toIndex, 0, layer);

		allLayers.forEach((layer, i) => {
			allLayers[i].id = i;
		});

		const normalLayers = allLayers.filter(layer => !layer.isHover);
		const hoverLayers = allLayers.filter(layer => layer.isHover);

		onChange({
			'background-layers': normalLayers,
			'background-layers-hover': hoverLayers,
		});
	};

	const onChangeLayer = layer => {
		const isHoverLayer = layer.isHover;
		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers);

		allLayers.forEach((lay, i) => {
			if (lay.id === layer.id) {
				const index = findIndex(newLayers, { id: layer.id });

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

	const onRemoveLayer = ({ id, isHover: isHoverLayer }) => {
		const newLayers = cloneDeep(isHoverLayer ? layersHover : layers).filter(
			lay => lay.id !== id
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
											layer.id
										}${isHover ? '--hover' : ''}`}
										layerId={layer.id}
										isHover={isHover}
										clientId={clientId}
										layer={layer}
										onChange={onChangeLayer}
										onOpen={isOpen => {
											if (isOpen) changeSelector(null);
											else
												selector !== layer.id
													? changeSelector(layer.id)
													: changeSelector(null);
										}}
										isOpen={selector === layer.id}
										onRemove={() => {
											onRemoveLayer(layer);
										}}
										breakpoint={breakpoint}
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

						changeSelector(newLayer.id);
					}}
				/>
			</div>
		</div>
	);
};

export default BackgroundLayersControl;
