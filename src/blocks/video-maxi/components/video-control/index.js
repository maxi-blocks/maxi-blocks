/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getParsedVideoUrl,
	parseVideo,
	videoUrlRegex,
} from '../../../../extensions/video';
import {
	AdvancedNumberControl,
	SelectControl,
	SettingTabsControl,
	TextInput,
} from '../../../../components';

const VideoControl = props => {
	const {
		onChange,
		url: videoUrl,
		startTime,
		endTime,
		videoRatio,
		playerType,
	} = props;

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
			<div className='maxi-base-control__field maxi-video-sidebar-url'>
				<label className='maxi-base-control__label' htmlFor='url'>
					{__('URL', 'maxi-blocks')}
				</label>
				<TextInput
					id='url'
					className='maxi-sidebar-input'
					label={__('URL', 'maxi-blocks')}
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
			</div>
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
					})
				}
				optionType='string'
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
