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
import ToggleSwitch from '../toggle-switch';
import { getAttributeKey } from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const VideoLayer = props => {
	const { onChange, isHover, prefix } = props;

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
				value={
					videoOptions[
						getAttributeKey(
							'background-video-mediaURL',
							isHover,
							prefix
						)
					]
				}
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
				value={
					videoOptions[
						getAttributeKey(
							'background-video-startTime',
							isHover,
							prefix
						)
					]
				}
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
				value={
					videoOptions[
						getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix
						)
					]
				}
				onChangeValue={val => {
					onChange({
						[getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix
						)]: val !== undefined && val !== '' ? val : '',
						...(!!val && {
							[getAttributeKey(
								'background-video-loop',
								isHover,
								prefix
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
							prefix
						)]: '',
					})
				}
			/>
			<ToggleSwitch
				label={__('Loop', 'maxi-blocks')}
				selected={
					videoOptions[
						getAttributeKey(
							'background-video-loop',
							isHover,
							prefix
						)
					]
				}
				disabled={
					!!+videoOptions[
						getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix
						)
					]
				}
				onChange={() =>
					onChange({
						[getAttributeKey(
							'background-video-loop',
							isHover,
							prefix
						)]:
							!videoOptions[
								getAttributeKey(
									'background-video-loop',
									isHover,
									prefix
								)
							],
					})
				}
			/>
			<ToggleSwitch
				label={__('Play on Mobile', 'maxi-blocks')}
				selected={
					videoOptions[
						getAttributeKey(
							'background-video-playOnMobile',
							isHover,
							prefix
						)
					]
				}
				onChange={() =>
					onChange({
						[getAttributeKey(
							'background-video-playOnMobile',
							isHover,
							prefix
						)]:
							!videoOptions[
								getAttributeKey(
									'background-video-playOnMobile',
									isHover,
									prefix
								)
							],
					})
				}
			/>
			<OpacityControl
				label={__('Video Opacity', 'maxi-blocks')}
				opacity={
					videoOptions[
						getAttributeKey(
							'background-video-opacity',
							isHover,
							prefix
						)
					]
				}
				onChange={opacity => {
					videoOptions[
						getAttributeKey(
							'background-video-opacity',
							isHover,
							prefix
						)
					] = opacity;
					onChange(videoOptions);
				}}
			/>
			<MediaUploaderControl
				className='maxi-mediauploader-control__video-fallback'
				placeholder={__('Background Fallback')}
				mediaID={
					videoOptions[
						getAttributeKey(
							'background-video-fallbackID',
							isHover,
							prefix
						)
					]
				}
				onSelectImage={val =>
					onChange({
						[getAttributeKey(
							'background-video-fallbackID',
							isHover,
							prefix
						)]: val.id,
						[getAttributeKey(
							'background-video-fallbackURL',
							isHover,
							prefix
						)]: val.url,
					})
				}
				onRemoveImage={() =>
					onChange({
						[getAttributeKey(
							'background-video-fallbackID',
							isHover,
							prefix
						)]: '',
						[getAttributeKey(
							'background-video-fallbackURL',
							isHover,
							prefix
						)]: '',
					})
				}
			/>
		</div>
	);
};

export default VideoLayer;
