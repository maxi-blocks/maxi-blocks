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
import getActiveAttributes from '../../extensions/active-indicators';

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
				label={__('Video opacity', 'maxi-blocks')}
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
				placeholder={__('Background fallback')}
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
	const isLayerHover = videoOptions.isHover;

	const [validationText, setValidationText] = useState(null);

	const videoUrlRegex =
		/(https?:\/\/)www.(youtube.com\/watch[?]v=([a-zA-Z0-9_-]{11}))|https?:\/\/(www.)?vimeo.com\/([0-9]{9})|https?:\/\/.*\.(?:mp4|webm|ogg)$/g;

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
									false,
									prefix
								)]: val,
							});
						}}
						validationText={validationText}
					/>
					<AdvancedNumberControl
						className='maxi-background-video-start-time'
						label={__('Start Time (s)', 'maxi-blocks')}
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
							})
						}
					/>
					<AdvancedNumberControl
						className='maxi-background-video-end-time'
						label={__('End Time (s)', 'maxi-blocks')}
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
			<ResponsiveTabsControl
				breakpoint={breakpoint}
				activeTabs={getActiveAttributes(videoOptions, 'breakpoints')}
			>
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
