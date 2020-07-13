/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const VideoPlayer = props => {
    const {
        videoOptions
    } = props;

    let value = !isObject(videoOptions) ?
        JSON.parse(videoOptions).videoOptions :
        videoOptions.videoOptions;

    return (
        value.mediaURL &&
        <div class="maxi-video-player">
            <video
                controls={!!parseInt(value.controls)}
                autoplay={!!parseInt(value.autoplay)}
                loop={!!parseInt(value.loop)}
                muted={!!parseInt(value.muted)}
                preload={value.preload}
                src={value.mediaURL}
            />
        </div>
    )
}

export default VideoPlayer;