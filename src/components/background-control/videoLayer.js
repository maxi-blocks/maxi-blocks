/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import __experimentalClipPath from '../clip-path-control';
import __experimentalOpacityControl from '../opacity-control';
import SizeControl from '../size-control';
import SettingTabsControl from '../setting-tabs-control';

/**
 * Component
 */
export const VideoLayerClosed = props => {
	const {
		videoOptions,
		defaultVideoOptions,
		onChange,
		disableClipPath,
		onOpenOptions,
	} = props;

	return (
		<div className='maxi-background-control__video'>
			<MediaUploaderControl
				allowedTypes={['video']}
				mediaType='video'
				mediaID={videoOptions.mediaID}
				onSelectImage={videoData => {
					videoOptions.mediaID = videoData.id;
					videoOptions.mediaURL = videoData.url;

					onChange(videoOptions);
				}}
				onRemoveImage={() => {
					videoOptions.mediaID = '';
					videoOptions.mediaURL = '';

					onChange(videoOptions);
				}}
				extendSelector={
					videoOptions.mediaID && (
						<Button
							isSecondary
							onClick={e => onOpenOptions(e)}
							className='maxi-background-control__video-edit'
						>
							{__('Edit', 'maxi-blocks')}
						</Button>
					)
				}
				placeholder={__('Set Video', 'maxi-blocks')}
				replaceButton={__('Replace', 'maxi-blocks')}
				removeButton={__('Remove', 'maxi-blocks')}
			/>
			<__experimentalOpacityControl
				label={__('Video Opacity', 'maxi-blocks')}
				opacity={videoOptions.opacity}
				defaultOpacity={defaultVideoOptions.opacity}
				onChange={val => {
					videoOptions.opacity = JSON.parse(val);

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
		</div>
	);
};

export const VideoLayerOpened = props => {
	const {
		videoOptions,
		defaultVideoOptions,
		onChange,
		onDoneEdition,
		onRemoveImage,
	} = props;

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Video', 'maxi-blocks'),
					className: 'maxi-background-control__image-tab',
					uuid: 'maxi-background-control__image-tab',
					content: (
						<MediaUploaderControl
							mediaType='video'
							mediaID={videoOptions.mediaID}
							onSelectImage={imageData => {
								videoOptions.mediaID = imageData.id;
								videoOptions.mediaURL = imageData.url;

								onChange(videoOptions);
							}}
							onRemoveImage={() => {
								videoOptions.mediaID = '';
								videoOptions.mediaURL = '';
								onRemoveImage();

								onChange(videoOptions);
							}}
							extendSelector={
								<Button
									isSecondary
									onClick={onDoneEdition}
									className='maxi-background-control__done-edition'
								>
									{__('Done', 'maxi-blocks')}
								</Button>
							}
							replaceButton={__('Replace', 'maxi-blocks')}
							removeButton={__('Delete', 'maxi-blocks')}
							// alternativeImage={getAlternativeImage(selector)} // ????
							allowedTypes={['video']}
						/>
					),
				},
				{
					label: __('Settings', 'maxi-blocks'),
					className: 'maxi-background-control__background-tab',
					content: (
						<Fragment>
							<SizeControl
								label={__('Width', 'maxi-blocks')}
								unit={videoOptions.widthUnit}
								defaultUnit={defaultVideoOptions.widthUnit}
								onChangeUnit={val => {
									videoOptions.widthUnit = val;

									onChange(videoOptions);
								}}
								value={videoOptions.width}
								defaultValue={defaultVideoOptions.width}
								onChangeValue={val => {
									videoOptions.width = val;

									onChange(videoOptions);
								}}
								minMaxSettings={{
									px: {
										min: 0,
										max: 999,
									},
									em: {
										min: 0,
										max: 999,
									},
									vw: {
										min: 0,
										max: 999,
									},
									'%': {
										min: 0,
										max: 100,
									},
								}}
							/>
							<SizeControl
								label={__('Height', 'maxi-blocks')}
								unit={videoOptions.heightUnit}
								defaultUnit={defaultVideoOptions.heightUnit}
								onChangeUnit={val => {
									videoOptions.heightUnit = val;

									onChange(videoOptions);
								}}
								value={videoOptions.height}
								defaultValue={defaultVideoOptions.height}
								onChangeValue={val => {
									videoOptions.height = val;

									onChange(videoOptions);
								}}
								minMaxSettings={{
									px: {
										min: 0,
										max: 999,
									},
									em: {
										min: 0,
										max: 999,
									},
									vw: {
										min: 0,
										max: 999,
									},
									'%': {
										min: 0,
										max: 100,
									},
								}}
							/>
							<SelectControl
								label={__('Fill', 'maxi-blocks')}
								value={videoOptions.fill}
								options={[
									{
										label: __('Cover', 'maxi-blocks'),
										value: 'cover',
									},
									{
										label: __('Contain', 'maxi-blocks'),
										value: 'contain',
									},
									{
										label: __('Fill', 'maxi-blocks'),
										value: 'fill',
									},
									{
										label: __('Scale-down', 'maxi-blocks'),
										value: 'scale-down',
									},
									{
										label: __('None', 'maxi-blocks'),
										value: 'none',
									},
								]}
								onChange={val => {
									videoOptions.fill = val;

									onChange(videoOptions);
								}}
							/>
							<SelectControl
								label={__('Position', 'maxi-blocks')}
								value={videoOptions.position}
								options={[
									{
										label: __('Unset', 'maxi-blocks'),
										value: 'unset',
									},
									{
										label: __('Top', 'maxi-blocks'),
										value: 'top',
									},
									{
										label: __('Right', 'maxi-blocks'),
										value: 'right',
									},
									{
										label: __('Bottom', 'maxi-blocks'),
										value: 'bottom',
									},
									{
										label: __('Left', 'maxi-blocks'),
										value: 'left',
									},
									{
										label: __('Center', 'maxi-blocks'),
										value: 'center',
									},
								]}
								onChange={val => {
									videoOptions.position = val;

									onChange(videoOptions);
								}}
							/>
							<SelectControl
								label={__('Autoplay', 'maxi-blocks')}
								value={videoOptions.autoplay}
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
									videoOptions.autoplay = val;
									if (Number(val)) videoOptions.muted = 1;

									onChange(videoOptions);
								}}
							/>
							<SelectControl
								label={__('Muted', 'maxi-blocks')}
								value={videoOptions.muted}
								disabled={Number(videoOptions.autoplay)} // !!Number(videoOptions.autoplay)
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
									videoOptions.muted = val;

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
								onChange={val => {
									videoOptions.loop = val;

									onChange(videoOptions);
								}}
							/>
							<SelectControl
								label={__('Preload', 'maxi-blocks')}
								value={videoOptions.muted}
								options={[
									{
										label: __('MetaData', 'maxi-blocks'),
										value: 'metadata',
									},
									{
										label: __('Auto', 'maxi-blocks'),
										value: 'auto',
									},
									{
										label: __('None', 'maxi-blocks'),
										value: 'none',
									},
								]}
								onChange={val => {
									videoOptions.muted = val;

									onChange(videoOptions);
								}}
							/>
						</Fragment>
					),
				},
			]}
		/>
	);
};
