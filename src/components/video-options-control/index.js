/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../toggle-switch';
import { getParsedVideoUrl } from '../../extensions/video';

const VideoOptionsControl = props => {
	const {
		onChange,
		isAutoplay,
		isMuted,
		isLoop,
		showPlayerControls,
		isLightbox,
		reduceBorders,
	} = props;

	const onChangeValue = obj => {
		onChange({ ...obj, embedUrl: getParsedVideoUrl({ ...props, ...obj }) });
	};

	return (
		<>
			<ToggleSwitch
				label={__('Autoplay', 'maxi-blocks')}
				className='maxi-video-options-control__open-in-lightbox'
				selected={isAutoplay}
				onChange={val =>
					onChangeValue({
						isAutoplay: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Mute', 'maxi-blocks')}
				className='maxi-video-options-control__open-in-lightbox'
				selected={isMuted}
				onChange={val =>
					onChangeValue({
						isMuted: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Loop', 'maxi-blocks')}
				className='maxi-video-options-control__open-in-lightbox'
				selected={isLoop}
				onChange={val =>
					onChangeValue({
						isLoop: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Player controls', 'maxi-blocks')}
				className='maxi-video-options-control__open-in-lightbox'
				selected={showPlayerControls}
				onChange={val =>
					onChangeValue({
						showPlayerControls: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Reduce black borders', 'maxi-blocks')}
				className='maxi-video-options-control__open-in-lightbox'
				selected={reduceBorders}
				onChange={val =>
					onChangeValue({
						reduceBorders: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Open in lightbox', 'maxi-blocks')}
				className='maxi-video-options-control__open-in-lightbox'
				selected={isLightbox}
				onChange={val =>
					onChangeValue({
						isLightbox: val,
					})
				}
			/>
		</>
	);
};

export default VideoOptionsControl;
