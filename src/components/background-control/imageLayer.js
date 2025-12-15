/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { FocalPointPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ClipPathControl from '@components/clip-path-control';
import ImageAltControl from '@components/image-alt-control';
import ImageCropControl from '@components/image-crop-control';
import ImageUrlUpload from '@components/image-url-upload';
import MediaUploaderControl from '@components/media-uploader-control';
import OpacityControl from '@components/opacity-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import ToggleSwitch from '@components/toggle-switch';
import {
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { getDefaultLayerAttr } from './utils';
import DynamicContent from '@components/dynamic-content';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Component
 */
const ImageLayerSettings = props => {
	const {
		onChange,
		disableClipPath,
		isHover = false,
		isIB = false,
		prefix = '',
		breakpoint,
		getDefaultAttr,
		moreSettings,
		setMoreSettings,
		isLayer,
		getBounds,
		getBlockClipPath, // for IB
	} = props;

	const imageOptions = cloneDeep(props.imageOptions);

	const parallaxStatus = getAttributeValue({
		target: 'background-image-parallax-status',
		props: imageOptions,
		prefix,
	});

	return (
		<>
			<OpacityControl
				label={__('Background opacity', 'maxi-blocks')}
				opacity={getLastBreakpointAttribute({
					target: `${prefix}background-image-opacity`,
					breakpoint,
					attributes: imageOptions,
					isHover,
				})}
				breakpoint={breakpoint}
				prefix={`${prefix}background-image-`}
				isHover={isHover}
				onChange={onChange}
				disableRTC
			/>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Background size', 'maxi-blocks')}
				className='maxi-background-control__image-layer__size-selector'
				value={getLastBreakpointAttribute({
					target: `${prefix}background-image-size`,
					breakpoint,
					attributes: imageOptions,
					isHover,
				})}
				defaultValue={getDefaultAttr('background-image-size')}
				newStyle
				options={[
					{
						label: __('Auto', 'maxi-blocks'),
						value: 'auto',
					},
					{
						label: __('Cover', 'maxi-blocks'),
						value: 'cover',
					},
					{
						label: __('Contain', 'maxi-blocks'),
						value: 'contain',
					},
					...(!parallaxStatus && !imageOptions['dc-status']
						? [
								{
									label: __('Custom', 'maxi-blocks'),
									value: 'custom',
								},
						  ]
						: []),
					...(parallaxStatus
						? [
								{
									label: __('Fill', 'maxi-blocks'),
									value: 'fill',
								},
								{
									label: __('None', 'maxi-blocks'),
									value: 'none',
								},
								{
									label: __('Revert', 'maxi-blocks'),
									value: 'revert',
								},
								{
									label: __('Scale down', 'maxi-blocks'),
									value: 'scale-down',
								},
						  ]
						: []),
				]}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-image-size',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() =>
					onChange({
						[getAttributeKey(
							'background-image-size',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttr('background-image-size'),
					})
				}
			/>
			{getLastBreakpointAttribute({
				target: `${prefix}background-image-size`,
				breakpoint,
				attributes: imageOptions,
				isHover,
			}) === 'custom' && (
				<ImageCropControl
					mediaID={getAttributeValue({
						target: 'background-image-mediaID',
						props: imageOptions,
						prefix,
					})}
					cropOptions={getLastBreakpointAttribute({
						target: `${prefix}background-image-crop-options`,
						breakpoint,
						attributes: imageOptions,
						isHover,
					})}
					onChange={cropOptions =>
						onChange({
							[getAttributeKey(
								'background-image-crop-options',
								isHover,
								prefix,
								breakpoint
							)]: cropOptions,
							[getAttributeKey(
								'background-image-mediaURL',
								isHover,
								prefix,
								breakpoint
							)]: cropOptions.image.source_url,
						})
					}
				/>
			)}
			{!parallaxStatus && (
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Background repeat', 'maxi-blocks')}
					className='maxi-background-control__image-layer__repeat-selector'
					value={getLastBreakpointAttribute({
						target: `${prefix}background-image-repeat`,
						breakpoint,
						attributes: imageOptions,
						isHover,
					})}
					defaultValue={getDefaultAttr('background-image-repeat')}
					newStyle
					options={[
						{
							label: __('No repeat', 'maxi-blocks'),
							value: 'no-repeat',
						},
						{
							label: __('Repeat', 'maxi-blocks'),
							value: 'repeat',
						},
						{
							label: __('Repeat X', 'maxi-blocks'),
							value: 'repeat-x',
						},
						{
							label: __('Repeat Y', 'maxi-blocks'),
							value: 'repeat-y',
						},
						{
							label: __('Space', 'maxi-blocks'),
							value: 'space',
						},
						{
							label: __('Round', 'maxi-blocks'),
							value: 'round',
						},
					]}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-image-repeat',
								isHover,
								prefix,
								breakpoint
							)]: val,
						})
					}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'background-image-repeat',
								isHover,
								prefix,
								breakpoint
							)]: getDefaultAttr('background-image-repeat'),
						})
					}
				/>
			)}
			<div className='maxi-focal-point-picker'>
			<FocalPointPicker
			className='maxi-background-position-picker'
				label={__('Background position', 'maxi-blocks')}
				url={getAttributeValue({
					target: 'background-image-mediaURL',
					props: imageOptions,
					prefix,
				})}
				value={{
					x:
						(getLastBreakpointAttribute({
							target: `${prefix}background-image-position-width`,
							breakpoint,
							attributes: imageOptions,
							isHover,
						}) ?? 50) / 100,
					y:
						(getLastBreakpointAttribute({
							target: `${prefix}background-image-position-height`,
							breakpoint,
							attributes: imageOptions,
							isHover,
						}) ?? 50) / 100,
				}}
				onChange={focalPoint =>
					onChange({
						[getAttributeKey(
							'background-image-position',
							isHover,
							prefix,
							breakpoint
						)]: 'custom',
						[getAttributeKey(
							'background-image-position-width',
							isHover,
							prefix,
							breakpoint
						)]: Math.round(focalPoint.x * 100),
						[getAttributeKey(
							'background-image-position-width-unit',
							isHover,
							prefix,
							breakpoint
						)]: '%',
						[getAttributeKey(
							'background-image-position-height',
							isHover,
							prefix,
							breakpoint
						)]: Math.round(focalPoint.y * 100),
						[getAttributeKey(
							'background-image-position-height-unit',
							isHover,
							prefix,
							breakpoint
						)]: '%',
					})
				}
			/>
		</div>
			{!parallaxStatus && (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Background attachment', 'maxi-blocks')}
						className='maxi-background-control__image-layer__attachment-selector'
						value={getLastBreakpointAttribute({
							target: `${prefix}background-image-attachment`,
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						defaultValue={getDefaultAttr(
							'background-image-attachment'
						)}
						newStyle
						options={[
							{
								label: __('Scroll', 'maxi-blocks'),
								value: 'scroll',
							},
							{
								label: __('Fixed', 'maxi-blocks'),
								value: 'fixed',
							},
							{
								label: __('Local', 'maxi-blocks'),
								value: 'local',
							},
						]}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'background-image-attachment',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'background-image-attachment',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr(
									'background-image-attachment'
								),
							})
						}
					/>
					<ToggleSwitch
						className='maxi-background-image-more-settings--toggle'
						label={__('More settings', 'maxi-blocks')}
						selected={moreSettings}
						onChange={val => {
							setMoreSettings(val);
						}}
					/>
					{moreSettings && (
						<div className='maxi-background-image-more-settings'>
							<SelectControl
								__nextHasNoMarginBottom
								label={__('Background origin', 'maxi-blocks')}
								className='maxi-background-control__image-layer__origin-selector'
								value={getLastBreakpointAttribute({
									target: `${prefix}background-image-origin`,
									breakpoint,
									attributes: imageOptions,
									isHover,
								})}
								defaultValue={getDefaultAttr(
									'background-image-origin'
								)}
								newStyle
								options={[
									{
										label: __('Padding', 'maxi-blocks'),
										value: 'padding-box',
									},
									{
										label: __('Border', 'maxi-blocks'),
										value: 'border-box',
									},
									{
										label: __('Content', 'maxi-blocks'),
										value: 'content-box',
									},
								]}
								onChange={val =>
									onChange({
										[getAttributeKey(
											'background-image-origin',
											isHover,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'background-image-origin',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttr(
											'background-image-origin'
										),
									})
								}
							/>
							<SelectControl
								__nextHasNoMarginBottom
								label={__('Background clip', 'maxi-blocks')}
								className='maxi-background-control__image-layer__clip-selector'
								value={getLastBreakpointAttribute({
									target: `${prefix}background-image-clip`,
									breakpoint,
									attributes: imageOptions,
									isHover,
								})}
								defaultValue={getDefaultAttr(
									'background-image-clip'
								)}
								newStyle
								options={[
									{
										label: __('Border', 'maxi-blocks'),
										value: 'border-box',
									},
									{
										label: __('Padding', 'maxi-blocks'),
										value: 'padding-box',
									},
									{
										label: __('Content', 'maxi-blocks'),
										value: 'content-box',
									},
								]}
								onChange={val =>
									onChange({
										[getAttributeKey(
											'background-image-clip',
											isHover,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'background-image-clip',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttr(
											'background-image-clip'
										),
									})
								}
							/>
						</div>
					)}
				</>
			)}
			<hr className='maxi-background-control__separator' />
			{!disableClipPath && (
				<ClipPathControl
					onChange={onChange}
					{...getGroupAttributes(
						imageOptions,
						'clipPath',
						false,
						'background-image-'
					)}
					{...imageOptions}
					isHover={isHover}
					isIB={isIB}
					prefix='background-image-'
					breakpoint={breakpoint}
					getBounds={getBounds}
					getBlockClipPath={getBlockClipPath}
					isLayer
					disableRTC
				/>
			)}
			<SizeAndPositionLayerControl
				prefix={prefix}
				options={imageOptions}
				onChange={onChange}
				isHover={isHover}
				isLayer={isLayer}
				breakpoint={breakpoint}
			/>
		</>
	);
};

const ImageLayer = props => {
	const {
		breakpoint,
		onChange,
		isHover,
		prefix = '',
		hideSettings = false,
		isLayer = false,
		disableUpload = false,
	} = props;

	const imageOptions = cloneDeep(props.imageOptions);

	const [moreSettings, setMoreSettings] = useState(false);

	const getDefaultAttr = target => {
		if (isLayer)
			return breakpoint === 'general'
				? getDefaultLayerAttr('imageOptions', `${prefix}${target}`)
				: undefined;

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	const mediaID = getAttributeValue({
		target: 'background-image-mediaID',
		props: imageOptions,
		prefix,
	});

	const handleSelectImage = imageData => {
		onChange({
			[getAttributeKey('background-image-mediaID', isHover, prefix)]:
				imageData.id,
			[getAttributeKey('background-image-mediaURL', isHover, prefix)]:
				imageData.url,
			[getAttributeKey('background-image-width', isHover, prefix)]:
				imageData.width,
			[getAttributeKey('background-image-height', isHover, prefix)]:
				imageData.height,
			[getAttributeKey('background-image-isImageUrl', isHover, prefix)]:
				imageData.isImageUrl || false,
			[getAttributeKey('background-image-isImageUrlInvalid', isHover)]:
				imageData.isImageUrlInvalid || false,
		});
	};

	return (
		<div className='maxi-background-control__image-layer'>
			{!disableUpload && (
				<>
					{!imageOptions['dc-status'] && (
						<>
							<MediaUploaderControl
								mediaID={mediaID}
								isImageUrl={getAttributeValue({
									target: 'background-image-isImageUrl',
									props: imageOptions,
									prefix,
								})}
								onSelectImage={handleSelectImage}
								onRemoveImage={() =>
									onChange({
										[getAttributeKey(
											'background-image-mediaID',
											false,
											prefix
										)]: '',
										[getAttributeKey(
											'background-image-mediaURL',
											false,
											prefix
										)]: '',
										[getAttributeKey(
											'background-image-width',
											isHover,
											prefix
										)]: '',
										[getAttributeKey(
											'background-image-height',
											isHover,
											prefix
										)]: '',
									})
								}
							/>
							<ImageUrlUpload
								attributes={imageOptions}
								prefix={`${prefix}background-image-`}
								onChange={handleSelectImage}
							/>
						</>
					)}
					<DynamicContent
						{...getGroupAttributes(imageOptions, 'dynamicContent')}
						onChange={obj => {
							const newObj = { ...obj };

							// Reset background-image-size to auto if dynamic content is enabled
							breakpoints.forEach(bp => {
								if (
									obj['dc-status'] &&
									getLastBreakpointAttribute({
										target: `${prefix}background-image-size`,
										breakpoint: bp,
										attributes: imageOptions,
										isHover,
									}) === 'custom'
								) {
									newObj[
										getAttributeKey(
											'background-image-size',
											isHover,
											prefix,
											bp
										)
									] = 'auto';
								}
							});

							onChange(newObj);
						}}
						contentType='image'
						disableHideOnFrontend
					/>
				</>
			)}
			{!hideSettings && (
				<SettingTabsControl
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
							className: 'settings-background-image',
							content: (
								<ResponsiveTabsControl breakpoint={breakpoint}>
									<ImageLayerSettings
										getDefaultAttr={getDefaultAttr}
										moreSettings={moreSettings}
										setMoreSettings={setMoreSettings}
										{...props}
									/>
								</ResponsiveTabsControl>
							),
						},
						...(!isHover && {
							label: __('Parallax', 'maxi-blocks'),
							className: 'parallax-background-image',
							content: (
								<>
									<ToggleSwitch
										className='margin-top'
										label={__(
											'Enable parallax',
											'maxi-blocks'
										)}
										selected={
											imageOptions[
												'background-image-parallax-status'
											]
										}
										onChange={val =>
											onChange({
												'background-image-parallax-status':
													val,
											})
										}
									/>
									{imageOptions[
										'background-image-parallax-status'
									] && (
										<>
											<SettingTabsControl
												className='parallax-direction'
												type='buttons'
												label={__(
													'Direction',
													'maxi-blocks'
												)}
												selected={
													imageOptions[
														'background-image-parallax-direction'
													]
												}
												items={[
													{
														label: __(
															'Up',
															'maxi-blocks'
														),
														value: 'up',
													},
													{
														label: __(
															'Down',
															'maxi-blocks'
														),
														value: 'down',
													},
												]}
												onChange={val =>
													onChange({
														'background-image-parallax-direction':
															val,
													})
												}
											/>
											<AdvancedNumberControl
												label={__(
													'Speed',
													'maxi-blocks'
												)}
												value={
													imageOptions[
														'background-image-parallax-speed'
													]
												}
												onChangeValue={val => {
													onChange({
														'background-image-parallax-speed':
															val !== undefined &&
															val !== ''
																? val
																: '',
													});
												}}
												min={0.2}
												max={10}
												step={0.1}
												onReset={() =>
													onChange({
														'background-image-parallax-speed':
															getDefaultAttr(
																'background-image-parallax-speed'
															),
														isReset: true,
													})
												}
												initialPosition={getDefaultAttr(
													'background-image-parallax-speed'
												)}
											/>
											<ImageAltControl
												mediaID={mediaID}
												altSelector={getAttributeValue({
													target: 'background-image-parallax-alt-selector',
													props: imageOptions,
													prefix,
												})}
												mediaAlt={getAttributeValue({
													target: 'background-image-parallax-alt',
													props: imageOptions,
													prefix,
												})}
												onChange={({
													altSelector,
													mediaAlt,
												}) => {
													onChange({
														...(altSelector && {
															'background-image-parallax-alt-selector':
																altSelector,
														}),
														...(mediaAlt && {
															'background-image-parallax-alt':
																mediaAlt,
														}),
													});
												}}
											/>
										</>
									)}
								</>
							),
						}),
					]}
				/>
			)}
		</div>
	);
};

export default ImageLayer;
