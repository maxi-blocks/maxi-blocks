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
import SelectControl from '../select-control';
import { getParsedVideoUrl, parseVideo } from '../../extensions/video';

const VideoControl = props => {
	const { onChange, url: videoUrl, startTime, endTime, videoRatio } = props;

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
						embedUrl: getParsedVideoUrl({ ...props, url: val }),
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
			<SelectControl
				className='maxi-video-control__ratio'
				label={__('Aspect ratio', 'maxi-blocks')}
				value={videoRatio}
				options={[
					{
						label: __('None', 'maxi-blocks'),
						value: 'initial',
					},
					{
						label: __('1:1 Aspect ratio', 'maxi-blocks'),
						value: 'ar11',
					},
					{
						label: __('2:3 Aspect ratio', 'maxi-blocks'),
						value: 'ar23',
					},
					{
						label: __('3:2 Aspect ratio', 'maxi-blocks'),
						value: 'ar32',
					},
					{
						label: __('4:3 Aspect ratio', 'maxi-blocks'),
						value: 'ar43',
					},
					{
						label: __('16:9 Aspect ratio', 'maxi-blocks'),
						value: 'ar169',
					},
				]}
				onChange={newRatio =>
					onChange({
						videoRatio: newRatio,
					})
				}
			/>
		</>
	);
};

export default VideoControl;
