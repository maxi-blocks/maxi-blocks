/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../toggle-switch';
import { getParsedVideoUrl } from '../../extensions/video';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import ColorControl from '../color-control';
import VideoIconControl from '../video-icon-control';

const VideoOptionsControl = props => {
	const {
		onChange,
		isAutoplay,
		isMuted,
		isLoop,
		showPlayerControls,
		playerType,
		breakpoint,
		clientId,
		blockStyle,
		videoType,
	} = props;

	const onChangeValue = obj => {
		onChange({ ...obj, embedUrl: getParsedVideoUrl({ ...props, ...obj }) });
	};

	return (
		<>
			{(videoType !== 'direct' || showPlayerControls) && (
				<ToggleSwitch
					label={__('Autoplay', 'maxi-blocks')}
					className='maxi-video-options-control__autoplay'
					selected={isAutoplay}
					onChange={val =>
						onChangeValue({
							isAutoplay: val,
						})
					}
				/>
			)}
			<ToggleSwitch
				label={__('Mute', 'maxi-blocks')}
				className='maxi-video-options-control__mute'
				selected={isMuted}
				onChange={val =>
					onChangeValue({
						isMuted: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Loop', 'maxi-blocks')}
				className='maxi-video-options-control__loop'
				selected={isLoop}
				onChange={val =>
					onChangeValue({
						isLoop: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Player controls', 'maxi-blocks')}
				className='maxi-video-options-control__player-controls'
				selected={showPlayerControls}
				onChange={val => {
					if (videoType === 'direct' && !val) {
						onChangeValue({
							showPlayerControls: val,
							isAutoplay: true,
						});
						return;
					}
					onChangeValue({
						showPlayerControls: val,
					});
				}}
			/>
			{playerType === 'popup' && (
				<>
					<ColorControl
						className='maxi-video-options-control__lightbox-colour'
						label={__('Lightbox background', 'maxi-blocks')}
						color={getLastBreakpointAttribute({
							target: 'lightbox-background-color',
							breakpoint,
							attributes: props,
						})}
						defaultColor={getDefaultAttribute(
							`lightbox-background-color-${breakpoint}`
						)}
						paletteStatus={getLastBreakpointAttribute({
							target: 'lightbox-background-palette-status',
							breakpoint,
							attributes: props,
						})}
						paletteColor={getLastBreakpointAttribute({
							target: 'lightbox-background-palette-color',
							breakpoint,
							attributes: props,
						})}
						paletteOpacity={getLastBreakpointAttribute({
							target: 'lightbox-background-palette-opacity',
							breakpoint,
							attributes: props,
						})}
						onChangeInline={() => null}
						onChange={({
							paletteColor,
							paletteStatus,
							paletteOpacity,
							color,
						}) => {
							onChange({
								[`lightbox-background-palette-status-${breakpoint}`]:
									paletteStatus,
								[`lightbox-background-palette-color-${breakpoint}`]:
									paletteColor,
								[`lightbox-background-palette-opacity-${breakpoint}`]:
									paletteOpacity,
								[`lightbox-background-color-${breakpoint}`]:
									color,
							});
						}}
						disableImage
						disableVideo
						disableGradient
						deviceType={breakpoint}
						clientId={clientId}
						globalProps={{
							target: 'lightbox',
						}}
					/>
					<VideoIconControl
						prefix='close-'
						label={__('Lightbox close button', 'maxi-blocks')}
						blockStyle={blockStyle}
						breakpoint={breakpoint}
						clientId={clientId}
						onChange={obj => onChange(obj)}
						{...getGroupAttributes(
							props,
							['icon', 'iconBackground', 'iconBackgroundColor'],
							false,
							'close-'
						)}
					/>
				</>
			)}
		</>
	);
};

export default VideoOptionsControl;
