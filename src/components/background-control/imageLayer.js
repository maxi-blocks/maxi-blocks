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
	getAttributesValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
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

	const parallaxStatus = getAttributesValue({
		target: 'bi_pa.s',
		props: imageOptions,
		prefix,
	});

	return (
		<>
			<OpacityControl
				label={__('Background opacity', 'maxi-blocks')}
				opacity={getLastBreakpointAttribute({
					target: 'bi_o',
					breakpoint,
					attributes: imageOptions,
					isHover,
					prefix,
				})}
				breakpoint={breakpoint}
				prefix={`${prefix}bi`}
				isHover={isHover}
				onChange={onChange}
				disableRTC
			/>
			<SelectControl
				label={__('Background size', 'maxi-blocks')}
				className='maxi-background-control__image-layer__size-selector'
				value={getLastBreakpointAttribute({
					target: 'bi_si',
					breakpoint,
					attributes: imageOptions,
					isHover,
					prefix,
				})}
				defaultValue={getDefaultAttr('bi_si')}
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
						[getAttributeKey('bi_si', isHover, prefix, breakpoint)]:
							val,
					})
				}
				onReset={() =>
					onChange({
						[getAttributeKey('bi_si', isHover, prefix, breakpoint)]:
							getDefaultAttr('bi_si'),
					})
				}
			/>
			{getLastBreakpointAttribute({
				target: 'bi_si',
				breakpoint,
				attributes: imageOptions,
				isHover,
				prefix,
			}) === 'custom' && (
				<ImageCropControl
					mediaID={getAttributesValue({
						target: 'bi_mi',
						props: imageOptions,
						prefix,
					})}
					cropOptions={getLastBreakpointAttribute({
						target: 'bi_co',
						breakpoint,
						attributes: imageOptions,
						isHover,
						prefix,
					})}
					onChange={cropOptions =>
						onChange({
							[getAttributeKey(
								'bi_co',
								isHover,
								prefix,
								breakpoint
							)]: cropOptions,
							[getAttributeKey(
								'bi_mu',
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
						target: 'bi_re',
						breakpoint,
						attributes: imageOptions,
						isHover,
						prefix,
					})}
					defaultValue={getDefaultAttr('bi_re')}
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
								'bi_re',
								isHover,
								prefix,
								breakpoint
							)]: val,
						})
					}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'bi_re',
								isHover,
								prefix,
								breakpoint
							)]: getDefaultAttr('bi_re'),
						})
					}
				/>
			)}
			<SelectControl
				label={__('Background position', 'maxi-blocks')}
				className='maxi-background-control__image-layer__position-selector'
				value={getLastBreakpointAttribute({
					target: 'bi_pos',
					breakpoint,
					attributes: imageOptions,
					isHover,
					prefix,
				})}
				defaultValue={getDefaultAttr('bi_pos')}
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
							'bi_pos',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() =>
					onChange({
						[getAttributeKey(
							'bi_pos',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttr('bi_pos'),
					})
				}
			/>
			{getLastBreakpointAttribute({
				target: 'bi_pos',
				breakpoint,
				attributes: imageOptions,
				isHover,
				prefix,
			}) === 'custom' && (
				<>
					<AdvancedNumberControl
						label={__('Y-axis', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: 'bi_pos_w.u',
							breakpoint,
							attributes: imageOptions,
							isHover,
							prefix,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'bi_pos_w.u',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: 'bi_pos_w',
							breakpoint,
							attributes: imageOptions,
							isHover,
							prefix,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'bi_pos_w',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'bi_pos_w',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr('bi_pos_w'),
								[getAttributeKey(
									'bi_pos_w.u',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr('bi_pos_w.u'),
								isReset: true,
							})
						}
					/>
					<AdvancedNumberControl
						label={__('X-axis', 'maxi-blocks')}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: 'bi_pos_h.u',
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						onChangeUnit={val =>
							onChange({
								[getAttributeKey(
									'bi_pos_h.u',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: 'bi_pos_h',
							breakpoint,
							attributes: imageOptions,
							isHover,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'bi_pos_h',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'bi_pos_h',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr('bi_pos_h'),
								[getAttributeKey(
									'bi_pos_h.u',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr('bi_pos_h.u'),
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
							target: 'bi_at',
							breakpoint,
							attributes: imageOptions,
							isHover,
							prefix,
						})}
						defaultValue={getDefaultAttr('bi_at')}
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
									'bi_at',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'bi_at',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttr('bi_at'),
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
									target: 'bi_ori',
									breakpoint,
									attributes: imageOptions,
									isHover,
									prefix,
								})}
								defaultValue={getDefaultAttr('bi_ori')}
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
											'bi_ori',
											isHover,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'bi_ori',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttr('bi_ori'),
									})
								}
							/>
							<SelectControl
								label={__('Background clip', 'maxi-blocks')}
								className='maxi-background-control__image-layer__clip-selector'
								value={getLastBreakpointAttribute({
									target: 'bi_clp',
									breakpoint,
									attributes: imageOptions,
									isHover,
									prefix,
								})}
								defaultValue={getDefaultAttr('bi_clp')}
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
											'bi_clp',
											isHover,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'bi_clp',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttr('bi_clp'),
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
						'bi'
					)}
					{...imageOptions}
					isHover={isHover}
					isIB={isIB}
					prefix='bi'
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

	const mediaID = getAttributesValue({
		target: 'bi_mi',
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
							[getAttributeKey('bi_mi', isHover, prefix)]:
								imageData.id,
							[getAttributeKey('bi_mu', isHover, prefix)]:
								imageData.url,
							[getAttributeKey('bi_w', isHover, prefix)]:
								imageData.width,
							[getAttributeKey('bi_h', isHover, prefix)]:
								imageData.height,
						})
					}
					onRemoveImage={() =>
						onChange({
							[getAttributeKey('bi_mi', false, prefix)]: '',
							[getAttributeKey('bi_mu', false, prefix)]: '',
							[getAttributeKey('bi_w', isHover, prefix)]: '',
							[getAttributeKey('bi_h', isHover, prefix)]: '',
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
										selected={imageOptions['bi_pa.s']}
										onChange={val =>
											onChange({
												'bi_pa.s': val,
											})
										}
									/>
									{imageOptions['bi_pa.s'] && (
										<>
											<SettingTabsControl
												className='parallax-direction'
												type='buttons'
												label={__(
													'Direction',
													'maxi-blocks'
												)}
												selected={imageOptions.bi_pd}
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
														bi_pd: val,
													})
												}
											/>
											<AdvancedNumberControl
												label={__(
													'Speed',
													'maxi-blocks'
												)}
												value={imageOptions.bi_psp}
												onChangeValue={val => {
													onChange({
														bi_psp:
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
														bi_psp: getDefaultAttr(
															'bi_psp'
														),
														isReset: true,
													})
												}
												initialPosition={getDefaultAttr(
													'bi_psp'
												)}
											/>
											<ImageAltControl
												mediaID={mediaID}
												altSelector={getAttributesValue(
													{
														target: 'bi_pas',
														props: imageOptions,
														prefix,
													}
												)}
												mediaAlt={getAttributesValue({
													target: 'bi_pal',
													props: imageOptions,
													prefix,
												})}
												onChange={({
													altSelector,
													mediaAlt,
												}) => {
													onChange({
														...(altSelector && {
															bi_pas: altSelector,
														}),
														...(mediaAlt && {
															bi_pal: mediaAlt,
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
