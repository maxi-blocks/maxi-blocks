/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ClipPathControl from '../clip-path-control';
import ImageAltControl from '../image-alt-control';
import ImageCropControl from '../image-crop-control';
import MediaUploaderControl from '../media-uploader-control';
import OpacityControl from '../opacity-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import ToggleSwitch from '../toggle-switch';
import {
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

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
				label={__('Background size', 'maxi-blocks')}
				className='maxi-background-control__image-layer__size-selector'
				value={getLastBreakpointAttribute({
					target: `${prefix}background-image-size`,
					breakpoint,
					attributes: imageOptions,
					isHover,
				})}
				defaultValue={getDefaultAttr('background-image-size')}
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
					...(!parallaxStatus
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
					label={__('Background repeat', 'maxi-blocks')}
					className='maxi-background-control__image-layer__repeat-selector'
					value={getLastBreakpointAttribute({
						target: `${prefix}background-image-repeat`,
						breakpoint,
						attributes: imageOptions,
						isHover,
					})}
					defaultValue={getDefaultAttr('background-image-repeat')}
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
			<SelectControl
				label={__('Background position', 'maxi-blocks')}
				className='maxi-background-control__image-layer__position-selector'
				value={getLastBreakpointAttribute({
					target: `${prefix}background-image-position`,
					breakpoint,
					attributes: imageOptions,
					isHover,
				})}
				defaultValue={getDefaultAttr('background-image-position')}
				options={[
					{
						label: __('Left top', 'maxi-blocks'),
						value: 'left top',
					},
					{
						label: __('Left center', 'maxi-blocks'),
						value: 'left center',
					},
					{
						label: __('Left bottom', 'maxi-blocks'),
						value: 'left bottom',
					},
					{
						label: __('Right top', 'maxi-blocks'),
						value: 'right top',
					},
					{
						label: __('Right center', 'maxi-blocks'),
						value: 'right center',
					},
					{
						label: __('Right bottom', 'maxi-blocks'),
						value: 'right bottom',
					},
					{
						label: __('Center top', 'maxi-blocks'),
						value: 'center top',
					},
					{
						label: __('Center center', 'maxi-blocks'),
						value: 'center center',
					},
					{
						label: __('Center bottom', 'maxi-blocks'),
						value: 'center bottom',
					},
					{
						label: __('Custom', 'maxi-blocks'),
						value: 'custom',
					},
				]}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-image-position',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() =>
					onChange({
						[getAttributeKey(
							'background-image-position',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttr('background-image-position'),
					})
				}
			/>
			{getLastBreakpointAttribute({
				target: `${prefix}background-image-position`,
				breakpoint,
				attributes: imageOptions,
				isHover,
			}) === 'custom' && (
				<>
					<AdvancedNumberControl
						label={__('Y-axis', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: `${prefix}background-image-position-width-unit`,
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-width-unit',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: `${prefix}background-image-position-width`,
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-width',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'background-image-position-width',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr(
									'background-image-position-width'
								),
								[getAttributeKey(
									'background-image-position-width-unit',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr(
									'background-image-position-width-unit'
								),
								isReset: true,
							})
						}
					/>
					<AdvancedNumberControl
						label={__('X-axis', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: 'background-image-position-height-unit',
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-height-unit',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: 'background-image-position-height',
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-height',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'background-image-position-height',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr(
									'background-image-position-height'
								),
								[getAttributeKey(
									'background-image-position-height-unit',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr(
									'background-image-position-height-unit'
								),
								isReset: true,
							})
						}
					/>
				</>
			)}
			{!parallaxStatus && (
				<>
					<SelectControl
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
			<hr />
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

	return (
		<div className='maxi-background-control__image-layer'>
			{!disableUpload && (
				<MediaUploaderControl
					mediaID={mediaID}
					onSelectImage={imageData =>
						onChange({
							[getAttributeKey(
								'background-image-mediaID',
								isHover,
								prefix
							)]: imageData.id,
							[getAttributeKey(
								'background-image-mediaURL',
								isHover,
								prefix
							)]: imageData.url,
							[getAttributeKey(
								'background-image-width',
								isHover,
								prefix
							)]: imageData.width,
							[getAttributeKey(
								'background-image-height',
								isHover,
								prefix
							)]: imageData.height,
						})
					}
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
			)}
			{!hideSettings && (
				<SettingTabsControl
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
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
							content: (
								<>
									<ToggleSwitch
										label={__(
											'Enable Parallax',
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
