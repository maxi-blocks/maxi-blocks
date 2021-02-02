/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import ClipPath from '../clip-path-control';
import OpacityControl from '../opacity-control';
import NumberControl from '../number-control';
import TextControl from '../text-control';
import FancyRadioControl from '../fancy-radio-control';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';
import getAttributeKey from '../../extensions/styles/getAttributeKey';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const VideoLayer = props => {
	const { onChange, disableClipPath, isHover, prefix } = props;
	const videoOptions = cloneDeep(props.videoOptions);

	return (
		<div className='maxi-background-control__video'>
			<TextControl
				label='URL'
				type='video-url'
				help='add video'
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
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-mediaURL',
							isHover,
							prefix
						)]: val,
					})
				}
			/>

			<NumberControl
				label={__('Start Time (s)', 'maxi-blocks')}
				min={0}
				max={999}
				defaultValue=''
				value={
					videoOptions[
						getAttributeKey(
							'background-video-startTime',
							isHover,
							prefix
						)
					]
				}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-startTime',
							isHover,
							prefix
						)]: val,
					})
				}
			/>
			<NumberControl
				label={__('End Time (s)', 'maxi-blocks')}
				min={0}
				max={999}
				defaultValue=''
				value={
					videoOptions[
						getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix
						)
					]
				}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix
						)]: val,
						...(!!val && {
							[getAttributeKey(
								'background-video-loop',
								isHover,
								prefix
							)]: 0,
						}),
					})
				}
			/>
			<FancyRadioControl
				label={__('Loop', 'maxi-blocks')}
				selected={
					+videoOptions[
						getAttributeKey(
							'background-video-loop',
							isHover,
							prefix
						)
					]
				}
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
				disabled={
					!!+videoOptions[
						getAttributeKey(
							'background-video-endTime',
							isHover,
							prefix
						)
					]
				}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-loop',
							isHover,
							prefix
						)]: !!val,
					})
				}
			/>
			<FancyRadioControl
				label={__('Play on Mobile', 'maxi-blocks')}
				selected={
					+videoOptions[
						getAttributeKey(
							'background-video-playOnMobile',
							isHover,
							prefix
						)
					]
				}
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
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-video-playOnMobile',
							isHover,
							prefix
						)]: !!val,
					})
				}
			/>

			{!disableClipPath && (
				<ClipPath
					clipPath={
						videoOptions[
							getAttributeKey(
								'background-video-clipPath',
								isHover,
								prefix
							)
						]
					}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-video-clipPath',
								isHover,
								prefix
							)]: val,
						})
					}
				/>
			)}
			<OpacityControl
				label={__('Video Opacity', 'maxi-blocks')}
				fullWidthMode
				opacity={
					videoOptions[
						getAttributeKey(
							'background-video-opacity',
							isHover,
							prefix
						)
					]
				}
				defaultOpacity={getDefaultAttribute(
					getAttributeKey('background-video-opacity', isHover, prefix)
				)}
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
