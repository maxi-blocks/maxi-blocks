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
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import TextControl from '../text-control';
import ToggleSwitch from '../toggle-switch';
import {
	getAttributeKey,
	getAttributesValue,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { videoUrlRegex } from '../../extensions/video';

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

	return (
		<>
			<OpacityControl
				label={__('Video opacity', 'maxi-blocks')}
				opacity={getLastBreakpointAttribute({
					target: 'bv_o',
					breakpoint,
					attributes: videoOptions,
					isHover,
					prefix,
				})}
				breakpoint={breakpoint}
				prefix={`${prefix}bv`}
				isHover={isHover}
				onChange={onChange}
				disableRTC
			/>
			{!isHover && !isIB && (
				<MediaUploaderControl
					className='maxi-mediauploader-control__video-fallback'
					placeholder={__('Background fallback')}
					mediaID={getLastBreakpointAttribute({
						target: 'bv_mi',
						breakpoint,
						attributes: videoOptions,
						isHover,
						prefix,
					})}
					onSelectImage={val =>
						onChange({
							[getAttributeKey(
								'bv_mi',
								isHover,
								prefix,
								breakpoint
							)]: val.id,
							[getAttributeKey(
								'bv_mu',
								isHover,
								prefix,
								breakpoint
							)]: val.url,
						})
					}
					onRemoveImage={() =>
						onChange({
							[getAttributeKey(
								'bv_mi',
								isHover,
								prefix,
								breakpoint
							)]: '',
							[getAttributeKey(
								'bv_mu',
								isHover,
								prefix,
								breakpoint
							)]: '',
						})
					}
				/>
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
						value={getAttributesValue({
							target: 'bv_mu',
							props: videoOptions,
							prefix,
						})}
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
								[getAttributeKey('bv_mu', false, prefix)]:
									val !== '' ? val : defaultURL,
							});
						}}
						validationText={validationText}
					/>
					<AdvancedNumberControl
						className='maxi-bv_start-time'
						label={__('Start time (s)', 'maxi-blocks')}
						value={getAttributesValue({
							target: 'bv_sti',
							props: videoOptions,
							prefix,
						})}
						onChangeValue={val => {
							onChange({
								[getAttributeKey('bv_sti', false, prefix)]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={999}
						onReset={() =>
							onChange({
								[getAttributeKey('bv_sti', false, prefix)]: '',
								isReset: true,
							})
						}
					/>
					<AdvancedNumberControl
						className='maxi-bv_end-time'
						label={__('End time (s)', 'maxi-blocks')}
						value={getAttributesValue({
							target: 'bv_et',
							props: videoOptions,
							prefix,
						})}
						onChangeValue={val =>
							onChange({
								[getAttributeKey('bv_et', false, prefix)]:
									val !== undefined && val !== '' ? val : '',
							})
						}
						min={0}
						max={999}
						onReset={() =>
							onChange({
								[getAttributeKey('bv_et', false, prefix)]: '',
								isReset: true,
							})
						}
					/>
					<ToggleSwitch
						className='video-loop'
						label={__('Loop', 'maxi-blocks')}
						selected={getAttributesValue({
							target: 'bv_loo',
							props: videoOptions,
							prefix,
						})}
						disabled={
							+getAttributesValue({
								target: 'bv_et',
								props: videoOptions,
								prefix,
							}) === 0
						}
						onChange={val =>
							onChange({
								[getAttributeKey('bv_loo', false, prefix)]: val,
							})
						}
					/>
					<ToggleSwitch
						className='video-reduce-border'
						label={__('Reduce black borders', 'maxi-blocks')}
						selected={getAttributesValue({
							target: 'bv_rb',
							props: videoOptions,
							prefix,
						})}
						onChange={val =>
							onChange({
								[getAttributeKey('bv_rb', false, prefix)]: val,
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
