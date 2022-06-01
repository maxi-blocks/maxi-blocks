/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import VideoIconControl from '../video-icon-control';
import { getGroupAttributes } from '../../extensions/styles';

const VideoOverlayControl = props => {
	const { blockStyle, breakpoint, clientId, onChange } = props;

	return (
		<VideoIconControl
			prefix='play-'
			label={__('Play icon', 'maxi-blocks')}
			blockStyle={blockStyle}
			breakpoint={breakpoint}
			clientId={clientId}
			onChange={obj => onChange(obj)}
			{...getGroupAttributes(
				props,
				['icon', 'iconBackground', 'iconBackgroundColor'],
				false,
				'play-'
			)}
		/>
	);
};

export default VideoOverlayControl;
