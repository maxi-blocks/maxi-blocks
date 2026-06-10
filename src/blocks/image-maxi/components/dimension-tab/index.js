/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

/**
 * External dependencies
 */
import { capitalize, isNil } from 'lodash';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AspectRatioControl from '@components/aspect-ratio-control';
import ImageCropControl from '@components/image-crop-control';
import ToggleSwitch from '@components/toggle-switch';
import SelectControl from '@components/select-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

const DimensionTab = props => {
	const {
		attributes,
		clientId,
		maxiSetAttributes,
		resizableObject,
		imageData,
		deviceType = 'general',
		breakpoint,
	} = props;
	const activeBreakpoint = breakpoint || deviceType;
	const {
		imageRatio,
		imageRatioCustom,
		imageSize,
		isImageUrl,
		mediaID,
		SVGElement,
		useInitSize,
		fitParentSize,
		isFirstOnHierarchy,
	} = attributes;

	const getResponsiveImageAttribute = target =>
		getLastBreakpointAttribute({
			target,
			breakpoint: activeBreakpoint,
			attributes,
		}) || attributes[target];

	const currentImageSize =
		getResponsiveImageAttribute('imageSize') || imageSize || 'full';
	const currentCropOptions = getResponsiveImageAttribute('cropOptions');

	const getSizeOptions = () => {
		const response = [];

		if (imageData) {
			let { sizes } = imageData.media_details;
			sizes = Object.entries(sizes).sort((a, b) => {
				return a[1].width - b[1].width;
			});
			sizes.forEach(size => {
				const name = capitalize(size[0]);
				const val = size[1];
				response.push({
					label: `${name} - ${val.width}x${val.height}`,
					value: size[0],
				});
			});
		}
		response.push({
			label: 'Custom',
			value: 'custom',
		});

		return response;
	};

	const getSizeResponse = imageSize => {
		if (currentCropOptions && imageSize === 'custom') {
			const cropImage = currentCropOptions.image || currentCropOptions;
			const {
				source_url: mediaURL,
				width: mediaWidth,
				height: mediaHeight,
			} = cropImage;
			return { mediaURL, mediaWidth, mediaHeight };
		}
		if (imageData && imageSize !== 'custom') {
			const {
				source_url: mediaURL,
				width: mediaWidth,
				height: mediaHeight,
			} = imageData.media_details.sizes[imageSize];

			return { mediaURL, mediaWidth, mediaHeight };
		}
		return { mediaURL: null, mediaWidth: null, mediaHeight: null };
	};

	const getImageSizeAttributes = (imageSize, sizeResponse) => {
		const { mediaURL, mediaWidth, mediaHeight } =
			sizeResponse || getSizeResponse(imageSize);
		const breakpointAttributes = {
			[`imageSize-${activeBreakpoint}`]: imageSize,
			[`mediaURL-${activeBreakpoint}`]: mediaURL,
			[`mediaWidth-${activeBreakpoint}`]: mediaWidth,
			[`mediaHeight-${activeBreakpoint}`]: mediaHeight,
		};

		if (activeBreakpoint !== 'general') return breakpointAttributes;

		return {
			imageSize,
			mediaURL,
			mediaWidth,
			mediaHeight,
			...breakpointAttributes,
		};
	};

	const getCropOptionsAttributes = cropOptions => {
		const breakpointAttributes = {
			[`cropOptions-${activeBreakpoint}`]: cropOptions,
		};

		if (activeBreakpoint !== 'general') return breakpointAttributes;

		return {
			cropOptions,
			...breakpointAttributes,
		};
	};

	const getResetImageSizeAttributes = () => {
		if (activeBreakpoint !== 'general') {
			return {
				[`imageSize-${activeBreakpoint}`]: undefined,
				[`mediaURL-${activeBreakpoint}`]: undefined,
				[`mediaWidth-${activeBreakpoint}`]: undefined,
				[`mediaHeight-${activeBreakpoint}`]: undefined,
				isReset: true,
			};
		}

		return {
			...getImageSizeAttributes(getDefaultAttribute('imageSize')),
			isReset: true,
		};
	};

	return (
		<>
			{(!isImageUrl || !SVGElement) && getSizeOptions().length > 1 && (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Image size', 'maxi-blocks')}
						value={
							currentImageSize || currentImageSize === 'custom'
								? currentImageSize
								: 'full'
						} // is still necessary?
						defaultValue={getDefaultAttribute('imageSize')}
						onReset={() =>
							maxiSetAttributes(getResetImageSizeAttributes())
						}
						options={getSizeOptions()}
						newStyle
						onChange={imageSize => {
							const { mediaURL, mediaWidth, mediaHeight } =
								getSizeResponse(imageSize);
							maxiSetAttributes(
								getImageSizeAttributes(imageSize, {
									mediaURL,
									mediaWidth,
									mediaHeight,
								})
							);
						}}
					/>
					{currentImageSize === 'custom' && (
						<ImageCropControl
							mediaID={mediaID}
							cropOptions={currentCropOptions}
							onChange={cropOptions => {
								const cropImage =
									cropOptions.image || cropOptions;
								maxiSetAttributes({
									...getCropOptionsAttributes(cropOptions),
									...getImageSizeAttributes('custom', {
										mediaURL: cropImage.source_url,
										mediaHeight: cropImage.height,
										mediaWidth: cropImage.width,
									}),
								});
							}}
						/>
					)}
				</>
			)}
			{!fitParentSize && (
				<>
					<ToggleSwitch
						label={__('Use original size', 'maxi-blocks')}
						className='maxi-image-inspector__initial-size'
						selected={useInitSize}
						onChange={val =>
							maxiSetAttributes({
								useInitSize: val,
							})
						}
					/>
					{!useInitSize && (
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							className='maxi-image-inspector__dimension-width'
							placeholder={getLastBreakpointAttribute({
								target: 'img-width',
								breakpoint: activeBreakpoint,
								attributes,
							})}
							value={attributes[`img-width-${activeBreakpoint}`]}
							onChangeValue={val => {
								maxiSetAttributes({
									[`img-width-${activeBreakpoint}`]: val,
								});

								resizableObject &&
									resizableObject.updateSize({
										width: `${val}%`,
									});
							}}
							onReset={() => {
								const defaultAttribute = getDefaultAttribute(
									`img-width-${activeBreakpoint}`,
									clientId
								);

								maxiSetAttributes({
									[`img-width-${activeBreakpoint}`]:
										defaultAttribute,
									isReset: true,
								});

								resizableObject &&
									resizableObject.updateSize({
										width: `${defaultAttribute}%`,
									});
							}}
							min={0}
							max={100}
						/>
					)}
					<AspectRatioControl
						className='maxi-image-inspector__ratio'
						label={__('Image ratio', 'maxi-blocks')}
						value={imageRatio}
						customValue={imageRatioCustom}
						additionalOptions={[
							{
								label: __('Original size', 'maxi-blocks'),
								value: 'original',
							},
						]}
						onChange={imageRatio =>
							maxiSetAttributes({
								imageRatio,
							})
						}
						onChangeCustomValue={imageRatioCustom =>
							maxiSetAttributes({
								imageRatioCustom,
							})
						}
						onReset={() =>
							maxiSetAttributes({
								imageRatio: getDefaultAttribute('imageRatio'),
								isReset: true,
							})
						}
						onResetCustomValue={() =>
							maxiSetAttributes({
								imageRatioCustom:
									getDefaultAttribute('imageRatioCustom'),
								isReset: true,
							})
						}
					/>
				</>
			)}
			{!isFirstOnHierarchy && (
				<>
					<ToggleSwitch
						label={__('Fit on wrapper', 'maxi-blocks')}
						className='maxi-image-inspector__use-wrapper-height'
						selected={fitParentSize}
						onChange={val =>
							maxiSetAttributes({
								fitParentSize: val,
							})
						}
					/>

					<>
						{fitParentSize && (
							<AdvancedNumberControl
								label={__('Adjust size', 'maxi-blocks')}
								className='maxi-image-inspector__image-size'
								placeholder={getLastBreakpointAttribute({
									target: 'object-size',
									breakpoint: activeBreakpoint,
									attributes,
								})}
								value={
									attributes[
										`object-size-${activeBreakpoint}`
									]
								}
								onChangeValue={(val, meta) =>
									maxiSetAttributes({
										[`object-size-${activeBreakpoint}`]:
											val,
										meta,
									})
								}
								onReset={() =>
									maxiSetAttributes({
										[`object-size-${activeBreakpoint}`]:
											getDefaultAttribute(
												`object-size-${activeBreakpoint}`
											),
										isReset: true,
									})
								}
								min={1}
								max={5}
								step={0.1}
							/>
						)}
						<AdvancedNumberControl
							label={__(
								'Image horizontal position',
								'maxi-blocks'
							)}
							className='maxi-image-inspector__image-horizontal-position'
							placeholder={getLastBreakpointAttribute({
								target: 'object-position-horizontal',
								breakpoint: activeBreakpoint,
								attributes,
							})}
							value={
								attributes[
									`object-position-horizontal-${activeBreakpoint}`
								]
							}
							onChangeValue={(val, meta) =>
								maxiSetAttributes({
									[`object-position-horizontal-${activeBreakpoint}`]:
										val,
									meta,
								})
							}
							onReset={() =>
								maxiSetAttributes({
									[`object-position-horizontal-${activeBreakpoint}`]:
										getDefaultAttribute(
											`object-position-horizontal-${activeBreakpoint}`
										),
									isReset: true,
								})
							}
							min={0}
							max={100}
						/>
						<AdvancedNumberControl
							label={__('Image vertical position', 'maxi-blocks')}
							className='maxi-image-inspector__image-vertical-position'
							placeholder={getLastBreakpointAttribute({
								target: 'object-position-vertical',
								breakpoint: activeBreakpoint,
								attributes,
							})}
							value={
								attributes[
									`object-position-vertical-${activeBreakpoint}`
								]
							}
							onChangeValue={(val, meta) =>
								maxiSetAttributes({
									[`object-position-vertical-${activeBreakpoint}`]:
										val,
									meta,
								})
							}
							onReset={() =>
								maxiSetAttributes({
									[`object-position-vertical-${activeBreakpoint}`]:
										getDefaultAttribute(
											`object-position-vertical-${activeBreakpoint}`
										),
									isReset: true,
								})
							}
							min={0}
							max={100}
						/>
					</>
				</>
			)}
		</>
	);
};

export default DimensionTab;
