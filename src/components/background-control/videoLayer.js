/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import OpacityControl from '../opacity-control';
import AdvancedNumberControl from '../advanced-number-control';
import TextControl from '../text-control';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const VideoLayer = props => {
	const { onChange, isHover, prefix, breakpoint } = props;

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
				value={getLastBreakpointAttribute(
					`${prefix}background-video-mediaURL`,
					breakpoint,
					videoOptions,
					isHover
				)}
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
							prefix,
							breakpoint
						)]: val,
					});
				}}
				validationText={validationText}
			/>
			<AdvancedNumberControl
				label={__('Start Time (s)', 'maxi-blocks')}
				value={getLastBreakpointAttribute(
					`${prefix}background-video-startTime`,
					breakpoint,
					videoOptions,
					isHover
				)}
				onChangeValue={val => {
					onChange({
						[getAttributeKey(
							'background-video-startTime',
							isHover,
							prefix,
							breakpoint
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
							prefix,
							breakpoint
						)]: '',
					})
				}
			/>
			<AdvancedNumberControl
				label={__('End Time (s)', 'maxi-blocks')}
				value={getLastBreakpointAttribute(
					`${prefix}background-video-endTime`,
					breakpoint,
					videoOptions,
					isHover
				)}
				onChangeValue={val => {
					onChange({
						[getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix,
							breakpoint
						)]: val !== undefined && val !== '' ? val : '',
						...(!!val && {
							[getAttributeKey(
								'background-video-loop',
								isHover,
								prefix,
								breakpoint
							)]: 0,
						}),
					});
				}}
				min={0}
				max={999}
				onReset={() =>
					onChange({
						[getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix,
							breakpoint
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
					videoOptions,
					isHover
				)}
				disabled={
					!!+videoOptions[
						getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix,
							breakpoint
						)
					]
				}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-loop',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
			/>
			<ToggleSwitch
				className='video-play-mobile'
				label={__('Play on Mobile', 'maxi-blocks')}
				selected={getLastBreakpointAttribute(
					`${prefix}background-video-playOnMobile`,
					breakpoint,
					videoOptions,
					isHover
				)}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-playOnMobile',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
			/>
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
					})
				}
			/>
		</div>
	);
};

export default VideoLayer;
