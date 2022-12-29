/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ColorControl,
	ToggleSwitch,
	SettingTabsControl,
	AdvancedNumberControl,
} from '../../../../components';
import MediaUploaderControl from '../../../../components/media-uploader-control';
import { handleOnReset } from '../../../../extensions/attributes';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

const OverlayColor = props => {
	const {
		breakpoint,
		clientId,
		onChange,
		insertInlineStyles,
		inlineStylesTargets,
		cleanInlineStyles,
		isHover = false,
	} = props;

	return (
		<ColorControl
			className='maxi-video-overlay-control__overlay-background-colour'
			label={__('Overlay background', 'maxi-blocks')}
			color={getLastBreakpointAttribute({
				target: 'overlay-background-color',
				breakpoint,
				attributes: props,
				isHover,
			})}
			defaultColor={getDefaultAttribute(
				getAttributeKey(
					'overlay-background-color',
					isHover,
					'',
					breakpoint
				)
			)}
			paletteStatus={getLastBreakpointAttribute({
				target: 'overlay-background-palette-status',
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: 'overlay-background-palette-color',
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: 'overlay-background-palette-opacity',
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeInline={({ color }) =>
				insertInlineStyles &&
				!isHover &&
				insertInlineStyles({
					obj: {
						background: color,
					},
					target: inlineStylesTargets.overlay,
				})
			}
			onChange={({
				paletteColor,
				paletteStatus,
				paletteOpacity,
				color,
			}) => {
				onChange({
					[getAttributeKey(
						'overlay-background-palette-status',
						isHover,
						'',
						breakpoint
					)]: paletteStatus,
					[getAttributeKey(
						'overlay-background-palette-color',
						isHover,
						'',
						breakpoint
					)]: paletteColor,
					[getAttributeKey(
						'overlay-background-palette-opacity',
						isHover,
						'',
						breakpoint
					)]: paletteOpacity,
					[getAttributeKey(
						'overlay-background-color',
						isHover,
						'',
						breakpoint
					)]: color,
				});
				cleanInlineStyles &&
					cleanInlineStyles(inlineStylesTargets.overlay);
			}}
			disableImage
			disableVideo
			disableGradient
			deviceType={breakpoint}
			clientId={clientId}
			globalProps={{
				target: 'overlay',
			}}
			isHover={isHover}
		/>
	);
};

const VideoOverlayControl = props => {
	const {
		onChange,
		hideImage,
		disableHideImage = false,
		disableUploadImage = false,
		disableHover = false,
		'overlay-mediaID': mediaID,
		'overlay-altSelector': altSelector,
		breakpoint,
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		vh: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 300,
			minRange: 0,
			maxRange: 300,
		},
	};

	return (
		<>
			{!disableHideImage && (
				<ToggleSwitch
					className='maxi-video-overlay-control__hide-image'
					label={__('Hide image(icon only)', 'maxi-blocks')}
					selected={hideImage}
					onChange={val => onChange({ hideImage: val })}
				/>
			)}
			{!hideImage && (
				<>
					{!disableUploadImage && (
						<MediaUploaderControl
							className='maxi-video-overlay-control__cover-image'
							placeholder={__('Image overlay')}
							mediaID={mediaID}
							onSelectImage={val => {
								const alt =
									(altSelector === 'wordpress' && val?.alt) ||
									(altSelector === 'title' && val?.title) ||
									null;

								onChange({
									'overlay-mediaID': val.id,
									'overlay-mediaURL': val.url,
									'overlay-mediaAlt':
										altSelector === 'wordpress' && !alt
											? val.title
											: alt,
								});
							}}
							onRemoveImage={() =>
								onChange({
									'overlay-mediaID': null,
									'overlay-mediaURL': '',
									'overlay-mediaAlt': '',
								})
							}
						/>
					)}
					<AdvancedNumberControl
						label={__('Width', 'maxi-blocks')}
						className='maxi-video-overlay-control__width'
						enableUnit
						unit={getLastBreakpointAttribute({
							target: 'overlay-media-width-unit',
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[`overlay-media-width-unit-${breakpoint}`]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: 'overlay-media-width',
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[`overlay-media-width-${breakpoint}`]: val,
							})
						}
						defaultValue={getDefaultAttribute(
							`overlay-media-width-${breakpoint}`
						)}
						onReset={() => {
							onChange(
								handleOnReset({
									[`overlay-media-width-${breakpoint}`]:
										getDefaultAttribute(
											`overlay-media-width-${breakpoint}`
										),
									[`overlay-media-width-unit-${breakpoint}`]:
										getDefaultAttribute(
											`overlay-media-width-unit-${breakpoint}`
										),
								})
							);
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
						optionType='string'
					/>
					<AdvancedNumberControl
						label={__('Height', 'maxi-blocks')}
						className='maxi-video-overlay-control__height'
						enableUnit
						unit={getLastBreakpointAttribute({
							target: 'overlay-media-height-unit',
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[`overlay-media-height-unit-${breakpoint}`]:
									val,
							})
						}
						value={getLastBreakpointAttribute({
							target: 'overlay-media-height',
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[`overlay-media-height-${breakpoint}`]: val,
							})
						}
						defaultValue={getDefaultAttribute(
							`overlay-media-height-${breakpoint}`
						)}
						onReset={() => {
							onChange(
								handleOnReset({
									[`overlay-media-height-${breakpoint}`]:
										getDefaultAttribute(
											`overlay-media-height-${breakpoint}`
										),
									[`overlay-media-height-unit-${breakpoint}`]:
										getDefaultAttribute(
											`overlay-media-height-unit-${breakpoint}`
										),
								})
							);
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
						optionType='string'
					/>
				</>
			)}
			{disableHover && <OverlayColor {...props} />}
			{!disableHover && (
				<SettingTabsControl
					depth={2}
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: <OverlayColor {...props} />,
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: (
								<>
									<ToggleSwitch
										label={__(
											'Enable hover',
											'maxi-blocks'
										)}
										selected={
											props[
												'overlay-background-status-hover'
											]
										}
										onChange={val =>
											onChange({
												'overlay-background-status-hover':
													val,
											})
										}
									/>
									{props[
										'overlay-background-status-hover'
									] && <OverlayColor {...props} isHover />}
								</>
							),
						},
					]}
				/>
			)}
		</>
	);
};

export default VideoOverlayControl;
