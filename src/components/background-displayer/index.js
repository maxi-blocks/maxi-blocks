/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import './style.scss';

/**
 * Component
 */
const BackgroundDisplayer = props => {
    const {
        background,
        className,
    } = props;

    const value = !isObject(background) ?
        JSON.parse(background) :
        background

    const classes = classnames(
        'maxi-background-displayer',
        className
    )

    return (
        <div
            className={classes}
        >
            {
                value.videoOptions.mediaURL &&
                <div className="maxi-background-displayer__video-player">
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

export default BackgroundDisplayer;