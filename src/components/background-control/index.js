/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorLayer from './colorLayer';
import { ImageLayerClosed, ImageLayerOpened } from './imageLayer';
import { VideoLayerClosed, VideoLayerOpened } from './videoLayer';
import GradientLayer from './gradientLayer';
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject, pullAt } from 'lodash';

/**
 * Styles and icons
 */
import {
	styleNone,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
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
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableClipPath = false,
		onChange,
	} = props;

	const [isOpen, setIsOpen] = useState(false);
	const [selector, setSelector] = useState(0);

	const value = !isObject(background) ? JSON.parse(background) : background;

	const defaultValue = !isObject(defaultBackground)
		? JSON.parse(defaultBackground)
		: defaultBackground;

	const classes = classnames(
		'maxi-background-control',
		className,
		isOpen ? 'maxi-background-control__open' : null
	);

	const onOpenOptions = (e, i = null) => {
		e.stopPropagation();
		setIsOpen(true);
		if (i) setSelector(i);
	};

	const onDoneEdition = () => {
		setIsOpen(false);
		setSelector(0);
	};

	const onRemoveImage = () => {
		pullAt(value.imageOptions, selector);
		onChange(JSON.stringify(value));
		onDoneEdition();
	};

	const getAlternativeImage = i => {
		try {
			return {
				source_url:
					value.imageOptions.items[i].imageData.cropOptions.image
						.source_url,
				width:
					value.imageOptions.items[i].imageData.cropOptions.image
						.width,
				height:
					value.imageOptions.items[i].imageData.cropOptions.image
						.height,
			};
		} catch (error) {
			return false;
		}
	};

	const getOptions = () => {
		const options = [
			{ label: <Icon icon={styleNone} />, value: '' },
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
		];

		return options;
	};

	return (
		<div className={classes}>
			{getOptions().length > 1 && (
				<__experimentalFancyRadioControl
					label={__('Background', 'maxi-blocks')}
					selected={value.activeMedia}
					options={getOptions()}
					onChange={item => {
						isOpen && setIsOpen(false);
						value.activeMedia = item;
						if (isEmpty(item)) value.colorOptions.activeColor = '';
						if (item === 'color')
							value.colorOptions.activeColor =
								value.colorOptions.color;
						if (item === 'gradient')
							value.colorOptions.activeColor =
								value.colorOptions.gradient;

						onChange(JSON.stringify(value));
					}}
				/>
			)}
			{!isOpen && (
				<Fragment>
					{!disableColor && value.activeMedia === 'color' && (
						<ColorLayer
							colorOptions={value.colorOptions}
							defaultColorOptions={defaultValue.colorOptions}
							onChange={colorOptions => {
								value.colorOptions = colorOptions;

								onChange(JSON.stringify(value));
							}}
							disableClipPath={disableClipPath}
						/>
					)}
					{!disableImage && value.activeMedia === 'image' && (
						<ImageLayerClosed
							imageOptions={value.imageOptions}
							defaultImageOptions={defaultValue.imageOptions}
							onChange={imageOptions => {
								value.imageOptions = imageOptions;

								onChange(JSON.stringify(value));
							}}
							disableClipPath={disableClipPath}
							onOpenOptions={onOpenOptions}
							onRemoveImage={onRemoveImage}
							getAlternativeImage={getAlternativeImage}
							selector={selector}
						/>
					)}
					{!disableVideo && value.activeMedia === 'video' && (
						<VideoLayerClosed
							videoOptions={value.videoOptions}
							defaultVideoOptions={defaultValue.videoOptions}
							onChange={videoOptions => {
								value.videoOptions = videoOptions;

								onChange(JSON.stringify(value));
							}}
							disableClipPath={disableClipPath}
							onOpenOptions={onOpenOptions}
						/>
					)}
					{!disableGradient && value.activeMedia === 'gradient' && (
						<GradientLayer
							colorOptions={value.colorOptions}
							defaultColorOptions={defaultValue.colorOptions}
							onChange={colorOptions => {
								value.colorOptions = colorOptions;

								onChange(JSON.stringify(value));
							}}
							disableClipPath={disableClipPath}
						/>
					)}
				</Fragment>
			)}
			{isOpen && value.activeMedia === 'image' && (
				<ImageLayerOpened
					imageOptions={value.imageOptions}
					defaultImageOptions={defaultValue.imageOptions}
					onChange={imageOptions => {
						value.imageOptions = imageOptions;

						onChange(JSON.stringify(value));
					}}
					onDoneEdition={onDoneEdition}
					onRemoveImage={onRemoveImage}
					getAlternativeImage={getAlternativeImage}
					selector={selector}
				/>
			)}
			{isOpen &&
				value.activeMedia === 'video' &&
				value.videoOptions.mediaURL && (
					<VideoLayerOpened
						videoOptions={value.videoOptions}
						defaultVideoOptions={defaultValue.videoOptions}
						onChange={videoOptions => {
							value.videoOptions = videoOptions;

							onChange(JSON.stringify(value));
						}}
						onDoneEdition={onDoneEdition}
						onRemoveImage={onRemoveImage}
					/>
				)}
		</div>
	);
};

export default BackgroundControl;
