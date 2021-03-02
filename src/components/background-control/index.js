/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import BackgroundLayersControl from './backgroundLayersControl';
import FancyRadioControl from '../fancy-radio-control';
import ColorLayer from './colorLayer';
import ImageLayer from './imageLayer';
import VideoLayer from './videoLayer';
import GradientLayer from './gradientLayer';
import SVGLayer from './svgLayer';
import { getGroupAttributes, getAttributeKey } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import {
	styleNone,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	shape,
} from '../../icons';
import './editor.scss';

/**
 * Components
 */
const BackgroundControl = props => {
	const {
		className,
		disableLayers = false,
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableClipPath = false,
		disableSVG = false,
		disableNoneStyle = false,
		onChange,
		isHover = false,
		prefix = '',
	} = props;

	const backgroundActiveMedia =
		props[getAttributeKey('background-active-media', isHover, prefix)];
	const layersOptions =
		props[getAttributeKey('background-layers', isHover, prefix)] || [];
	const layersStatus =
		props[getAttributeKey('background-layers-status', isHover, prefix)];

	const classes = classnames('maxi-background-control', className);

	const getOptions = () => {
		const options = [
			...(!disableNoneStyle && [
				{
					label: <Icon icon={styleNone} />,
					value: '',
				},
			]),
			...(!disableColor && [
				{
					label: <Icon icon={backgroundColor} />,
					value: 'color',
				},
			]),
			...(!disableImage && [
				{
					label: <Icon icon={backgroundImage} />,
					value: 'image',
				},
			]),
			...(!disableVideo && [
				{
					label: <Icon icon={backgroundVideo} />,
					value: 'video',
				},
			]),
			...(!disableGradient && [
				{
					label: <Icon icon={backgroundGradient()} />,
					value: 'gradient',
				},
			]),
			...(!disableSVG && [
				{
					label: <Icon icon={shape} />,
					value: 'svg',
				},
			]),
		];

		return options;
	};

	return (
		<div className={classes}>
			{!disableLayers && (
				<BackgroundLayersControl
					layersOptions={layersOptions}
					layersStatus={layersStatus}
					onChange={obj => onChange(obj)}
					isHover={isHover}
					prefix={prefix}
				/>
			)}
			{!layersStatus && getOptions().length > 1 && (
				<FancyRadioControl
					label={__('Background', 'maxi-blocks')}
					fullWidthMode
					selected={backgroundActiveMedia || ''}
					options={getOptions()}
					attr={getAttributeKey(
						'background-active-media',
						isHover,
						prefix
					)}
					onChange={obj => onChange(obj)}
				/>
			)}
			{!layersStatus && (
				<Fragment>
					{!disableColor && backgroundActiveMedia === 'color' && (
						<ColorLayer
							colorOptions={{
								...getGroupAttributes(
									props,
									'backgroundColor',
									isHover,
									prefix
								),
							}}
							onChange={obj => onChange(obj)}
							disableClipPath={disableClipPath}
							isHover={isHover}
							prefix={prefix}
						/>
					)}
					{!disableImage && backgroundActiveMedia === 'image' && (
						<ImageLayer
							imageOptions={{
								...getGroupAttributes(
									props,
									'backgroundImage',
									isHover,
									prefix
								),
							}}
							onChange={obj => onChange(obj)}
							disableClipPath={disableClipPath}
							isHover={isHover}
							prefix={prefix}
						/>
					)}
					{!disableVideo && backgroundActiveMedia === 'video' && (
						<VideoLayer
							videoOptions={{
								...getGroupAttributes(
									props,
									'backgroundVideo',
									isHover,
									prefix
								),
							}}
							onChange={obj => onChange(obj)}
							disableClipPath={disableClipPath}
							isHover={isHover}
							prefix={prefix}
						/>
					)}
					{!disableGradient && backgroundActiveMedia === 'gradient' && (
						<GradientLayer
							gradientOptions={{
								...getGroupAttributes(
									props,
									'backgroundGradient',
									isHover,
									prefix
								),
							}}
							onChange={obj => onChange(obj)}
							disableClipPath={disableClipPath}
							isHover={isHover}
							prefix={prefix}
						/>
					)}
					{!disableSVG && backgroundActiveMedia === 'svg' && (
						<SVGLayer
							SVGOptions={{
								...getGroupAttributes(
									props,
									'backgroundSVG',
									isHover,
									prefix
								),
							}}
							onChange={obj => onChange(obj)}
							isHover={isHover}
							prefix={prefix}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default BackgroundControl;
