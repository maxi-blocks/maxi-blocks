/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import __experimentalClipPath from '../clip-path-control';
import __experimentalOpacityControl from '../opacity-control';
import __experimentalNumberControl from '../number-control';
import __experimentalTextControl from '../text-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * Component
 */
const VideoLayer = props => {
	const {
		videoOptions,
		defaultVideoOptions,
		onChange,
		disableClipPath,
	} = props;

	return (
		<div className='maxi-background-control__video'>
			<__experimentalTextControl
				label='URL'
				type='video-url'
				help='add video'
				value={videoOptions.mediaURL}
				placeholder='Youtube, Vimeo, or Direct Link'
				onChange={val => {
					videoOptions.mediaURL = val;
					onChange(videoOptions);
				}}
			/>

			<__experimentalNumberControl
				label={__('Start Time (s)', 'maxi-blocks')}
				min={0}
				max={999}
				defaultValue=''
				value={videoOptions.startTime}
				onChange={val => {
					videoOptions.startTime = val;
					onChange(videoOptions);
				}}
			/>
			<__experimentalNumberControl
				label={__('End Time (s)', 'maxi-blocks')}
				min={0}
				max={999}
				defaultValue=''
				value={videoOptions.endTime}
				onChange={val => {
					videoOptions.endTime = val;
					if (val) {
						videoOptions.loop = 0;
					}
					onChange(videoOptions);
				}}
			/>
			<__experimentalFancyRadioControl
				label={__('Loop', 'maxi-blocks')}
				selected={Number(videoOptions.loop)}
				options={[
					{
						label: __('No', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Yes', 'maxi-blocks'),
						value: 1,
					},
				]}
				disabled={!!Number(videoOptions.endTime)}
				onChange={val => {
					videoOptions.loop = Number(val);
					onChange(videoOptions);
				}}
			/>
			<__experimentalFancyRadioControl
				label={__('Play on Mobile', 'maxi-blocks')}
				selected={Number(videoOptions.playOnMobile)}
				options={[
					{
						label: __('No', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Yes', 'maxi-blocks'),
						value: 1,
					},
				]}
				onChange={val => {
					videoOptions.playOnMobile = Number(val);
					onChange(videoOptions);
				}}
			/>

			{!disableClipPath && (
				<__experimentalClipPath
					clipPath={videoOptions.clipPath}
					onChange={val => {
						videoOptions.clipPath = val;
						onChange(videoOptions);
					}}
				/>
			)}

			<__experimentalOpacityControl
				label={__('Video Opacity', 'maxi-blocks')}
				fullWidthMode
				opacity={videoOptions.opacity}
				defaultOpacity={defaultVideoOptions.opacity}
				onChange={val => {
					videoOptions.opacity = JSON.parse(val);
					onChange(videoOptions);
				}}
			/>
			<MediaUploaderControl
				className='maxi-mediauploader-control__video-fallback'
				placeholder={__('Background Fallback')}
				mediaID={videoOptions.fallbackID}
				onSelectImage={val => {
					videoOptions.fallbackID = val.id;
					videoOptions.fallbackURL = val.url;
					onChange(videoOptions);
				}}
				onRemoveImage={() => {
					videoOptions.fallbackID = '';
					videoOptions.fallbackURL = '';
					onChange(videoOptions);
				}}
			/>
		</div>
	);
};

export default VideoLayer;
