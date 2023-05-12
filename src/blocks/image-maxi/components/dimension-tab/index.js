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
	AspectRatioControl,
	ImageCropControl,
	SelectControl,
	ToggleSwitch,
} from '../../../../components';
import {
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

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
		_co: cropOptions,
		_ir: imageRatio,
		_is: imageSize,
		_iiu: isImageUrl,
		_mi: mediaID,
		_se: SVGElement,
		_uis: useInitSize,
		_fps: fitParentSize,
		_ioh: isFirstOnHierarchy,
	} = attributes;
	const [objectSize, objectPositionHorizontal, objectPositionVertical] =
		getAttributesValue({
			target: ['_os', '_oph', '_opv'],
			props: attributes,
			breakpoint: deviceType,
		});

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
						defaultValue={getDefaultAttribute('_is')}
						onReset={() => {
							const imageSize = getDefaultAttribute('_is');
							const { mediaURL, mediaWidth, mediaHeight } =
								getSizeResponse(imageSize);
							maxiSetAttributes({
								_is: imageSize,
								_mu: mediaURL,
								_mew: mediaWidth,
								_meh: mediaHeight,
								isReset: true,
							});
						}}
						options={getSizeOptions()}
						onChange={imageSize => {
							const { mediaURL, mediaWidth, mediaHeight } =
								getSizeResponse(imageSize);
							maxiSetAttributes({
								_is: imageSize,
								_mu: mediaURL,
								_mew: mediaWidth,
								_meh: mediaHeight,
							});
						}}
					/>
					{imageSize === 'custom' && (
						<ImageCropControl
							mediaID={mediaID}
							cropOptions={cropOptions}
							onChange={cropOptions => {
								maxiSetAttributes({
									_co: cropOptions,
									_mu: cropOptions.image.source_url,
									_meh: cropOptions.image.height,
									_mew: cropOptions.image.width,
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
						_uis: val,
					})
				}
			/>
			{!useInitSize && (
				<RangeControl
					className='maxi-image-inspector__dimension-width'
					label={__('Width', 'maxi-blocks')}
					value={attributes._iw}
					onChange={val => {
						if (!isNil(val)) {
							maxiSetAttributes({
								_iw: val,
							});

							resizableObject &&
								resizableObject.updateSize({
									width: `${val}%`,
								});
						} else {
							const defaultAttribute = getDefaultAttribute(
								'_iw',
								clientId
							);

							maxiSetAttributes({
								_iw: defaultAttribute,
							});

							resizableObject &&
								resizableObject.updateSize({
									width: `${defaultAttribute}%`,
								});
						}
					}}
					max={100}
					allowReset
					initialPosition={getDefaultAttribute('_iw', clientId)}
				/>
			)}
			<AspectRatioControl
				className='maxi-image-inspector__ratio'
				label={__('Image ratio', 'maxi-blocks')}
				value={imageRatio}
				additionalOptions={[
					{
						label: __('Original size', 'maxi-blocks'),
						value: 'original',
					},
				]}
				onChange={imageRatio =>
					maxiSetAttributes({
						_ir: imageRatio,
					})
				}
				onReset={() =>
					maxiSetAttributes({
						_ir: getDefaultAttribute('_ir'),
						isReset: true,
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
								_fps: val,
							})
						}
					/>
					{fitParentSize && (
						<>
							<AdvancedNumberControl
								label={__('Adjust size', 'maxi-blocks')}
								className='maxi-image-inspector__image-size'
								placeholder={getLastBreakpointAttribute({
									target: '_os',
									breakpoint: deviceType,
									attributes,
								})}
								value={objectSize}
								onChangeValue={val =>
									maxiSetAttributes({
										[`_os-${deviceType}`]: val,
									})
								}
								onReset={() =>
									maxiSetAttributes({
										[`_os-${deviceType}`]:
											getDefaultAttribute(
												`_os-${deviceType}`
											),
										isReset: true,
									})
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
									target: '_oph',
									breakpoint: deviceType,
									attributes,
								})}
								value={objectPositionHorizontal}
								onChangeValue={val =>
									maxiSetAttributes({
										[`_oph-${deviceType}`]: val,
									})
								}
								onReset={() =>
									maxiSetAttributes({
										[`_oph-${deviceType}`]:
											getDefaultAttribute(
												`_oph-${deviceType}`
											),
										isReset: true,
									})
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
									target: '_opv',
									breakpoint: deviceType,
									attributes,
								})}
								value={objectPositionVertical}
								onChangeValue={val =>
									maxiSetAttributes({
										[`_opv-${deviceType}`]: val,
									})
								}
								onReset={() =>
									maxiSetAttributes({
										[`_opv-${deviceType}`]:
											getDefaultAttribute(
												`_opv-${deviceType}`
											),
										isReset: true,
									})
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
