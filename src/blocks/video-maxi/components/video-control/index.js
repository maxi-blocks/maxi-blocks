/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AspectRatioControl from '@components/aspect-ratio-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TextControl from '@components/text-control';
import {
	getParsedVideoUrl,
	parseVideo,
	videoUrlRegex,
} from '@extensions/video';
import { getDefaultAttribute } from '@extensions/styles';

const VideoControl = props => {
	const {
		onChange,
		url: videoUrl,
		startTime,
		endTime,
		videoRatio,
		videoRatioCustom,
		playerType,
	} = props;

	const defaultURL = 'https://www.youtube.com/watch?v=ScMzIvxBSi4';

	const [validationText, setValidationText] = useState(null);
	return (
		<>
			<SettingTabsControl
				className='maxi-video-control__player-type'
				type='buttons'
				items={[
					{
						label: __('Video', 'maxi-blocks'),
						value: 'video',
					},
					{
						label: __('Popup', 'maxi-blocks'),
						value: 'popup',
					},
				]}
				onChange={val =>
					onChange({
						playerType: val,
					})
				}
				selected={playerType}
				fullWidthMode
			/>

			<TextControl
				id='url'
				className='maxi-sidebar-input maxi-video-sidebar-url'
				label={__('URL', 'maxi-blocks')}
				type='url'
				value={videoUrl}
				placeholder={defaultURL}
				onChange={val => {
					if (val && !videoUrlRegex.test(val)) {
						setValidationText(
							__('Invalid video URL', 'maxi-blocks')
						);
					} else {
						setValidationText(null);
					}

					onChange({
						url: val !== '' ? val : defaultURL,
						embedUrl: getParsedVideoUrl({
							...props,
							url: val !== '' ? val : defaultURL,
						}),
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
					const safeVal = val !== undefined && val !== '' ? val : '';
					onChange({
						startTime: safeVal,
						embedUrl: getParsedVideoUrl({
							...props,
							startTime: safeVal,
						}),
					});
				}}
				min={0}
				max={999}
				onReset={() =>
					onChange({
						startTime: '',
						isReset: true,
					})
				}
				optionType='string'
			/>
			<AdvancedNumberControl
				className='maxi-video-end-time'
				label={__('End time (s)', 'maxi-blocks')}
				value={endTime}
				onChangeValue={val => {
					const safeVal = val !== undefined && val !== '' ? val : '';
					onChange({
						endTime: safeVal,
						embedUrl: getParsedVideoUrl({
							...props,
							endTime: safeVal,
						}),
					});
				}}
				min={0}
				max={999}
				onReset={() =>
					onChange({
						endTime: '',
						isReset: true,
					})
				}
				optionType='string'
			/>
			<AspectRatioControl
				className='maxi-video-control__ratio'
				label={__('Aspect ratio', 'maxi-blocks')}
				value={videoRatio}
				customValue={videoRatioCustom}
				additionalOptions={[
					{
						label: __('None', 'maxi-blocks'),
						value: 'initial',
					},
				]}
				onChange={videoRatio => onChange({ videoRatio })}
				onChangeCustomValue={videoRatioCustom =>
					onChange({ videoRatioCustom })
				}
				onReset={() =>
					onChange({
						videoRatio: getDefaultAttribute('videoRatio'),
						isReset: true,
					})
				}
				onResetCustomValue={() =>
					onChange({
						videoRatioCustom:
							getDefaultAttribute('videoRatioCustom'),
						isReset: true,
					})
				}
			/>
		</>
	);
};

export default VideoControl;
