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
import __experimentalFancyRadioControl from '../fancy-radio-control';
import ColorLayer from './colorLayer';
import ImageLayer from './imageLayer';
import VideoLayer from './videoLayer';
import GradientLayer from './gradientLayer';
import SVGLayer from './svgLayer';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject } from 'lodash';

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
		background,
		defaultBackground,
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

	const backgroundValue = !isObject(background)
		? JSON.parse(background)
		: background;

	const backgroundDefaultValue = !isObject(defaultBackground)
		? JSON.parse(defaultBackground)
		: defaultBackground;

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
					layersOptions={backgroundValue.layersOptions}
					onChange={layersOptions => {
						backgroundValue.layersOptions = layersOptions;
						onChange(JSON.stringify(backgroundValue));
					}}
				/>
			)}
			{getOptions().length > 1 && !backgroundValue.layersOptions.status && (
				<__experimentalFancyRadioControl
					label={__('Background', 'maxi-blocks')}
					fullWidthMode
					selected={backgroundValue.activeMedia}
					options={getOptions()}
					onChange={item => {
						backgroundValue.activeMedia = item;
						if (isEmpty(item))
							backgroundValue.colorOptions.activeColor = '';
						if (item === 'color')
							backgroundValue.colorOptions.activeColor =
								backgroundValue.colorOptions.color;
						if (item === 'gradient')
							backgroundValue.colorOptions.activeColor =
								backgroundValue.colorOptions.gradient;

						onChange(JSON.stringify(backgroundValue));
					}}
				/>
			)}
			{!backgroundValue.layersOptions.status && (
				<Fragment>
					{!disableColor && backgroundValue.activeMedia === 'color' && (
						<ColorLayer
							colorOptions={backgroundValue.colorOptions}
							defaultColorOptions={
								backgroundDefaultValue.colorOptions
							}
							onChange={colorOptions => {
								backgroundValue.colorOptions = colorOptions;

								onChange(JSON.stringify(backgroundValue));
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableImage && backgroundValue.activeMedia === 'image' && (
						<ImageLayer
							imageOptions={backgroundValue.imageOptions}
							defaultImageOptions={
								backgroundDefaultValue.imageOptions
							}
							onChange={imageOptions => {
								backgroundValue.imageOptions = imageOptions;

								onChange(JSON.stringify(backgroundValue));
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableVideo && backgroundValue.activeMedia === 'video' && (
						<VideoLayer
							videoOptions={backgroundValue.videoOptions}
							defaultVideoOptions={
								backgroundDefaultValue.videoOptions
							}
							onChange={videoOptions => {
								backgroundValue.videoOptions = videoOptions;

								onChange(JSON.stringify(backgroundValue));
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableGradient &&
						backgroundValue.activeMedia === 'gradient' && (
							<GradientLayer
								colorOptions={backgroundValue.colorOptions}
								defaultColorOptions={
									backgroundDefaultValue.colorOptions
								}
								onChange={colorOptions => {
									backgroundValue.colorOptions = colorOptions;

									onChange(JSON.stringify(backgroundValue));
								}}
								disableClipPath={disableClipPath}
							/>
						)}
					{!disableSVG && backgroundValue.activeMedia === 'svg' && (
						<SVGLayer
							SVGOptions={backgroundValue.SVGOptions}
							defaultSVGOptions={
								backgroundDefaultValue.SVGOptions
							}
							onChange={SVGOptions => {
								backgroundValue.SVGOptions = SVGOptions;

								onChange(JSON.stringify(backgroundValue));
							}}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default BackgroundControl;
