/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { TextControl, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import __experimentalClipPath from '../clip-path-control';
import __experimentalOpacityControl from '../opacity-control';
import __experimentalNumberControl from '../number-control';

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
			<TextControl
				label='URL'
				type='url'
				value={videoOptions.mediaURL}
				placeholder='Add Youtube, Vimeo, or Direct Link'
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
			<SelectControl
				label={__('Loop', 'maxi-blocks')}
				value={videoOptions.loop}
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
					videoOptions.loop = val;

					onChange(videoOptions);
				}}
			/>
			<SelectControl
				label={__('Play on Mobile', 'maxi-blocks')}
				value={videoOptions.playOnMobile}
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
					videoOptions.playOnMobile = val;

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

// export const VideoLayerOpened = props => {
// 	const {
// 		videoOptions,
// 		defaultVideoOptions,
// 		onChange,
// 		onDoneEdition,
// 		onRemoveImage,
// 	} = props;

// 	return (
// 		<SettingTabsControl
// 			items={[
// 				{
// 					label: __('Video', 'maxi-blocks'),
// 					className: 'maxi-background-control__image-tab',
// 					uuid: 'maxi-background-control__image-tab',
// 					content: (
// 						<MediaUploaderControl
// 							mediaType='video'
// 							mediaID={videoOptions.mediaID}
// 							onSelectImage={imageData => {
// 								videoOptions.mediaID = imageData.id;
// 								videoOptions.mediaURL = imageData.url;

// 								onChange(videoOptions);
// 							}}
// 							onRemoveImage={() => {
// 								videoOptions.mediaID = '';
// 								videoOptions.mediaURL = '';
// 								onRemoveImage();

// 								onChange(videoOptions);
// 							}}
// 							extendSelector={
// 								<Button
// 									isSecondary
// 									onClick={onDoneEdition}
// 									className='maxi-background-control__done-edition'
// 								>
// 									{__('Done', 'maxi-blocks')}
// 								</Button>
// 							}
// 							replaceButton={__('Replace', 'maxi-blocks')}
// 							removeButton={__('Delete', 'maxi-blocks')}
// 							// alternativeImage={getAlternativeImage(selector)} // ????
// 							allowedTypes={['video']}
// 						/>
// 					),
// 				},
// 				{
// 					label: __('Settings', 'maxi-blocks'),
// 					className: 'maxi-background-control__background-tab',
// 					content: (
// 						<Fragment>
// 							<SizeControl
// 								label={__('Width', 'maxi-blocks')}
// 								unit={videoOptions.widthUnit}
// 								defaultUnit={defaultVideoOptions.widthUnit}
// 								onChangeUnit={val => {
// 									videoOptions.widthUnit = val;

// 									onChange(videoOptions);
// 								}}
// 								value={videoOptions.width}
// 								defaultValue={defaultVideoOptions.width}
// 								onChangeValue={val => {
// 									videoOptions.width = val;

// 									onChange(videoOptions);
// 								}}
// 								minMaxSettings={{
// 									px: {
// 										min: 0,
// 										max: 999,
// 									},
// 									em: {
// 										min: 0,
// 										max: 999,
// 									},
// 									vw: {
// 										min: 0,
// 										max: 999,
// 									},
// 									'%': {
// 										min: 0,
// 										max: 100,
// 									},
// 								}}
// 							/>
// 							<SizeControl
// 								label={__('Height', 'maxi-blocks')}
// 								unit={videoOptions.heightUnit}
// 								defaultUnit={defaultVideoOptions.heightUnit}
// 								onChangeUnit={val => {
// 									videoOptions.heightUnit = val;

// 									onChange(videoOptions);
// 								}}
// 								value={videoOptions.height}
// 								defaultValue={defaultVideoOptions.height}
// 								onChangeValue={val => {
// 									videoOptions.height = val;

