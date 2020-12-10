/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { Button, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import __experimentalClipPath from '../clip-path-control';
import __experimentalOpacityControl from '../opacity-control';
import SettingTabsControl from '../setting-tabs-control';
import ImageCropControl from '../image-crop-control';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import { isNumber, pullAt } from 'lodash';

/**
 * Component
 */
const ImageLayer = props => {
	const {
		imageOptions,
		defaultImageOptions,
		onChange,
		disableClipPath,
	} = props;

	const onAddBackground = () => {
		imageOptions.items.push(defaultImageOptions.items[0]);
	};

	const [isOpen, setIsOpen] = useState(false);
	const [selector, setSelector] = useState(0);

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
		pullAt(imageOptions, selector);
		onChange(imageOptions);
		onDoneEdition();
	};

	const getAlternativeImage = i => {
		try {
			return {
				source_url: imageOptions.items[i].imageData.mediaURL,
				width: imageOptions.items[i].imageData.width,
				height: imageOptions.items[i].imageData.height,
			};
		} catch (error) {
			return false;
		}
	};

	return (
		<Fragment>
			{!isOpen && (
				<Fragment>
					{imageOptions.items.map((option, i) => (
						<MediaUploaderControl
							mediaID={option.imageData.mediaID}
							onSelectImage={imageData => {
								if (!isNumber(option.imageData.mediaID))
									onAddBackground();
								option.imageData.mediaID = imageData.id;
								option.imageData.mediaURL = imageData.url;
								option.imageData.width = imageData.width;
								option.imageData.height = imageData.height;

								onChange(imageOptions);
							}}
							onRemoveImage={() => {
								imageOptions.items[selector].imageData.mediaID =
									'';
								imageOptions.items[
									selector
								].imageData.mediaURL = '';
								onRemoveImage();

								onChange(imageOptions);
							}}
							placeholder={
								imageOptions.items.length - 1 === 0
									? __('Set image', 'maxi-blocks')
									: __('Add Another Image', 'maxi-blocks')
							}
							extendSelector={
								option.imageData.mediaID && (
									<Button
										isSecondary
										onClick={e => onOpenOptions(e, i)}
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
							clipPath={imageOptions.clipPath}
							onChange={val => {
								imageOptions.clipPath = val;

								onChange(imageOptions);
							}}
						/>
					)}
					<__experimentalOpacityControl
						label={__('Background Opacity', 'maxi-blocks')}
						fullWidthMode
						opacity={imageOptions.opacity}
						defaultOpacity={defaultImageOptions.opacity}
						onChange={opacity => {
							imageOptions.opacity = opacity;

							onChange(imageOptions);
						}}
					/>
				</Fragment>
			)}
			{isOpen && (
				<SettingTabsControl
					items={[
						{
							label: __('Image', 'maxi-blocks'),
							className: 'maxi-background-control__image-tab',
							uuid: 'maxi-background-control__image-tab',
							content: (
								<MediaUploaderControl
									mediaID={
										imageOptions.items[selector].imageData
											.mediaID
									}
									onSelectImage={imageData => {
										imageOptions.items[
											selector
										].imageData.mediaID = imageData.id;
										imageOptions.items[
											selector
										].imageData.mediaURL = imageData.url;

										onChange(imageOptions);
									}}
									onRemoveImage={() => {
										imageOptions.items[
											selector
										].imageData.mediaID = '';
										imageOptions.items[
											selector
										].imageData.mediaURL = '';
										onRemoveImage();

										onChange(imageOptions);
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
											imageOptions.items[selector]
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
											imageOptions.items[
												selector
											].sizeSettings.size = val;

											onChange(imageOptions);
										}}
									/>
									{imageOptions.items[selector].sizeSettings
										.size === 'custom' && (
										<ImageCropControl
											mediaID={
												imageOptions.items[selector]
													.imageData.mediaID
											}
											cropOptions={
												imageOptions.items[selector]
													.imageData.cropOptions
													? imageOptions.items[
															selector
													  ].imageData.cropOptions
													: {}
											}
											onChange={cropOptions => {
												imageOptions.items[
													selector
												].imageData.cropOptions = cropOptions;

												onChange(imageOptions);
											}}
										/>
									)}
									<SelectControl
										label={__(
											'Background repeat',
											'maxi-blocks'
										)}
										value={
											imageOptions.items[selector].repeat
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
											imageOptions.items[
												selector
											].repeat = val;

											onChange(imageOptions);
										}}
									/>
									<SelectControl
										label={__(
											'Background position',
											'maxi-blocks'
										)}
										value={
											imageOptions.items[selector]
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
											imageOptions.items[
												selector
											].positionOptions.position = val;

											onChange(imageOptions);
										}}
									/>
									{imageOptions.items[selector]
										.positionOptions.position ===
										'custom' && (
										<Fragment>
											<SizeControl
												label={__(
													'Y-axis',
													'maxi-blocks'
												)}
												unit={
													imageOptions.items[selector]
														.positionOptions
														.widthUnit
												}
												defaultUnit={
													defaultImageOptions[0]
														.positionOptions
														.widthUnit
												}
												onChangeUnit={val => {
													imageOptions.items[
														selector
													].positionOptions.widthUnit = val;

													onChange(imageOptions);
												}}
												value={
													imageOptions.items[selector]
														.positionOptions.width
												}
												defaultValue={
													defaultImageOptions[0]
														.positionOptions.width
												}
												onChangeValue={val => {
													imageOptions.items[
														selector
													].positionOptions.width = val;

													onChange(imageOptions);
												}}
											/>
											<SizeControl
												label={__(
													'X-axis',
													'maxi-blocks'
												)}
												unit={
													imageOptions.items[selector]
														.positionOptions
														.heightUnit
												}
												defaultUnit={
													defaultImageOptions[0]
														.positionOptions
														.heightUnit
												}
												onChangeUnit={val => {
													imageOptions.items[
														selector
													].positionOptions.heightUnit = val;

													onChange(imageOptions);
												}}
												value={
													imageOptions.items[selector]
														.positionOptions.height
												}
												defaultValue={
													defaultImageOptions[0]
														.positionOptions.height
												}
												onChangeValue={val => {
													imageOptions.items[
														selector
													].positionOptions.height = val;

													onChange(imageOptions);
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
											imageOptions.items[selector].origin
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
											imageOptions.items[
												selector
											].origin = val;

											onChange(imageOptions);
										}}
									/>
									<SelectControl
										label={__(
											'Background clip',
											'maxi-blocks'
										)}
										value={
											imageOptions.items[selector].clip
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
											imageOptions.items[
												selector
											].clip = val;

											onChange(imageOptions);
										}}
									/>
									<SelectControl
										label={__(
											'Background attachment',
											'maxi-blocks'
										)}
										value={
											imageOptions.items[selector]
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
											imageOptions.items[
												selector
											].attachment = val;

											onChange(imageOptions);
										}}
									/>
								</Fragment>
							),
						},
					]}
				/>
			)}
		</Fragment>
	);
};

export default ImageLayer;
