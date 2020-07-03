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

    let value = typeof videoOptions === 'object' ?
    videoOptions.videoOptions :
    JSON.parse(videoOptions).videoOptions;

    return (
        value.mediaURL &&
            <div class="maxi-video-player">
                <video
                    style={{
                        //'object-fit': value.fill,
                        'object-position': value.position,
                        width: `${value.width}${value.widthUnit}`,
                        height: `${value.height}${value.heightUnit}`,
                    }}
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