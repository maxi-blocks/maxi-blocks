/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState } = wp.element;

/**
 * Internal dependencies
 */
import __experimentalFancyRadioControl from '../fancy-radio-control';
import __experimentalLoaderControl from '../loader-control';
import * as backgroundLayers from './layers';
import ColorLayer from './colorLayer';
import ImageLayer from './imageLayer';
import VideoLayer from './videoLayer';
import GradientLayer from './gradientLayer';
import SVGLayer from './svgLayer';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import { moveRight } from '../../icons';

/**
 * Component
 */
const LayerCard = props => {
	const { layer, onChange, onOpen, isOpen, onRemove } = props;
	const { title, type } = layer;

	const classes = classnames(
		'maxi-background-layer',
		isOpen && 'maxi-background-layer__open'
	);

	return (
		<div className={classes}>
			<div
				className='maxi-background-layer__row'
				onClick={() => onOpen(!!isOpen)}
			>
				<span className='maxi-background-layer__arrow'>
					{moveRight}
				</span>
				<p className='maxi-background-layer__title'>
					<span className='maxi-background-layer__title__id'></span>
					<span className='maxi-background-layer__title__text'>
						{title}
					</span>
					<span
						className='maxi-background-layer__title__remover'
						onClick={onRemove}
					/>
				</p>
			</div>
			{isOpen && (
				<div className='maxi-background-layer__content'>
					{(type === 'color' && (
						<ColorLayer
							colorOptions={layer.options}
							defaultColorOptions={
								backgroundLayers.colorOptions.options
							}
							onChange={layerOptions => {
								layer.options = layerOptions;

								onChange(layer);
							}}
						/>
					)) ||
						(type === 'image' && (
							<ImageLayer
								imageOptions={layer.options}
								defaultImageOptions={
									backgroundLayers.imageOptions.options
								}
								onChange={layerOptions => {
									layer.options = layerOptions;

									onChange(layer);
								}}
							/>
						)) ||
						(type === 'video' && (
							<VideoLayer
								videoOptions={layer.options}
								defaultVideoOptions={
									backgroundLayers.videoOptions.options
								}
								onChange={layerOptions => {
									layer.options = layerOptions;

									onChange(layer);
								}}
							/>
						)) ||
						(type === 'gradient' && (
							<GradientLayer
								colorOptions={layer.options}
								defaultColorOptions={
									backgroundLayers.gradientOptions.options
								}
								onChange={layerOptions => {
									layer.options = layerOptions;

									onChange(layer);
								}}
							/>
						)) ||
						(type === 'shape' && (
							<SVGLayer
								SVGOptions={layer.options}
								defaultSVGOptions={
									backgroundLayers.SVGOptions.options
								}
								onChange={layerOptions => {
									layer.options = layerOptions;

									onChange(layer);
								}}
							/>
						))}
				</div>
			)}
		</div>
	);
};

const BackgroundLayersControl = props => {
	const { layersOptions, onChange } = props;
	const { status, layers } = layersOptions;

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

	return (
		<div className='maxi-background-control__layers'>
			<__experimentalFancyRadioControl
				label={__('Use layers', 'maxi-blocks')}
				selected={status}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					layersOptions.status = +val;

					onChange(layersOptions);
				}}
			/>
			{!!status && (
				<div>
					{!isEmpty(layers) && (
						<ReactDragListView
							onDragEnd={(fromIndex, toIndex) => {
								let layer = layers.splice(fromIndex, 1)[0];
								layers.splice(toIndex, 0, layer);
								onChange(layersOptions);
							}}
							nodeSelector='div.maxi-background-layer'
							handleSelector='div.maxi-background-layer__row'
							ignoreSelector='div.maxi-background-layer__content'
						>
							<div className='maxi-background-layers'>
								{layers.map((layer, i) => (
									<LayerCard
										key={`maxi-background-layers__${layer.id}`}
										layer={layer}
										onChange={layer => {
											layersOptions.layers[i] = layer;

											onChange(layersOptions);
										}}
										onOpen={isOpen => {
											if (isOpen) changeSelector(null);
											else
												selector !== i
													? changeSelector(i)
													: changeSelector(null);
										}}
										isOpen={selector === i}
										onRemove={() => {
											layers.splice(i, 1);

											onChange(layersOptions);
										}}
									/>
								))}
							</div>
						</ReactDragListView>
					)}
					<__experimentalLoaderControl
						options={[
							{
								label: __('Background Colour', 'maxi-blocks'),
								value: 'color',
							},
							{
								label: __('Background Image', 'maxi-blocks'),
								value: 'image',
							},
							{
								label: __('Background Video', 'maxi-blocks'),
								value: 'video',
							},
							{
								label: __('Background Gradient', 'maxi-blocks'),
								value: 'gradient',
							},
							{
								label: __('Background Shape', 'maxi-blocks'),
								value: 'shape',
							},
						]}
						onClick={value => {
							layersOptions.layers.unshift(getObject(value));
							onChange(layersOptions);
						}}
						forwards
					/>
				</div>
			)}
		</div>
	);
};

export default BackgroundLayersControl;
