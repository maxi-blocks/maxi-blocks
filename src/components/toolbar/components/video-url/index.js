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
	const { _u: url, onChange } = props;

	const [validationText, setValidationText] = useState(null);

	const defaultURL = 'https://www.youtube.com/watch?v=ScMzIvxBSi4';

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
							_u: val !== '' ? val : defaultURL,
							_eu: getParsedVideoUrl({
								...props,
								url: val !== '' ? val : defaultURL,
							}),
							_vt: parseVideo(val).type,
						});
					}}
					validationText={validationText}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default VideoUrl;
