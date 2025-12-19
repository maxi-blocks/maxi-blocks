/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */

import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { TextInput } from '@components';
import {
	videoUrlRegex,
	getParsedVideoUrl,
	parseVideo,
} from '@extensions/video';

/** Icons */
import { toolbarVideo } from '@maxi-icons';

const VideoUrl = props => {
	const { url, onChange } = props;

	const [validationText, setValidationText] = useState(null);
	const instanceId = useInstanceId(VideoUrl);
	const inputId = `toolbar-video-url-${instanceId}`;

	const defaultURL = 'https://www.youtube.com/watch?v=ScMzIvxBSi4';

	return (
		<ToolbarPopover
			className='toolbar-item__video-url'
			tooltip={__('Video URL', 'maxi-blocks')}
			advancedOptions='video'
			icon={toolbarVideo}
		>
			<div className='toolbar-item__video-url__popover'>
				<label className='maxi-base-control__label' htmlFor={inputId}>
					{__('URL', 'maxi-blocks')}
				</label>
				<TextInput
					id={inputId}
					type='url'
					placeholder={defaultURL}
					value={url}
					onChange={val => {
						if (val && !videoUrlRegex.test(val)) {
							setValidationText(
								__('Invalid video URL', 'maxi-blocks')
							);
						} else {
							setValidationText(null);
						}

						onChange({
							url: val !== '' ? val : defaultURL,
							embedUrl: getParsedVideoUrl({
								...props,
								url: val !== '' ? val : defaultURL,
							}),
							videoType: parseVideo(val).type,
						});
					}}
					validationText={validationText}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default VideoUrl;
