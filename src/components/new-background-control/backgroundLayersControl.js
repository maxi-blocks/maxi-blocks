/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState } = wp.element;

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
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getAttributeKey from '../../extensions/styles/getAttributeKey';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';
import classnames from 'classnames';
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Styles and icons
 */
import { moveRight } from '../../icons';

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
				<p className='maxi-background-layer__title'>
					<span className='maxi-background-layer__title__id' />
					<span className='maxi-background-layer__title__text'>
						{getTitle(type)}
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
	...props
}) => {
	const layersOptions = cloneDeep(props.layersOptions);

	const [selector, changeSelector] = useState(null);
	const [layersStatus, setLayersStatus] = useState(layersOptions.length > 0);

	const getObject = type => {
		switch (type) {
			case 'color':
				return {
					...backgroundLayers.colorOptions,
					id: layersOptions.length,
				};
			case 'image':
				return {
					...backgroundLayers.imageOptions,
					id: layersOptions.length,
				};
			case 'video':
				return {
					...backgroundLayers.videoOptions,
					id: layersOptions.length,
				};
			case 'gradient':
				return {
					...backgroundLayers.gradientOptions,
					id: layersOptions.length,
				};
			case 'shape':
				return {
					...backgroundLayers.SVGOptions,
					id: layersOptions.length,
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
				selected={+layersStatus}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => setLayersStatus(!!+val)}
			/>
			{layersStatus && (
				<div>
					{!isEmpty(layersOptions) && (
						<ReactDragListView
							onDragEnd={(fromIndex, toIndex) => {
								const layer = layersOptions.splice(
									fromIndex,
									1
								)[0];
								layersOptions.splice(toIndex, 0, layer);
								onChange({
									[getAttributeKey(
										'background-layers',
										isHover,
										prefix
									)]: layersOptions,
								});
							}}
							nodeSelector='div.maxi-background-layer'
							handleSelector='div.maxi-background-layer__row'
							ignoreSelector='div.maxi-background-layer__content'
						>
							<div className='maxi-background-layersOptions'>
								{layersOptions.map((layer, i) => (
									<LayerCard
										key={`maxi-background-layers__${layer.id}`}
										layer={layer}
										onChange={layer => {
											layersOptions[i] = layer;

											onChange({
												[getAttributeKey(
													'background-layers',
													isHover,
													prefix
												)]: layersOptions,
											});
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
											layersOptions.splice(i, 1);

											onChange({
												[getAttributeKey(
													'background-layers',
													isHover,
													prefix
												)]: layersOptions,
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
							layersOptions.unshift(getObject(value));

							onChange({
								[getAttributeKey(
									'background-layers',
									isHover,
									prefix
								)]: layersOptions,
								...(layersOptions.length > 0 && {
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
