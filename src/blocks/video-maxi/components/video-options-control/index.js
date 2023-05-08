/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ToggleSwitch } from '../../../../components';
import { getParsedVideoUrl } from '../../../../extensions/video';

const VideoOptionsControl = props => {
	const {
		onChange,
		_ia: isAutoplay,
		_im: isMuted,
		_il: isLoop,
		_spc: showPlayerControls,
		_vt: videoType,
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
							_ia: val,
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
						_im: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Loop', 'maxi-blocks')}
				className='maxi-video-options-control__loop'
				selected={isLoop}
				onChange={val =>
					onChangeValue({
						_il: val,
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
							_spc: val,
							_ia: true,
						});
						return;
					}
					onChangeValue({
						_spc: val,
					});
				}}
			/>
		</>
	);
};

export default VideoOptionsControl;
