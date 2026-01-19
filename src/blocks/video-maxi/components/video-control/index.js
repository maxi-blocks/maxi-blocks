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

const toNumberOrNull = value => {
	if (value === undefined || value === null || value === '') return null;

	const parsed = parseFloat(value);

	return Number.isNaN(parsed) ? null : parsed;
};

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

	const minEndTime = toNumberOrNull(startTime);

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
					const safeVal =
						val !== undefined && val !== '' ? val.toString() : '';
					const startNumber = toNumberOrNull(safeVal);
					const endNumber = toNumberOrNull(endTime);
					let nextEndTime = endTime;

					if (
						startNumber !== null &&
						endNumber !== null &&
						endNumber < startNumber
					) {
						nextEndTime = safeVal;
					}

					const embedUrl = getParsedVideoUrl({
						...props,
						startTime: safeVal,
						endTime: nextEndTime,
					});

					onChange({
						startTime: safeVal,
						...(nextEndTime !== endTime
							? { endTime: nextEndTime }
							: {}),
						embedUrl,
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
					const safeVal =
						val !== undefined && val !== '' ? val.toString() : '';
					const endNumber = toNumberOrNull(safeVal);
					const startNumber = toNumberOrNull(startTime);
					let nextEndTime = safeVal;

					if (
						endNumber !== null &&
						startNumber !== null &&
						endNumber < startNumber
					) {
						nextEndTime = startTime.toString();
					}

					const embedUrl = getParsedVideoUrl({
						...props,
						endTime: nextEndTime,
					});

					onChange({
						...(nextEndTime !== safeVal
							? { endTime: nextEndTime }
							: { endTime: safeVal }),
						embedUrl,
					});
				}}
				min={minEndTime !== null ? minEndTime : 0}
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
