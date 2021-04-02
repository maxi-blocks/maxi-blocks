/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';
import LoaderControl from '../loader-control';
import * as backgroundLayers from './layers';
import ColorLayer from './colorLayer';
import ImageLayer from './imageLayer';
import VideoLayer from './videoLayer';
import GradientLayer from './gradientLayer';
import SVGLayer from './svgLayer';
import { getGroupAttributes, getAttributeKey } from '../../extensions/styles';

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
	const { onChange, onOpen, isOpen, onRemove } = props;
	const layer = cloneDeep(props.layer);
	const { type } = layer;

	const classes = classnames(
		'maxi-background-layer',
		isOpen && 'maxi-background-layer__open'
	);

	const previewStyles = type => {
		switch (type) {
			case 'color':
				return {
					background: layer['background-color'],
				};
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
									<RawHTML>
										{layer['background-svg-SVGElement']}
									</RawHTML>
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
							/>
						))}
				</div>
			)}
		</div>
	);
};

const BackgroundLayersControl = ({
	isHover = false,
	prefix = '',
	onChange,
	layersStatus,
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

	return (
		<div className='maxi-background-control__layers'>
			<FancyRadioControl
				label={__('Use layers', 'maxi-blocks')}
				selected={layersStatus}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-layers-status',
							isHover,
							prefix
						)]: !!+val,
						[getAttributeKey(
							'background-active-media',
							isHover,
							prefix
						)]: !!+val ? 'layers' : '',
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
