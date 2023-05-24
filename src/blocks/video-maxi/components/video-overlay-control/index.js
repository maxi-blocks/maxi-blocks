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
import OpacityControl from '../../../../components/opacity-control';
import withRTC from '../../../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

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
				target: 'o-bc_cc',
				breakpoint,
				attributes: props,
				isHover,
			})}
			defaultColor={getDefaultAttribute(
				getAttributeKey({ key: 'o-bc_cc', isHover, breakpoint })
			)}
			paletteStatus={getLastBreakpointAttribute({
				target: 'o-bc_ps',
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: 'o-bc_pc',
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: 'o-bc_po',
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
					[getAttributeKey({ key: 'o-bc_ps', isHover, breakpoint })]:
						paletteStatus,
					[getAttributeKey({ key: 'o-bc_pc', isHover, breakpoint })]:
						paletteColor,
					[getAttributeKey({ key: 'o-bc_po', isHover, breakpoint })]:
						paletteOpacity,
					[getAttributeKey({ key: 'o-bc_cc', isHover, breakpoint })]:
						color,
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

const OverlayColorControl = withRTC(OverlayColor);

const VideoOverlayControl = props => {
	const {
		onChange,
		_hi: hideImage,
		disableHideImage = false,
		disableUploadImage = false,
		disableHover = false,
		breakpoint,
		altSelector,
		mediaID,
	} = props;
	const overLayBackgroundStatusHover = getAttributesValue({
		target: 'b.sh',
		props,
		prefix: 'o-',
	});

	const mediaPrefix = 'om-';
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
					onChange={val => onChange({ _hi: val })}
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
									o_mi: val.id,
									o_mu: val.url,
									o_mal:
										altSelector === 'wordpress' && !alt
											? val.title
											: alt,
								});
							}}
							onRemoveImage={() =>
								onChange({
									o_mi: null,
									o_mu: '',
									o_mal: '',
								})
							}
						/>
					)}
					<AdvancedNumberControl
						label={__('Image width', 'maxi-blocks')}
						className='maxi-video-overlay-control__width'
						enableUnit
						unit={getLastBreakpointAttribute({
							target: '_w.u',
							prefix: mediaPrefix,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[`${mediaPrefix}_w.u-${breakpoint}`]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: '_w',
							prefix: mediaPrefix,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[`${mediaPrefix}_w-${breakpoint}`]: val,
							})
						}
						defaultValue={getDefaultAttribute(
							`${mediaPrefix}_w-${breakpoint}`
						)}
						onReset={() => {
							onChange({
								[`${mediaPrefix}_w-${breakpoint}`]:
									getDefaultAttribute(
										`${mediaPrefix}_w-${breakpoint}`
									),
								[`${mediaPrefix}_w.u-${breakpoint}`]:
									getDefaultAttribute(
										`${mediaPrefix}_w.u-${breakpoint}`
									),
								isReset: true,
							});
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
						optionType='string'
					/>
					<AdvancedNumberControl
						label={__('Image height', 'maxi-blocks')}
						className='maxi-video-overlay-control__height'
						enableUnit
						unit={getLastBreakpointAttribute({
							target: '_h.u',
							prefix: mediaPrefix,
							breakpoint,
							attributes: props,
						})}
						onChangeUnit={val =>
							onChange({
								[`${mediaPrefix}_h.u-${breakpoint}`]: val,
							})
						}
						value={getLastBreakpointAttribute({
							target: '_h',
							prefix: mediaPrefix,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[`${mediaPrefix}_h-${breakpoint}`]: val,
							})
						}
						defaultValue={getDefaultAttribute(
							`${mediaPrefix}_h-${breakpoint}`
						)}
						onReset={() => {
							onChange({
								[`${mediaPrefix}_h-${breakpoint}`]:
									getDefaultAttribute(
										`${mediaPrefix}_h-${breakpoint}`
									),
								[`${mediaPrefix}_h.u-${breakpoint}`]:
									getDefaultAttribute(
										`${mediaPrefix}_h.u-${breakpoint}`
									),
								isReset: true,
							});
						}}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
						optionType='string'
					/>
					<OpacityControl
						label={__('Image opacity', 'maxi-blocks')}
						opacity={getLastBreakpointAttribute({
							target: '_o',
							prefix: mediaPrefix,
							breakpoint,
							attributes: props,
						})}
						breakpoint={breakpoint}
						prefix={mediaPrefix}
						onChange={onChange}
						disableRTC
					/>
				</>
			)}
			{disableHover && <OverlayColorControl {...props} />}
			{!disableHover && (
				<SettingTabsControl
					depth={2}
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: <OverlayColorControl {...props} />,
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
										selected={overLayBackgroundStatusHover}
										onChange={val =>
											onChange({
												'o-b.sh': val,
											})
										}
									/>
									{overLayBackgroundStatusHover && (
										<OverlayColorControl
											{...props}
											isHover
										/>
									)}
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
