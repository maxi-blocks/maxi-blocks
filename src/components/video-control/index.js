/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import TextControl from '../text-control';
import { getParsedVideoUrl, parseVideo } from '../../extensions/video';

const VideoControl = props => {
	const { onChange, url: videoUrl, startTime, endTime } = props;

	const [validationText, setValidationText] = useState(null);

	const videoUrlRegex =
		/(https?:\/\/)www.(youtube.com\/watch[?]v=([a-zA-Z0-9_-]{11}))|https?:\/\/(www.)?vimeo.com\/([0-9]{9})|https?:\/\/.*\.(?:mp4|webm|ogg)$/g;

	return (
		<>
			<TextControl
				label='URL'
				type='url'
				value={videoUrl}
				placeholder='Youtube, Vimeo, or Direct Link'
				onChange={val => {
					if (val && !videoUrlRegex.test(val)) {
						setValidationText(
							__('Invalid video URL', 'maxi-blocks')
						);
					} else {
						setValidationText(null);
					}

					onChange({
						url: val,
						embedUrl: getParsedVideoUrl({ val, ...props }),
						videoType: parseVideo(val).type,
					});
				}}
				validationText={validationText}
			/>
			<AdvancedNumberControl
				className='maxi-video-start-time'
				label={__('Start time (s)', 'maxi-blocks')}
				value={startTime}
				onChangeValue={val => {
					onChange({
						startTime: val !== undefined && val !== '' ? val : '',
					});
				}}
				min={0}
				max={999}
				onReset={() =>
					onChange({
						startTime: '',
					})
				}
			/>
			<AdvancedNumberControl
				className='maxi-video-end-time'
				label={__('End time (s)', 'maxi-blocks')}
				value={endTime}
				onChangeValue={val =>
					onChange({
						endTime: val !== undefined && val !== '' ? val : '',
					})
				}
				min={0}
				max={999}
				onReset={() =>
					onChange({
						endTime: '',
					})
				}
			/>
		</>
	);
};

export default VideoControl;
