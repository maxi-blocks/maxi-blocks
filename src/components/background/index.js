/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './style.scss';
import { isObject } from 'lodash';

/**
 * Component
 */
const Background = props => {
    const {
        backgroundOptions,
        className,
    } = props;

    const value = !isObject(backgroundOptions) ?
        JSON.parse(backgroundOptions) :
        backgroundOptions

    const classes = classnames(
        'maxi-background',
        className
    )

    return (
        <div
            className={classes}
        >
            {
                value.videoOptions.mediaURL &&
                <div class="maxi-background__video-player">
                    <video
                        controls={!!parseInt(value.videoOptions.controls)}
                        autoplay={!!parseInt(value.videoOptions.autoplay)}
                        loop={!!parseInt(value.videoOptions.loop)}
                        muted={!!parseInt(value.videoOptions.muted)}
                        preload={value.videoOptions.preload}
                        src={value.videoOptions.mediaURL}
                    />
                </div>
            }
        </div>
    )
}

export default Background;