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

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

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
	} = props;

	const background = { ...props.background };
	const defaultBackground = { ...props.defaultBackground };

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
					layersOptions={background.layersOptions}
					onChange={layersOptions => {
						background.layersOptions = layersOptions;
						onChange(background);
					}}
				/>
			)}
			{getOptions().length > 1 && !background.layersOptions.status && (
				<FancyRadioControl
					label={__('Background', 'maxi-blocks')}
					fullWidthMode
					selected={background.activeMedia}
					options={getOptions()}
					onChange={item => {
						background.activeMedia = item;
						if (isEmpty(item))
							background.colorOptions.activeColor = '';
						if (item === 'color')
							background.colorOptions.activeColor =
								background.colorOptions.color;
						if (item === 'gradient')
							background.colorOptions.activeColor =
								background.colorOptions.gradient;

						onChange(background);
					}}
				/>
			)}
			{!background.layersOptions.status && (
				<Fragment>
					{!disableColor && background.activeMedia === 'color' && (
						<ColorLayer
							colorOptions={background.colorOptions}
							defaultColorOptions={defaultBackground.colorOptions}
							onChange={colorOptions => {
								background.colorOptions = colorOptions;

								onChange(background);
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableImage && background.activeMedia === 'image' && (
						<ImageLayer
							imageOptions={background.imageOptions}
							defaultImageOptions={defaultBackground.imageOptions}
							onChange={imageOptions => {
								background.imageOptions = imageOptions;

								onChange(background);
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableVideo && background.activeMedia === 'video' && (
						<VideoLayer
							videoOptions={background.videoOptions}
							defaultVideoOptions={defaultBackground.videoOptions}
							onChange={videoOptions => {
								background.videoOptions = videoOptions;

								onChange(background);
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableGradient && background.activeMedia === 'gradient' && (
						<GradientLayer
							colorOptions={background.colorOptions}
							defaultColorOptions={defaultBackground.colorOptions}
							onChange={colorOptions => {
								background.colorOptions = colorOptions;

								onChange(background);
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableSVG && background.activeMedia === 'svg' && (
						<SVGLayer
							SVGOptions={background.SVGOptions}
							defaultSVGOptions={defaultBackground.SVGOptions}
							onChange={SVGOptions => {
								background.SVGOptions = SVGOptions;

								onChange(background);
							}}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default BackgroundControl;
