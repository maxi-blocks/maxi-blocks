/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getAttributeKey,
	getBlockStyle,
	getColorRGBAString,
} from '../../extensions/styles';
import * as backgroundLayers from './layers';
import ColorLayer from './colorLayer';
import GradientLayer from './gradientLayer';
import Icon from '../icon';
import ImageLayer from './imageLayer';
import LoaderControl from '../loader-control';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';
import classnames from 'classnames';
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Styles and icons
 */
import { moveRight, toolbarSizing } from '../../icons';

/**
 * Component
 */
const LayerCard = props => {
	const { onChange, onOpen, isOpen, onRemove, layerId, clientId, isButton } =
		props;
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
				const colorStr = getColorRGBAString({
					firstVal: `color-${layer['background-palette-color']}`,
					opacity: layer['background-palette-opacity'],
					blockStyle: getBlockStyle(clientId),
				});

				return {
					background: layer['background-palette-color-status']
						? colorStr
						: layer['background-color'],
				};
			}
			case 'gradient':
				return {
					background: layer['background-gradient'],
				};
			case 'image':
				return {
					background: `url(${layer['background-image-mediaURL']})`,
				};
			case 'video':
				return {
					background: `url(${layer['background-video-fallbackURL']})`,
				};
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

	return (
		<div className={classes}>
			<div
				className='maxi-background-layer__row'
				onClick={() => onOpen(!!isOpen)}
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
					<span className='maxi-background-layer__title__mover'>
						<Icon icon={toolbarSizing} />
					</span>
					<span
						className='maxi-background-layer__title__remover'
						onClick={onRemove}
					/>
				</div>
			</div>
			{isOpen && (
				<div className='maxi-background-layer__content'>
					{(type === 'color' && (
						<ColorLayer
							colorOptions={{
								...getGroupAttributes(layer, 'backgroundColor'),
							}}
							onChange={obj => onChange({ ...layer, ...obj })}
							type='layer'
							isButton={isButton}
						/>
					)) ||
						(type === 'image' && (
							<ImageLayer
								imageOptions={{
									...getGroupAttributes(
										layer,
										'backgroundImage'
									),
								}}
								onChange={obj => onChange({ ...layer, ...obj })}
							/>
						)) ||
						(type === 'video' && (
							<VideoLayer
								videoOptions={{
									...getGroupAttributes(
										layer,
										'backgroundVideo'
									),
								}}
								onChange={obj => onChange({ ...layer, ...obj })}
							/>
						)) ||
						(type === 'gradient' && (
							<GradientLayer
								gradientOptions={{
									...getGroupAttributes(
										layer,
										'backgroundGradient'
									),
								}}
								onChange={obj => onChange({ ...layer, ...obj })}
							/>
						)) ||
						(type === 'shape' && (
							<SVGLayer
								SVGOptions={{
									...getGroupAttributes(
										layer,
										'backgroundSVG'
									),
								}}
								onChange={obj => onChange({ ...layer, ...obj })}
								layerId={layerId}
							/>
						))}
				</div>
			)}
		</div>
	);
};

const BackgroundLayersControl = ({
	isHover = false,
	isButton = false,
	prefix = '',
	onChange,
	layersStatus,
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
	clientId,
	...props
}) => {
	const layers = cloneDeep(props.layersOptions);
	layers.sort((a, b) => a.id - b.id);

	const [selector, changeSelector] = useState(null);

	const getObject = type => {
		switch (type) {
			case 'color':
				return {
					...backgroundLayers.colorOptions,
					id: layers.length,
				};
			case 'image':
				return {
					...backgroundLayers.imageOptions,
					id: layers.length,
				};
			case 'video':
				return {
					...backgroundLayers.videoOptions,
					id: layers.length,
				};
			case 'gradient':
				return {
					...backgroundLayers.gradientOptions,
					id: layers.length,
				};
			case 'shape':
				return {
					...backgroundLayers.SVGOptions,
					id: layers.length,
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

		!disableColor &&
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
			<ToggleSwitch
				label={__('Use layers', 'maxi-blocks')}
				selected={layersStatus}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-layers-status',
							isHover,
							prefix
						)]: val,
						[getAttributeKey(
							'background-active-media',
							isHover,
							prefix
						)]: val ? 'layers' : '',
					})
				}
			/>
			{layersStatus && (
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
									[getAttributeKey(
										'background-layers',
										isHover,
										prefix
									)]: layers,
								});
							}}
							nodeSelector='div.maxi-background-layer'
							handleSelector='span.maxi-background-layer__title__mover'
							ignoreSelector='div.maxi-background-layer__content'
						>
							<div className='maxi-background-layers_options'>
								{layers.map((layer, i) => (
									<LayerCard
										key={`maxi-background-layers__${layer.id}`}
										layerId={layer.id}
										isButton={isButton}
										clientId={clientId}
										layer={layer}
										onChange={layer => {
											layers[layer.id] = layer;

											onChange({
												[getAttributeKey(
													'background-layers',
													isHover,
													prefix
												)]: layers,
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
												[getAttributeKey(
													'background-layers',
													isHover,
													prefix
												)]: layers,
												...(layers.length === 0 && {
													[getAttributeKey(
														'background-active-media',
														isHover,
														prefix
													)]: 'none',
												}),
											});
										}}
									/>
								))}
							</div>
						</ReactDragListView>
					)}
					<LoaderControl
						options={getOptions()}
						onClick={value => {
							layers.push(getObject(value));

							onChange({
								[getAttributeKey(
									'background-layers',
									isHover,
									prefix
								)]: layers,
								...(layers.length > 0 && {
									[getAttributeKey(
										'background-active-media',
										isHover,
										prefix
									)]: 'layers',
								}),
							});
						}}
						forwards
					/>
				</div>
			)}
		</div>
	);
};

export default BackgroundLayersControl;
