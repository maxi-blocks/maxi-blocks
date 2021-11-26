/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ButtonGroupControl from '../button-group-control';
import ClipPath from '../clip-path-control';
import ImageAltControl from '../image-alt-control';
import ImageCropControl from '../image-crop-control';
import MediaUploaderControl from '../media-uploader-control';
import OpacityControl from '../opacity-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import {
	getAttributeKey,
	getAttributeValue,
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
		prefix = '',
		breakpoint,
		isGeneral = false,
		getDefaultAttr,
		moreSettings,
		setMoreSettings,
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
				label={__('Background Opacity', 'maxi-blocks')}
				opacity={getLastBreakpointAttribute(
					`${prefix}background-image-opacity`,
					breakpoint,
					imageOptions,
					isHover
				)}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-image-opacity',
							isHover,
							prefix,
							breakpoint
						)]: val,
						...(isGeneral && {
							[getAttributeKey(
								'background-image-opacity',
								isHover,
								prefix,
								'general'
							)]: val,
						}),
					})
				}
			/>
			<SelectControl
				label={__('Background size', 'maxi-blocks')}
				value={getLastBreakpointAttribute(
					`${prefix}background-image-size`,
					breakpoint,
					imageOptions,
					isHover
				)}
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
						...(isGeneral && {
							[getAttributeKey(
								'background-image-size',
								isHover,
								prefix,
								'general'
							)]: val,
						}),
					})
				}
			/>
			{getLastBreakpointAttribute(
				`${prefix}background-image-size`,
				breakpoint,
				imageOptions,
				isHover
			) === 'custom' && (
				<ImageCropControl
					mediaID={getLastBreakpointAttribute(
						`${prefix}background-image-mediaID`,
						breakpoint,
						imageOptions,
						isHover
					)}
					cropOptions={getLastBreakpointAttribute(
						`${prefix}background-image-crop-options`,
						breakpoint,
						imageOptions,
						isHover
					)}
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
							...(isGeneral && {
								[getAttributeKey(
									'background-image-crop-options',
									isHover,
									prefix,
									'general'
								)]: cropOptions,
								[getAttributeKey(
									'background-image-mediaURL',
									isHover,
									prefix,
									'general'
								)]: cropOptions.image.source_url,
							}),
						})
					}
				/>
			)}
			{!parallaxStatus && (
				<SelectControl
					label={__('Background repeat', 'maxi-blocks')}
					value={getLastBreakpointAttribute(
						`${prefix}background-image-repeat`,
						breakpoint,
						imageOptions,
						isHover
					)}
					options={[
						{
							label: __('Repeat', 'maxi-blocks'),
							value: 'repeat',
						},
						{
							label: __('No repeat', 'maxi-blocks'),
							value: 'no-repeat',
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
							...(isGeneral && {
								[getAttributeKey(
									'background-image-repeat',
									isHover,
									prefix,
									'general'
								)]: val,
							}),
						})
					}
				/>
			)}
			<SelectControl
				label={__('Background position', 'maxi-blocks')}
				value={getLastBreakpointAttribute(
					`${prefix}background-image-position`,
					breakpoint,
					imageOptions,
					isHover
				)}
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
						...(isGeneral && {
							[getAttributeKey(
								'background-image-position',
								isHover,
								prefix,
								'general'
							)]: val,
						}),
					})
				}
			/>
			{getLastBreakpointAttribute(
				`${prefix}background-image-position`,
				breakpoint,
				imageOptions,
				isHover
			) === 'custom' && (
				<>
					<AdvancedNumberControl
						label={__('Y-axis', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute(
							`${prefix}background-image-position-width-unit`,
							breakpoint,
							imageOptions,
							isHover
						)}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-width-unit',
									isHover,
									prefix,
									breakpoint
								)]: val,
								...(isGeneral && {
									[getAttributeKey(
										'background-image-position-width-unit',
										isHover,
										prefix,
										'general'
									)]: val,
								}),
							})
						}
						value={getLastBreakpointAttribute(
							`${prefix}background-image-position-width`,
							breakpoint,
							imageOptions,
							isHover
						)}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-width',
									isHover,
									prefix,
									breakpoint
								)]: val,
								...(isGeneral && {
									[getAttributeKey(
										'background-image-position-width',
										isHover,
										prefix,
										'general'
									)]: val,
								}),
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
								...(isGeneral && {
									[getAttributeKey(
										'background-image-position-width',
										isHover,
										prefix,
										'general'
									)]: getDefaultAttr(
										'background-image-position-width'
									),
									[getAttributeKey(
										'background-image-position-width-unit',
										isHover,
										prefix,
										'general'
									)]: getDefaultAttr(
										'background-image-position-width-unit'
									),
								}),
							})
						}
					/>
					<AdvancedNumberControl
						label={__('X-axis', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute(
							'background-image-position-height-unit',
							breakpoint,
							imageOptions,
							isHover
						)}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-height-unit',
									isHover,
									prefix,
									breakpoint
								)]: val,
								...(isGeneral && {
									[getAttributeKey(
										'background-image-position-height-unit',
										isHover,
										prefix,
										'general'
									)]: val,
								}),
							})
						}
						value={getLastBreakpointAttribute(
							'background-image-position-height',
							breakpoint,
							imageOptions,
							isHover
						)}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'background-image-position-height',
									isHover,
									prefix,
									breakpoint
								)]: val,
								...(isGeneral && {
									[getAttributeKey(
										'background-image-position-height',
										isHover,
										prefix,
										'general'
									)]: val,
								}),
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
								...(isGeneral && {
									[getAttributeKey(
										'background-image-position-height',
										isHover,
										prefix,
										'general'
									)]: getDefaultAttr(
										'background-image-position-height'
									),
									[getAttributeKey(
										'background-image-position-height-unit',
										isHover,
										prefix,
										'general'
									)]: getDefaultAttr(
										'background-image-position-height-unit'
									),
								}),
							})
						}
					/>
				</>
			)}
			{!parallaxStatus && (
				<>
					<SelectControl
						label={__('Background attachment', 'maxi-blocks')}
						value={getLastBreakpointAttribute(
							`${prefix}background-image-attachment`,
							breakpoint,
							imageOptions,
							isHover
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
								...(isGeneral && {
									[getAttributeKey(
										'background-image-attachment',
										isHover,
										prefix,
										'general'
									)]: val,
								}),
							})
						}
					/>
					<ToggleSwitch
						className='maxi-background-image-more-settings--toggle'
						label={__('More Settings', 'maxi-blocks')}
						selected={moreSettings}
						onChange={val => {
							setMoreSettings(val);
						}}
					/>
					{moreSettings && (
						<div className='maxi-background-image-more-settings'>
							<SelectControl
								label={__('Background origin', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}background-image-origin`,
									breakpoint,
									imageOptions,
									isHover
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
										...(isGeneral && {
											[getAttributeKey(
												'background-image-origin',
												isHover,
												prefix,
												'general'
											)]: val,
										}),
									})
								}
							/>
							<SelectControl
								label={__('Background clip', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}background-image-clip`,
									breakpoint,
									imageOptions,
									isHover
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
										...(isGeneral && {
											[getAttributeKey(
												'background-image-clip',
												isHover,
												prefix,
												'general'
											)]: val,
										}),
									})
								}
							/>
						</div>
					)}
				</>
			)}
			<hr />
			{!disableClipPath && (
				<ClipPath
					clipPath={getLastBreakpointAttribute(
						`${prefix}background-image-clip-path`,
						breakpoint,
						imageOptions,
						isHover
					)}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-image-clip-path',
								isHover,
								prefix,
								breakpoint
							)]: val,
							...(isGeneral && {
								[getAttributeKey(
									'background-image-clip-path',
									isHover,
									prefix,
									'general'
								)]: val,
							}),
						})
					}
				/>
			)}
		</>
	);
};

const ImageLayer = props => {
	const {
		breakpoint,
		onChange,
		isHover,
		prefix,
		hideSettings = false,
		isLayer = false,
	} = props;

	const imageOptions = cloneDeep(props.imageOptions);

	const [moreSettings, setMoreSettings] = useState(false);

	const getDefaultAttr = target => {
		if (isLayer) return getDefaultLayerAttr('imageOptions', target);

		return getDefaultLayerAttr(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	const mediaID = getAttributeValue({
		target: 'background-image-mediaID',
		props: imageOptions,
		prefix,
	});

	return (
		<>
			{!isHover && (
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
					placeholder={__('Set image', 'maxi-blocks')}
					removeButton={__('Remove', 'maxi-blocks')}
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
											<ButtonGroupControl
												className='parallax-direction'
												label={__(
													'Direction',
													'maxi-blocks'
												)}
												selected={
													imageOptions[
														'background-image-parallax-direction'
													]
												}
												options={[
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
												optionType='string'
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
		</>
	);
};

export default ImageLayer;
