/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */

import ToolbarPopover from '../toolbar-popover';
import { TextInput } from '../../../';
import {
	videoUrlRegex,
	getParsedVideoUrl,
	parseVideo,
} from '../../../../extensions/video';

/** Icons */
import { toolbarVideo } from '../../../../icons';

const VideoUrl = props => {
	const { url, onChange } = props;

	const [validationText, setValidationText] = useState(null);

	return (
		<ToolbarPopover
			className='toolbar-item__video-url'
			tooltip={__('Video URL', 'maxi-blocks')}
			advancedOptions='video'
			icon={toolbarVideo}
		>
			<div className='toolbar-item__video-url__popover'>
				<label className='maxi-base-control__label' htmlFor='URL'>
					{__('URL', 'maxi-blocks')}
				</label>
				<TextInput
					type='url'
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
							url: val,
							embedUrl: getParsedVideoUrl({
								...props,
								url: val,
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
