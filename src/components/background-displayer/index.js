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
                value.colorOptions.colorPosition === 'back' &&
                <div className='maxi-background-displayer__color' />
            }
            <div className='maxi-background-displayer__images' />
            {
                value.videoOptions.mediaURL &&
                <div class="maxi-background-displayer__video-player">
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
            {
                value.colorOptions.colorPosition === 'front' &&
                <div className='maxi-background-displayer__color' />
            }
        </div>
    )
}

export default BackgroundDisplayer;