// 									onChange(videoOptions);
// 								}}
// 								minMaxSettings={{
// 									px: {
// 										min: 0,
// 										max: 999,
// 									},
// 									em: {
// 										min: 0,
// 										max: 999,
// 									},
// 									vw: {
// 										min: 0,
// 										max: 999,
// 									},
// 									'%': {
// 										min: 0,
// 										max: 100,
// 									},
// 								}}
// 							/>
// 							<SelectControl
// 								label={__('Fill', 'maxi-blocks')}
// 								value={videoOptions.fill}
// 								options={[
// 									{
// 										label: __('Cover', 'maxi-blocks'),
// 										value: 'cover',
// 									},
// 									{
// 										label: __('Contain', 'maxi-blocks'),
// 										value: 'contain',
// 									},
// 									{
// 										label: __('Fill', 'maxi-blocks'),
// 										value: 'fill',
// 									},
// 									{
// 										label: __('Scale-down', 'maxi-blocks'),
// 										value: 'scale-down',
// 									},
// 									{
// 										label: __('None', 'maxi-blocks'),
// 										value: 'none',
// 									},
// 								]}
// 								onChange={val => {
// 									videoOptions.fill = val;

// 									onChange(videoOptions);
// 								}}
// 							/>
// 							<SelectControl
// 								label={__('Position', 'maxi-blocks')}
// 								value={videoOptions.position}
// 								options={[
// 									{
// 										label: __('Unset', 'maxi-blocks'),
// 										value: 'unset',
// 									},
// 									{
// 										label: __('Top', 'maxi-blocks'),
// 										value: 'top',
// 									},
// 									{
// 										label: __('Right', 'maxi-blocks'),
// 										value: 'right',
// 									},
// 									{
// 										label: __('Bottom', 'maxi-blocks'),
// 										value: 'bottom',
// 									},
// 									{
// 										label: __('Left', 'maxi-blocks'),
// 										value: 'left',
// 									},
// 									{
// 										label: __('Center', 'maxi-blocks'),
// 										value: 'center',
// 									},
// 								]}
// 								onChange={val => {
// 									videoOptions.position = val;

// 									onChange(videoOptions);
// 								}}
// 							/>
// 							<SelectControl
// 								label={__('Autoplay', 'maxi-blocks')}
// 								value={videoOptions.autoplay}
// 								options={[
// 									{
// 										label: __('No', 'maxi-blocks'),
// 										value: 0,
// 									},
// 									{
// 										label: __('Yes', 'maxi-blocks'),
// 										value: 1,
// 									},
// 								]}
// 								onChange={val => {
// 									videoOptions.autoplay = val;
// 									if (Number(val)) videoOptions.muted = 1;

// 									onChange(videoOptions);
// 								}}
// 							/>
// 							<SelectControl
// 								label={__('Muted', 'maxi-blocks')}
// 								value={videoOptions.muted}
// 								disabled={Number(videoOptions.autoplay)} // !!Number(videoOptions.autoplay)
// 								options={[
// 									{
// 										label: __('No', 'maxi-blocks'),
// 										value: 0,
// 									},
// 									{
// 										label: __('Yes', 'maxi-blocks'),
// 										value: 1,
// 									},
// 								]}
// 								onChange={val => {
// 									videoOptions.muted = val;

// 									onChange(videoOptions);
// 								}}
// 							/>
// 							<SelectControl
// 								label={__('Loop', 'maxi-blocks')}
// 								value={videoOptions.loop}
// 								options={[
// 									{
// 										label: __('No', 'maxi-blocks'),
// 										value: 0,
// 									},
// 									{
// 										label: __('Yes', 'maxi-blocks'),
// 										value: 1,
// 									},
// 								]}
// 								onChange={val => {
// 									videoOptions.loop = val;

// 									onChange(videoOptions);
// 								}}
// 							/>
// 							<SelectControl
// 								label={__('Preload', 'maxi-blocks')}
// 								value={videoOptions.muted}
// 								options={[
// 									{
// 										label: __('MetaData', 'maxi-blocks'),
// 										value: 'metadata',
// 									},
// 									{
// 										label: __('Auto', 'maxi-blocks'),
// 										value: 'auto',
// 									},
// 									{
// 										label: __('None', 'maxi-blocks'),
// 										value: 'none',
// 									},
// 								]}
// 								onChange={val => {
// 									videoOptions.muted = val;

// 									onChange(videoOptions);
// 								}}
// 							/>
// 						</Fragment>
// 					),
// 				},
// 			]}
// 		/>
// 	);
// };

export default VideoLayer;
