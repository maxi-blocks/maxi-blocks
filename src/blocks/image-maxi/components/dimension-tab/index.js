/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ImageCropControl,
	SelectControl,
	ToggleSwitch,
} from '../../../../components';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';
import { handleOnReset } from '../../../../extensions/attributes';

/**
 * External dependencies
 */
import { capitalize, isNil } from 'lodash';

const DimensionTab = props => {
	const {
		attributes,
		clientId,
		maxiSetAttributes,
		resizableObject,
		imageData,
		deviceType,
	} = props;
	const {
		cropOptions,
		imageRatio,
		imageSize,
		isImageUrl,
		mediaID,
		SVGElement,
		useInitSize,
		fitParentSize,
		isFirstOnHierarchy,
	} = attributes;

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
		if (cropOptions && imageSize === 'custom') {
			const {
				source_url: mediaURL,
				width: mediaWidth,
				height: mediaHeight,
			} = cropOptions;
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

	return (
		<>
			{(!isImageUrl || !SVGElement) && getSizeOptions().length > 1 && (
				<>
					<SelectControl
						label={__('Image size', 'maxi-blocks')}
						value={
							imageSize || imageSize === 'custom'
								? imageSize
								: 'full'
						} // is still necessary?
						onReset={() =>
							maxiSetAttributes(
								handleOnReset({
									imageSize: getDefaultAttribute('imageSize'),
								})
							)
						}
						options={getSizeOptions()}
						onChange={imageSize => {
							const { mediaURL, mediaWidth, mediaHeight } =
								getSizeResponse(imageSize);
							maxiSetAttributes({
								imageSize,
								mediaURL,
								mediaWidth,
								mediaHeight,
							});
						}}
					/>
					{imageSize === 'custom' && (
						<ImageCropControl
							mediaID={mediaID}
							cropOptions={cropOptions}
							onChange={cropOptions => {
								maxiSetAttributes({
									cropOptions,
									mediaURL: cropOptions.image.source_url,
									mediaHeight: cropOptions.image.height,
									mediaWidth: cropOptions.image.width,
								});
							}}
						/>
					)}
				</>
			)}
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
				<RangeControl
					className='maxi-image-inspector__dimension-width'
					label={__('Width', 'maxi-blocks')}
					value={attributes.imgWidth}
					onChange={val => {
						if (!isNil(val)) {
							maxiSetAttributes({
								imgWidth: val,
							});

							resizableObject &&
								resizableObject.updateSize({
									width: `${val}%`,
								});
						} else {
							const defaultAttribute = getDefaultAttribute(
								'imgWidth',
								clientId
							);

							maxiSetAttributes({
								imgWidth: defaultAttribute,
							});

							resizableObject &&
								resizableObject.updateSize({
									width: `${defaultAttribute}%`,
								});
						}
					}}
					max={100}
					allowReset
					initialPosition={getDefaultAttribute('imgWidth', clientId)}
				/>
			)}
			<SelectControl
				className='maxi-image-inspector__ratio'
				label={__('Image ratio', 'maxi-blocks')}
				value={imageRatio}
				onReset={() =>
					maxiSetAttributes(
						handleOnReset({
							imageRatio: getDefaultAttribute('imageRatio'),
						})
					)
				}
				options={[
					{
						label: __('Original size', 'maxi-blocks'),
						value: 'original',
					},
					{
						label: __('1:1 Aspect ratio', 'maxi-blocks'),
						value: 'ar11',
					},
					{
						label: __('2:3 Aspect ratio', 'maxi-blocks'),
						value: 'ar23',
					},
					{
						label: __('3:2 Aspect ratio', 'maxi-blocks'),
						value: 'ar32',
					},
					{
						label: __('4:3 Aspect ratio', 'maxi-blocks'),
						value: 'ar43',
					},
					{
						label: __('16:9 Aspect ratio', 'maxi-blocks'),
						value: 'ar169',
					},
				]}
				onChange={imageRatio =>
					maxiSetAttributes({
						imageRatio,
					})
				}
			/>
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
					{fitParentSize && (
						<>
							<AdvancedNumberControl
								label={__('Adjust size', 'maxi-blocks')}
								className='maxi-image-inspector__image-size'
								placeholder={getLastBreakpointAttribute({
									target: 'object-size',
									breakpoint: deviceType,
									attributes,
								})}
								value={attributes[`object-size-${deviceType}`]}
								onChangeValue={val =>
									maxiSetAttributes({
										[`object-size-${deviceType}`]: val,
									})
								}
								onReset={() =>
									maxiSetAttributes(
										handleOnReset({
											[`object-size-${deviceType}`]:
												getDefaultAttribute(
													`object-size-${deviceType}`
												),
										})
									)
								}
								min={1}
								max={5}
								step={0.1}
							/>
							<AdvancedNumberControl
								label={__(
									'Image horizontal position',
									'maxi-blocks'
								)}
								className='maxi-image-inspector__image-horizontal-position'
								placeholder={getLastBreakpointAttribute({
									target: 'object-position-horizontal',
									breakpoint: deviceType,
									attributes,
								})}
								value={
									attributes[
										`object-position-horizontal-${deviceType}`
									]
								}
								onChangeValue={val =>
									maxiSetAttributes({
										[`object-position-horizontal-${deviceType}`]:
											val,
									})
								}
								onReset={() =>
									maxiSetAttributes(
										handleOnReset({
											[`object-position-horizontal-${deviceType}`]:
												getDefaultAttribute(
													`object-position-horizontal-${deviceType}`
												),
										})
									)
								}
								min={0}
								max={100}
							/>
							<AdvancedNumberControl
								label={__(
									'Image vertical position',
									'maxi-blocks'
								)}
								className='maxi-image-inspector__image-vertical-position'
								placeholder={getLastBreakpointAttribute({
									target: 'object-position-vertical',
									breakpoint: deviceType,
									attributes,
								})}
								value={
									attributes[
										`object-position-vertical-${deviceType}`
									]
								}
								onChangeValue={val =>
									maxiSetAttributes({
										[`object-position-vertical-${deviceType}`]:
											val,
									})
								}
								onReset={() =>
									maxiSetAttributes(
										handleOnReset({
											[`object-position-vertical-${deviceType}`]:
												getDefaultAttribute(
													`object-position-vertical-${deviceType}`
												),
										})
									)
								}
								min={0}
								max={100}
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export default DimensionTab;
