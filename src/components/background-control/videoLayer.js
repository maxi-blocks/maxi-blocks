/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import MediaUploaderControl from '../media-uploader-control';
import OpacityControl from '../opacity-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import TextControl from '../text-control';
import ToggleSwitch from '../toggle-switch';
import {
	getAttributeKey,
	getAttributeValue,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const VideoLayerContent = props => {
	const {
		onChange,
		isHover = false,
		prefix = '',
		breakpoint,
		isGeneral = false,
	} = props;

	const videoOptions = cloneDeep(props.videoOptions);

	return (
		<>
			<OpacityControl
				label={__('Video Opacity', 'maxi-blocks')}
				opacity={getLastBreakpointAttribute(
					`${prefix}background-video-opacity`,
					breakpoint,
					videoOptions,
					isHover
				)}
				onChange={opacity => {
					videoOptions[
						getAttributeKey(
							'background-video-opacity',
							isHover,
							prefix,
							breakpoint
						)
					] = opacity;

					if (isGeneral)
						videoOptions[
							getAttributeKey(
								'background-video-opacity',
								isHover,
								prefix,
								'general'
							)
						] = opacity;

					onChange(videoOptions);
				}}
			/>
			<MediaUploaderControl
				className='maxi-mediauploader-control__video-fallback'
				placeholder={__('Background Fallback')}
				mediaID={getLastBreakpointAttribute(
					`${prefix}background-video-fallbackID`,
					breakpoint,
					videoOptions,
					isHover
				)}
				onSelectImage={val =>
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
						...(isGeneral && {
							[getAttributeKey(
								'background-video-fallbackID',
								isHover,
								prefix,
								'general'
							)]: val.id,
							[getAttributeKey(
								'background-video-fallbackURL',
								isHover,
								prefix,
								'general'
							)]: val.url,
						}),
					})
				}
				onRemoveImage={() =>
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
						...(isGeneral && {
							[getAttributeKey(
								'background-video-fallbackID',
								isHover,
								prefix,
								'general'
							)]: '',
							[getAttributeKey(
								'background-video-fallbackURL',
								isHover,
								prefix,
								'general'
							)]: '',
						}),
					})
				}
			/>
		</>
	);
};

const VideoLayer = props => {
	const { onChange, isHover = false, prefix = '', breakpoint } = props;

	const videoOptions = cloneDeep(props.videoOptions);

	const [validationText, setValidationText] = useState(null);

	const videoUrlRegex =
		/(https?:\/\/)www.(youtube.com\/watch[?]v=([a-zA-Z0-9_-]{11}))|https?:\/\/(www.)?vimeo.com\/([0-9]{9})|https?:\/\/.*\.(?:mp4|webm|ogg)$/g;

	return (
		<div className='maxi-background-control__video'>
			<TextControl
				label='URL'
				type='url'
				// help={__('Add Video', 'maxi-blocks')}
				value={getAttributeValue({
					target: `${prefix}background-video-mediaURL`,
					props: videoOptions,
				})}
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
						[getAttributeKey(
							'background-video-mediaURL',
							isHover,
							prefix
						)]: val,
					});
				}}
				validationText={validationText}
			/>
			<AdvancedNumberControl
				label={__('Start Time (s)', 'maxi-blocks')}
				value={getAttributeValue({
					target: `${prefix}background-video-startTime`,
					props: videoOptions,
				})}
				onChangeValue={val => {
					onChange({
						[getAttributeKey(
							'background-video-startTime',
							isHover,
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
							isHover,
							prefix
						)]: '',
					})
				}
			/>
			<AdvancedNumberControl
				label={__('End Time (s)', 'maxi-blocks')}
				value={getAttributeValue({
					target: `${prefix}background-video-endTime`,
					props: videoOptions,
				})}
				onChangeValue={val =>
					onChange({
						[getAttributeKey(
							'background-video-endTime',
							isHover,
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
							isHover,
							prefix
						)]: '',
					})
				}
			/>
			<ToggleSwitch
				className='video-loop'
				label={__('Loop', 'maxi-blocks')}
				selected={getLastBreakpointAttribute(
					`${prefix}background-video-loop`,
					breakpoint,
					videoOptions
				)}
				disabled={
					+getLastBreakpointAttribute(
						`${prefix}background-video-endTime`,
						breakpoint,
						videoOptions,
						isHover
					) === 0
				}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-loop',
							isHover,
							prefix
						)]: val,
					})
				}
			/>
			<ResponsiveTabsControl breakpoint={breakpoint}>
				<VideoLayerContent
					videoOptions={videoOptions}
					onChange={onChange}
					isHover={isHover}
					prefix={prefix}
				/>
			</ResponsiveTabsControl>
		</div>
	);
};

export default VideoLayer;
