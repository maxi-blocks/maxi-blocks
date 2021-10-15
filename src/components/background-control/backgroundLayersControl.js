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
	getBlockStyle,
	getColorRGBAString,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as backgroundLayers from './layers';
import ColorLayer from './colorLayer';
import GradientLayer from './gradientLayer';
import Icon from '../icon';
import ImageLayer from './imageLayer';
import LoaderControl from '../loader-control';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';
import classnames from 'classnames';
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Styles and icons
 */
import { moveRight, toolbarSizing, toolbarShow } from '../../icons';

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
				const bgImageURL = getLastBreakpointAttribute(
					'background-image-mediaURL',
					breakpoint,
					layer,
					isHover
				);
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
				return __('Background Colour', 'maxi-blocks');
			case 'image':
				return __('Background Image', 'maxi-blocks');
			case 'video':
				return __('Background Video', 'maxi-blocks');
			case 'gradient':
				return __('Background Gradient', 'maxi-blocks');
			case 'shape':
				return __('Background Shape', 'maxi-blocks');
			default:
				return null;
		}
	};

	const onChangeDisplay = () => {
		const currentDisplay = getLastBreakpointAttribute(
			'display',
			breakpoint,
			layer
		);

		onChange({
			...layer,
			[`display-${breakpoint}`]:
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
			/>
		),
		image: (
			<ImageLayer
				key={`background-image-layer--${layer.id}`}
				imageOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
			/>
		),
		video: (
			<VideoLayer
				key={`background-video-layer--${layer.id}`}
				videoOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
			/>
		),
		gradient: (
			<GradientLayer
				key={`background-gradient-layer--${layer.id}`}
				gradientOptions={layer}
				onChange={obj => onChange({ ...layer, ...obj })}
				breakpoint={breakpoint}
				isHover={isHover}
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
					<span
						className={classnames(
							'maxi-background-layer__title__mover',
							'maxi-background-layer__ignore-open'
						)}
					>
						<Icon icon={toolbarSizing} />
					</span>
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
					<span
						className={classnames(
							'maxi-background-layer__title__remover',
							'maxi-background-layer__ignore-move',
							'maxi-background-layer__ignore-open'
						)}
						onClick={onRemove}
					/>
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
	isHover = false,
	onChange,
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
	clientId,
	breakpoint,
	hoverStatus = false,
}) => {
	const layers = cloneDeep(layersOptions);
	layers.sort((a, b) => a.id - b.id);

	const [selector, changeSelector] = useState(null);

	const setBreakpointToLayer = layer => {
		const response = {};

		const sameLabelAttr = [
			'type',
			'background-video-mediaID',
			'background-video-mediaURL',
			'background-video-startTime',
			'background-video-endTime',
			'background-video-loop',
			'background-svg-SVGElement',
			'background-svg-SVGData',
			'background-svg-SVGMediaID',
			'background-svg-SVGMediaURL',
		];

		Object.entries(layer).forEach(([key, val]) => {
			if (!sameLabelAttr.includes(key))
				response[getAttributeKey(key, false, false, breakpoint)] = val;
			if (isHover && !sameLabelAttr.includes(key))
				response[getAttributeKey(key, isHover, false, breakpoint)] =
					val;
			else response[key] = val;

			if (isHover && key === 'display')
				response['display-general'] = 'none';
			else if (key === 'display' && hoverStatus)
				response['display-general-hover'] = 'none';
		});

		return response;
	};

	const getNewLayerId = () =>
		layers && !isEmpty(layers)
			? layers.reduce((layerA, layerB) =>
					layerA.id > layerB.id ? layerA : layerB
			  ).id + 1
			: 1;

	const getObject = type => {
		switch (type) {
			case 'color':
				return {
					...setBreakpointToLayer(backgroundLayers.colorOptions),
					id: getNewLayerId(),
				};
			case 'image':
				return {
					...setBreakpointToLayer(backgroundLayers.imageOptions),
					id: getNewLayerId(),
				};
			case 'video':
				return {
					...setBreakpointToLayer(backgroundLayers.videoOptions),
					id: getNewLayerId(),
				};
			case 'gradient':
				return {
					...setBreakpointToLayer(backgroundLayers.gradientOptions),
					id: getNewLayerId(),
				};
			case 'shape':
				return {
					...setBreakpointToLayer(backgroundLayers.SVGOptions),
					id: getNewLayerId(),
				};
			default:
				break;
		}

		return false;
	};

	const getOptions = () => {
		const options = [];

		!disableColor &&
			options.push({
				label: __('Background Colour', 'maxi-blocks'),
				value: 'color',
			});

		!disableImage &&
			options.push({
				label: __('Background Image', 'maxi-blocks'),
				value: 'image',
			});

		!disableVideo &&
			options.push({
				label: __('Background Video', 'maxi-blocks'),
				value: 'video',
			});

		!disableGradient &&
			options.push({
				label: __('Background Gradient', 'maxi-blocks'),
				value: 'gradient',
			});

		!disableSVG &&
			options.push({
				label: __('Background Shape', 'maxi-blocks'),
				value: 'shape',
			});

		return options;
	};

	return (
		<div className='maxi-background-control__layers'>
			<div>
				{!isEmpty(layers) && (
					<ReactDragListView
						onDragEnd={(fromIndex, toIndex) => {
							const layer = layers.splice(fromIndex, 1)[0];
							layers.splice(toIndex, 0, layer);

							layers.forEach((layer, i) => {
								layers[i].id = i;
							});

							onChange({
								'background-layers': layers,
							});
						}}
						nodeSelector='div.maxi-background-layer'
						handleSelector='span.maxi-background-layer__title__mover'
						ignoreSelector='.maxi-background-layer__ignore-move'
					>
						<div className='maxi-background-layers_options'>
							{layers.map((layer, i) => (
								<LayerCard
									key={`maxi-background-layers__${layer.id}${
										isHover ? '--hover' : ''
									}`}
									layerId={layer.id}
									isHover={isHover}
									clientId={clientId}
									layer={layer}
									onChange={newLayer => {
										layers[i] = newLayer;

										onChange({
											'background-layers': layers,
										});
									}}
									onOpen={isOpen => {
										if (isOpen) changeSelector(null);
										else
											selector !== layer.id
												? changeSelector(layer.id)
												: changeSelector(null);
									}}
									isOpen={selector === layer.id}
									onRemove={() => {
										changeSelector(null);
										layers.splice(i, 1);

										onChange({
											'background-layers': layers,
										});
									}}
									breakpoint={breakpoint}
								/>
							))}
						</div>
					</ReactDragListView>
				)}
				<LoaderControl
					options={getOptions()}
					buttonText={__('Add New Layer', 'maxi-blocks')}
					onClick={value => {
						const newLayer = getObject(value);
						layers.push(newLayer);

						onChange({
							'background-layers': layers,
						});

						changeSelector(newLayer.id);
					}}
					forwards
					buttonLess
				/>
			</div>
		</div>
	);
};

export default BackgroundLayersControl;
