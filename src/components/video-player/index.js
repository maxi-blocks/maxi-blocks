/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const VideoPlayer = props => {
    const {
        videoOptions
    } = props;

    return (
        videoOptions.mediaURL &&
            <div class="maxi-video-player">
                <video
                    style={{
                        'object-fit': videoOptions.fill,
                        'object-position': videoOptions.position,
                        width: `${videoOptions.width}${videoOptions.widthUnit}`,
                        height: `${videoOptions.height}${videoOptions.heightUnit}`,
                    }}
                    controls={videoOptions.controls === 'yes'}
                    autoplay={videoOptions.autoplay === 'yes'}
                    loop={videoOptions.loop === 'yes'}
                    muted={videoOptions.muted === 'yes'}
                    preload={videoOptions.preload}
                    src={videoOptions.mediaURL}
                />
            </div>
    )
}

export default VideoPlayer;