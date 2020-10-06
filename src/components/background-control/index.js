/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { SelectControl, Button, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';
import MediaUploaderControl from '../media-uploader-control';
import ImageCropControl from '../image-crop-control';
import SettingTabsControl from '../setting-tabs-control';
import SizeControl from '../size-control';
import __experimentalClipPath from '../clip-path-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';
import __experimentalOpacityControl from '../opacity-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject, isNumber, pullAt } from 'lodash';

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

	const onAddBackground = () => {
		value.imageOptions.push(defaultValue.imageOptions[0]);
	};

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
					value.imageOptions[i].imageData.cropOptions.image
						.source_url,
				width: value.imageOptions[i].imageData.cropOptions.image.width,
				height:
					value.imageOptions[i].imageData.cropOptions.image.height,
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
						<Fragment>
							<ColorControl
								label={__('Background', 'maxi-blocks')}
								color={value.colorOptions.color}
								defaultColor={defaultValue.colorOptions.color}
								onChange={val => {
									value.colorOptions.color = val;
									value.colorOptions.activeColor = val;
									onChange(JSON.stringify(value));
								}}
							/>
							{!disableClipPath && (
								<__experimentalClipPath
									clipPath={value.colorOptions.clipPath}
									onChange={val => {
										value.colorOptions.clipPath = val;
										onChange(JSON.stringify(value));
									}}
								/>
							)}
						</Fragment>
					)}
					{!disableImage && value.activeMedia === 'image' && (
						<Fragment>
							{value.imageOptions.map((option, i) => (
								<MediaUploaderControl
									mediaID={option.imageData.mediaID}
									onSelectImage={imageData => {
										if (!isNumber(option.imageData.mediaID))
											onAddBackground();
										option.imageData.mediaID = imageData.id;
										option.imageData.mediaURL =
											imageData.url;
										onChange(JSON.stringify(value));
									}}
									onRemoveImage={() => {
										value.imageOptions[
											selector
										].imageData.mediaID = '';
										value.imageOptions[
											selector
										].imageData.mediaURL = '';
										onRemoveImage();
										onChange(JSON.stringify(value));
									}}
									placeholder={
										value.imageOptions.length - 1 === 0
											? __('Set image', 'maxi-blocks')
											: __(
													'Add Another Image',
													'maxi-blocks'
											  )
									}
									extendSelector={
										option.imageData.mediaID && (
											<Button
												isSecondary
												onClick={e =>
													onOpenOptions(e, i)
												}
												className='maxi-background-control__image-edit'
											>
												{__('Edit', 'maxi-blocks')}
											</Button>
										)
									}
									alternativeImage={getAlternativeImage(i)}
									removeButton={__('Remove', 'maxi-blocks')}
								/>
							))}
							{!disableClipPath && (
								<__experimentalClipPath
									clipPath={value.clipPathImage}
									onChange={val => {
										value.clipPathImage = val;
										onChange(JSON.stringify(value));
									}}
								/>
							)}
							<__experimentalOpacityControl
								label={__('Background Opacity', 'maxi-blocks')}
								opacity={value.imageOpacity.opacity}
								defaultOpacity={
									defaultValue.imageOpacity.opacity
								}
								onChange={val => {
									value.imageOpacity.opacity = JSON.parse(
										val
									);
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
					{!disableVideo && value.activeMedia === 'video' && (
						<div className='maxi-background-control__video'>
							<MediaUploaderControl
								allowedTypes={['video']}
								mediaType='video'
								mediaID={value.videoOptions.mediaID}
								onSelectImage={videoData => {
									value.videoOptions.mediaID = videoData.id;
									value.videoOptions.mediaURL = videoData.url;
									onChange(JSON.stringify(value));
								}}
								onRemoveImage={() => {
									value.videoOptions.mediaID = '';
									value.videoOptions.mediaURL = '';
									onChange(JSON.stringify(value));
								}}
								extendSelector={
									value.videoOptions.mediaID && (
										<Button
											isSecondary
											onClick={e => onOpenOptions(e)}
											className='maxi-background-control__video-edit'
										>
											{__('Edit', 'maxi-blocks')}
										</Button>
									)
								}
								placeholder={__('Set Video', 'maxi-blocks')}
								replaceButton={__('Replace', 'maxi-blocks')}
								removeButton={__('Remove', 'maxi-blocks')}
							/>
							<__experimentalOpacityControl
								label={__('Video Opacity', 'maxi-blocks')}
								opacity={value.videoOptions.opacity}
								defaultOpacity={
									defaultValue.videoOptions.opacity
								}
								onChange={val => {
									value.videoOptions.opacity = JSON.parse(
										val
									);
									onChange(JSON.stringify(value));
								}}
							/>
							{!disableClipPath && (
								<__experimentalClipPath
									clipPath={value.videoOptions.clipPath}
									onChange={val => {
										value.videoOptions.clipPath = val;
										onChange(JSON.stringify(value));
									}}
								/>
							)}
						</div>
					)}
					{!disableGradient && value.activeMedia === 'gradient' && (
						<Fragment>
							<GradientControl
								label={__('Background', 'maxi-blocks')}
								gradient={value.colorOptions.gradient}
								gradientOpacity={
									value.colorOptions.gradientOpacity
								}
								defaultGradient={
									defaultValue.colorOptions.gradientOpacity
										.opacity
								}
								onChange={val => {
									value.colorOptions.gradient = val;
									value.colorOptions.activeColor = val;
									onChange(JSON.stringify(value));
								}}
								onChangeOpacity={() =>
									onChange(JSON.stringify(value))
								}
								gradientAboveBackground={
									value.colorOptions.gradientAboveBackground
								}
								onGradientAboveBackgroundChange={val => {
									value.colorOptions.gradientAboveBackground = val;
									onChange(JSON.stringify(value));
								}}
							/>
							{!disableClipPath && (
								<__experimentalClipPath
									clipPath={value.colorOptions.clipPath}
									onChange={val => {
										value.colorOptions.clipPath = val;
										onChange(JSON.stringify(value));
									}}
								/>
							)}
						</Fragment>
					)}
				</Fragment>
			)}
			{isOpen && value.activeMedia === 'image' && (
				<SettingTabsControl
					items={[
						{
							label: __('Image', 'maxi-blocks'),
							className: 'maxi-background-control__image-tab',
							uuid: 'maxi-background-control__image-tab',
							content: (
								<MediaUploaderControl
									mediaID={
										value.imageOptions[selector].imageData
											.mediaID
									}
									onSelectImage={imageData => {
										value.imageOptions[
											selector
										].imageData.mediaID = imageData.id;
										value.imageOptions[
											selector
										].imageData.mediaURL = imageData.url;
										onChange(JSON.stringify(value));
									}}
									onRemoveImage={() => {
										value.imageOptions[
											selector
										].imageData.mediaID = '';
										value.imageOptions[
											selector
										].imageData.mediaURL = '';
										onRemoveImage();
										onChange(JSON.stringify(value));
									}}
									extendSelector={
										<Button
											isSecondary
											onClick={onDoneEdition}
											className='maxi-background-control__done-edition'
										>
											{__('Done', 'maxi-blocks')}
										</Button>
									}
									replaceButton={__('Replace', 'maxi-blocks')}
									removeButton={__('Delete', 'maxi-blocks')}
									alternativeImage={getAlternativeImage(
										selector
									)}
								/>
							),
						},
						{
							label: __('Background', 'maxi-blocks'),
							className:
								'maxi-background-control__background-tab',
							content: (
								<Fragment>
									<SelectControl
										label={__(
											'Background size',
											'maxi-blocks'
										)}
										value={
											value.imageOptions[selector]
												.sizeSettings.size
										}
										options={[
											{
												label: __(
													'Auto',
													'maxi-blocks'
												),
												value: 'auto',
											},
											{
												label: __(
													'Cover',
													'maxi-blocks'
												),
												value: 'cover',
											},
											{
												label: __(
													'Contain',
													'maxi-blocks'
												),
												value: 'contain',
											},
											{
												label: __(
													'Custom',
													'maxi-blocks'
												),
												value: 'custom',
											},
										]}
										onChange={val => {
											value.imageOptions[
												selector
											].sizeSettings.size = val;
											onChange(JSON.stringify(value));
										}}
									/>
									{value.imageOptions[selector].sizeSettings
										.size === 'custom' && (
										<ImageCropControl
											mediaID={
												value.imageOptions[selector]
													.imageData.mediaID
											}
											cropOptions={
												value.imageOptions[selector]
													.imageData.cropOptions
													? value.imageOptions[
															selector
													  ].imageData.cropOptions
													: {}
											}
											onChange={cropOptions => {
												value.imageOptions[
													selector
												].imageData.cropOptions = cropOptions;
												onChange(JSON.stringify(value));
											}}
										/>
									)}
									<SelectControl
										label={__(
											'Background repeat',
											'maxi-blocks'
										)}
										value={
											value.imageOptions[selector].repeat
										}
										options={[
											{
												label: __(
													'Repeat',
													'maxi-blocks'
												),
												value: 'repeat',
											},
											{
												label: __(
													'No repeat',
													'maxi-blocks'
												),
												value: 'no-repeat',
											},
											{
												label: __(
													'Repeat X',
													'maxi-blocks'
												),
												value: 'repeat-x',
											},
											{
												label: __(
													'Repeat Y',
													'maxi-blocks'
												),
												value: 'repeat-y',
											},
											{
												label: __(
													'Space',
													'maxi-blocks'
												),
												value: 'space',
											},
											{
												label: __(
													'Round',
													'maxi-blocks'
												),
												value: 'round',
											},
										]}
										onChange={val => {
											value.imageOptions[
												selector
											].repeat = val;
											onChange(JSON.stringify(value));
										}}
									/>
									<SelectControl
										label={__(
											'Background position',
											'maxi-blocks'
										)}
										value={
											value.imageOptions[selector]
												.positionOptions.position
										}
										options={[
											{
												label: __(
													'Left top',
													'maxi-blocks'
												),
												value: 'left top',
											},
											{
												label: __(
													'Left center',
													'maxi-blocks'
												),
												value: 'left center',
											},
											{
												label: __(
													'Left bottom',
													'maxi-blocks'
												),
												value: 'left bottom',
											},
											{
												label: __(
													'Right top',
													'maxi-blocks'
												),
												value: 'right top',
											},
											{
												label: __(
													'Right center',
													'maxi-blocks'
												),
												value: 'right center',
											},
											{
												label: __(
													'Right bottom',
													'maxi-blocks'
												),
												value: 'right bottom',
											},
											{
												label: __(
													'Center top',
													'maxi-blocks'
												),
												value: 'center top',
											},
											{
												label: __(
													'Center center',
													'maxi-blocks'
												),
												value: 'center center',
											},
											{
												label: __(
													'Center bottom',
													'maxi-blocks'
												),
												value: 'center bottom',
											},
											{
												label: __(
													'Custom',
													'maxi-blocks'
												),
												value: 'custom',
											},
										]}
										onChange={val => {
											value.imageOptions[
												selector
											].positionOptions.position = val;
											onChange(JSON.stringify(value));
										}}
									/>
									{value.imageOptions[selector]
										.positionOptions.position ===
										'custom' && (
										<Fragment>
											<SizeControl
												label={__(
													'Y-axis',
													'maxi-blocks'
												)}
												unit={
													value.imageOptions[selector]
														.positionOptions
														.widthUnit
												}
												defaultUnit={
													defaultValue.imageOptions[0]
														.positionOptions
														.widthUnit
												}
												onChangeUnit={val => {
													value.imageOptions[
														selector
													].positionOptions.widthUnit = val;
													onChange(
														JSON.stringify(value)
													);
												}}
												value={
													value.imageOptions[selector]
														.positionOptions.width
												}
												defaultValue={
													defaultValue.imageOptions[0]
														.positionOptions.width
												}
												onChangeValue={val => {
													value.imageOptions[
														selector
													].positionOptions.width = val;
													onChange(
														JSON.stringify(value)
													);
												}}
											/>
											<SizeControl
												label={__(
													'X-axis',
													'maxi-blocks'
												)}
												unit={
													value.imageOptions[selector]
														.positionOptions
														.heightUnit
												}
												defaultUnit={
													defaultValue.imageOptions[0]
														.positionOptions
														.heightUnit
												}
												onChangeUnit={val => {
													value.imageOptions[
														selector
													].positionOptions.heightUnit = val;
													onChange(
														JSON.stringify(value)
													);
												}}
												value={
													value.imageOptions[selector]
														.positionOptions.height
												}
												defaultValue={
													defaultValue.imageOptions[0]
														.positionOptions.height
												}
												onChangeValue={val => {
													value.imageOptions[
														selector
													].positionOptions.height = val;
													onChange(
														JSON.stringify(value)
													);
												}}
											/>
										</Fragment>
									)}
									<SelectControl
										label={__(
											'Background origin',
											'maxi-blocks'
										)}
										value={
											value.imageOptions[selector].origin
										}
										options={[
											{
												label: __(
													'Padding',
													'maxi-blocks'
												),
												value: 'padding-box',
											},
											{
												label: __(
													'Border',
													'maxi-blocks'
												),
												value: 'border-box',
											},
											{
												label: __(
													'Content',
													'maxi-blocks'
												),
												value: 'content-box',
											},
										]}
										onChange={val => {
											value.imageOptions[
												selector
											].origin = val;
											onChange(JSON.stringify(value));
										}}
									/>
									<SelectControl
										label={__(
											'Background clip',
											'maxi-blocks'
										)}
										value={
											value.imageOptions[selector].clip
										}
										options={[
											{
												label: __(
													'Border',
													'maxi-blocks'
												),
												value: 'border-box',
											},
											{
												label: __(
													'Padding',
													'maxi-blocks'
												),
												value: 'padding-box',
											},
											{
												label: __(
													'Content',
													'maxi-blocks'
												),
												value: 'content-box',
											},
										]}
										onChange={val => {
											value.imageOptions[
												selector
											].clip = val;
											onChange(JSON.stringify(value));
										}}
									/>
									<SelectControl
										label={__(
											'Background attachment',
											'maxi-blocks'
										)}
										value={
											value.imageOptions[selector]
												.attachment
										}
										options={[
											{
												label: __(
													'Scroll',
													'maxi-blocks'
												),
												value: 'scroll',
											},
											{
												label: __(
													'Fixed',
													'maxi-blocks'
												),
												value: 'fixed',
											},
											{
												label: __(
													'Local',
													'maxi-blocks'
												),
												value: 'local',
											},
										]}
										onChange={val => {
											value.imageOptions[
												selector
											].attachment = val;
											onChange(JSON.stringify(value));
										}}
									/>
								</Fragment>
							),
						},
					]}
				/>
			)}
			{isOpen &&
				value.activeMedia === 'video' &&
				value.videoOptions.mediaURL && (
					<SettingTabsControl
						items={[
							{
								label: __('Video', 'maxi-blocks'),
								className: 'maxi-background-control__image-tab',
								uuid: 'maxi-background-control__image-tab',
								content: (
									<MediaUploaderControl
										mediaType='video'
										mediaID={value.videoOptions.mediaID}
										onSelectImage={imageData => {
											value.videoOptions.mediaID =
												imageData.id;
											value.videoOptions.mediaURL =
												imageData.url;
											onChange(JSON.stringify(value));
										}}
										onRemoveImage={() => {
											value.videoOptions.mediaID = '';
											value.videoOptions.mediaURL = '';
											onRemoveImage();
											onChange(JSON.stringify(value));
										}}
										extendSelector={
											<Button
												isSecondary
												onClick={onDoneEdition}
												className='maxi-background-control__done-edition'
											>
												{__('Done', 'maxi-blocks')}
											</Button>
										}
										replaceButton={__(
											'Replace',
											'maxi-blocks'
										)}
										removeButton={__(
											'Delete',
											'maxi-blocks'
										)}
										alternativeImage={getAlternativeImage(
											selector
										)}
										allowedTypes={['video']}
									/>
								),
							},
							{
								label: __('Settings', 'maxi-blocks'),
								className:
									'maxi-background-control__background-tab',
								content: (
									<Fragment>
										<SizeControl
											label={__('Width', 'maxi-blocks')}
											unit={value.videoOptions.widthUnit}
											defaultUnit={
												defaultValue.videoOptions
													.widthUnit
											}
											onChangeUnit={val => {
												value.videoOptions.widthUnit = val;
												onChange(JSON.stringify(value));
											}}
											value={value.videoOptions.width}
											defaultValue={
												defaultValue.videoOptions.width
											}
											onChangeValue={val => {
												value.videoOptions.width = val;
												onChange(JSON.stringify(value));
											}}
											minMaxSettings={{
												px: {
													min: 0,
													max: 999,
												},
												em: {
													min: 0,
													max: 999,
												},
												vw: {
													min: 0,
													max: 999,
												},
												'%': {
													min: 0,
													max: 100,
												},
											}}
										/>
										<SizeControl
											label={__('Height', 'maxi-blocks')}
											unit={value.videoOptions.heightUnit}
											defaultUnit={
												defaultValue.videoOptions
													.heightUnit
											}
											onChangeUnit={val => {
												value.videoOptions.heightUnit = val;
												onChange(JSON.stringify(value));
											}}
											value={value.videoOptions.height}
											defaultValue={
												defaultValue.videoOptions.height
											}
											onChangeValue={val => {
												value.videoOptions.height = val;
												onChange(JSON.stringify(value));
											}}
											minMaxSettings={{
												px: {
													min: 0,
													max: 999,
												},
												em: {
													min: 0,
													max: 999,
												},
												vw: {
													min: 0,
													max: 999,
												},
												'%': {
													min: 0,
													max: 100,
												},
											}}
										/>
										<SelectControl
											label={__('Fill', 'maxi-blocks')}
											value={value.videoOptions.fill}
											options={[
												{
													label: __(
														'Cover',
														'maxi-blocks'
													),
													value: 'cover',
												},
												{
													label: __(
														'Contain',
														'maxi-blocks'
													),
													value: 'contain',
												},
												{
													label: __(
														'Fill',
														'maxi-blocks'
													),
													value: 'fill',
												},
												{
													label: __(
														'Scale-down',
														'maxi-blocks'
													),
													value: 'scale-down',
												},
												{
													label: __(
														'None',
														'maxi-blocks'
													),
													value: 'none',
												},
											]}
											onChange={val => {
												value.videoOptions.fill = val;
												onChange(JSON.stringify(value));
											}}
										/>
										<SelectControl
											label={__(
												'Position',
												'maxi-blocks'
											)}
											value={value.videoOptions.position}
											options={[
												{
													label: __(
														'Unset',
														'maxi-blocks'
													),
													value: 'unset',
												},
												{
													label: __(
														'Top',
														'maxi-blocks'
													),
													value: 'top',
												},
												{
													label: __(
														'Right',
														'maxi-blocks'
													),
													value: 'right',
												},
												{
													label: __(
														'Bottom',
														'maxi-blocks'
													),
													value: 'bottom',
												},
												{
													label: __(
														'Left',
														'maxi-blocks'
													),
													value: 'left',
												},
												{
													label: __(
														'Center',
														'maxi-blocks'
													),
													value: 'center',
												},
											]}
											onChange={val => {
												value.videoOptions.position = val;
												onChange(JSON.stringify(value));
											}}
										/>
										<SelectControl
											label={__(
												'Autoplay',
												'maxi-blocks'
											)}
											value={value.videoOptions.autoplay}
											options={[
												{
													label: __(
														'No',
														'maxi-blocks'
													),
													value: 0,
												},
												{
													label: __(
														'Yes',
														'maxi-blocks'
													),
													value: 1,
												},
											]}
											onChange={val => {
												value.videoOptions.autoplay = val;
												if (Number(val))
													value.videoOptions.muted = 1;
												onChange(JSON.stringify(value));
											}}
										/>
										<SelectControl
											label={__('Muted', 'maxi-blocks')}
											value={value.videoOptions.muted}
	disabled={Number(value.videoOptions.autoplay)} // !!Number(value.videoOptions.autoplay)
											options={[
												{
													label: __(
														'No',
														'maxi-blocks'
													),
													value: 0,
												},
												{
													label: __(
														'Yes',
														'maxi-blocks'
													),
													value: 1,
												},
											]}
											onChange={val => {
												value.videoOptions.muted = val;
												onChange(JSON.stringify(value));
											}}
										/>
										<SelectControl
											label={__('Loop', 'maxi-blocks')}
											value={value.videoOptions.loop}
											options={[
												{
													label: __(
														'No',
														'maxi-blocks'
													),
													value: 0,
												},
												{
													label: __(
														'Yes',
														'maxi-blocks'
													),
													value: 1,
												},
											]}
											onChange={val => {
												value.videoOptions.loop = val;
												onChange(JSON.stringify(value));
											}}
										/>
										<SelectControl
											label={__('Preload', 'maxi-blocks')}
											value={value.videoOptions.muted}
											options={[
												{
													label: __(
														'MetaData',
														'maxi-blocks'
													),
													value: 'metadata',
												},
												{
													label: __(
														'Auto',
														'maxi-blocks'
													),
													value: 'auto',
												},
												{
													label: __(
														'None',
														'maxi-blocks'
													),
													value: 'none',
												},
											]}
											onChange={val => {
												value.videoOptions.muted = val;
												onChange(JSON.stringify(value));
											}}
										/>
									</Fragment>
								),
							},
						]}
					/>
				)}
		</div>
	);
};

export default BackgroundControl;
