/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ImageUrlUpload from '@components/image-url-upload';
import MediaUploaderControl from '@components/media-uploader-control';
import OpacityControl from '@components/opacity-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import TextControl from '@components/text-control';
import ToggleSwitch from '@components/toggle-switch';
import {
	getAttributeKey,
	getAttributeValue,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { videoUrlRegex } from '@extensions/video';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const VideoLayerContent = props => {
	const { isIB, onChange, isHover = false, prefix = '', breakpoint } = props;

	const videoOptions = cloneDeep(props.videoOptions);

	const handleRemoveImage = () => {
		onChange({
			[getAttributeKey(
				'background-video-fallbackID',
				isHover,
				prefix,
				breakpoint
			)]: '',
			[getAttributeKey(
				'background-video-fallbackURL',
				isHover,
				prefix,
				breakpoint
			)]: '',
		});
	};

	const handleSelectImage = val => {
		onChange({
			[getAttributeKey(
				'background-video-fallbackID',
				isHover,
				prefix,
				breakpoint
			)]: val.id,
			[getAttributeKey(
				'background-video-fallbackURL',
				isHover,
				prefix,
				breakpoint
			)]: val.url,
			[getAttributeKey(
				'background-video-isImageUrl',
				isHover,
				prefix,
				breakpoint
			)]: val.isImageUrl || false,
			[getAttributeKey(
				'background-video-isImageUrlInvalid',
				isHover,
				prefix,
				breakpoint
			)]: val.isImageUrlInvalid || false,
		});
	};

	return (
		<>
			<OpacityControl
				label={__('Video opacity', 'maxi-blocks')}
				opacity={getLastBreakpointAttribute({
					target: `${prefix}background-video-opacity`,
					breakpoint,
					attributes: videoOptions,
					isHover,
				})}
				breakpoint={breakpoint}
				prefix={`${prefix}background-video-`}
				isHover={isHover}
				onChange={onChange}
				disableRTC
			/>
			{!isHover && !isIB && (
				<>
					<MediaUploaderControl
						className='maxi-mediauploader-control__video-fallback'
						placeholder={__('Background fallback', 'maxi-blocks')}
						isImageUrl={getLastBreakpointAttribute({
							target: `${prefix}background-video-isImageUrl`,
							breakpoint,
							attributes: videoOptions,
							isHover,
						})}
						mediaID={getLastBreakpointAttribute({
							target: `${prefix}background-video-fallbackID`,
							breakpoint,
							attributes: videoOptions,
							isHover,
						})}
						onSelectImage={handleSelectImage}
						onRemoveImage={handleRemoveImage}
					/>
					<ImageUrlUpload
						attributes={videoOptions}
						mediaPrefix='fallback'
						prefix={`${prefix}background-video-`}
						breakpoint={breakpoint}
						onChange={handleSelectImage}
					/>
				</>
			)}
		</>
	);
};

const VideoLayer = props => {
	const { isIB, onChange, isHover = false, prefix = '', breakpoint } = props;

	const videoOptions = cloneDeep(props.videoOptions);
	const isLayerHover = videoOptions.isHover;

	const [validationText, setValidationText] = useState(null);

	const defaultURL = 'https://www.youtube.com/watch?v=ScMzIvxBSi4';

	return (
		<div className='maxi-background-control__video'>
			{(!isHover || (isHover && isLayerHover)) && (
				<>
					<TextControl
						label='URL'
						type='url'
						value={getAttributeValue({
							target: 'background-video-mediaURL',
							props: videoOptions,
							prefix,
						})}
						newStyle
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
								[getAttributeKey(
									'background-video-mediaURL',
									false,
									prefix
								)]: val !== '' ? val : defaultURL,
							});
						}}
						validationText={validationText}
					/>
					<AdvancedNumberControl
						className='maxi-background-video-start-time'
						label={__('Start time (s)', 'maxi-blocks')}
						value={getAttributeValue({
							target: 'background-video-startTime',
							props: videoOptions,
							prefix,
						})}
						onChangeValue={val => {
							onChange({
								[getAttributeKey(
									'background-video-startTime',
									false,
									prefix
								)]: val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={999}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'background-video-startTime',
									false,
									prefix
								)]: '',
								isReset: true,
							})
						}
					/>
					<AdvancedNumberControl
						className='maxi-background-video-end-time'
						label={__('End time (s)', 'maxi-blocks')}
						value={getAttributeValue({
							target: 'background-video-endTime',
							props: videoOptions,
							prefix,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey(
									'background-video-endTime',
									false,
									prefix
								)]: val !== undefined && val !== '' ? val : '',
							})
						}
						min={0}
						max={999}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'background-video-endTime',
									false,
									prefix
								)]: '',
								isReset: true,
							})
						}
					/>
					<ToggleSwitch
						className='video-loop'
						label={__('Loop', 'maxi-blocks')}
						selected={getAttributeValue({
							target: 'background-video-loop',
							props: videoOptions,
							prefix,
						})}
						disabled={
							+getAttributeValue({
								target: 'background-video-endTime',
								props: videoOptions,
								prefix,
							}) === 0
						}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'background-video-loop',
									false,
									prefix
								)]: val,
							})
						}
					/>
					<ToggleSwitch
						className='video-reduce-border'
						label={__('Reduce black borders', 'maxi-blocks')}
						selected={getAttributeValue({
							target: 'background-video-reduce-border',
							props: videoOptions,
							prefix,
						})}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'background-video-reduce-border',
									false,
									prefix
								)]: val,
							})
						}
					/>
				</>
			)}
			<ResponsiveTabsControl breakpoint={breakpoint}>
				<>
					<VideoLayerContent
						videoOptions={videoOptions}
						onChange={onChange}
						isHover={isHover}
						prefix={prefix}
						isIB={isIB}
						breakpoint={breakpoint}
					/>
					<SizeAndPositionLayerControl
						prefix={prefix}
						options={videoOptions}
						onChange={onChange}
						isHover={isHover}
						isLayer
						breakpoint={breakpoint}
					/>
				</>
			</ResponsiveTabsControl>
		</div>
	);
};

export default VideoLayer;
