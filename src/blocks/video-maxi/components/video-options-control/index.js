/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import { getParsedVideoUrl } from '@extensions/video';

const VideoOptionsControl = props => {
	const {
		onChange,
		isAutoplay,
		isMuted,
		isLoop,
		showPlayerControls,
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
		</>
	);
};

export default VideoOptionsControl;
