/**
 * WordPress dependencies
 */
const { RawHTML } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isObject,
    isNil
} from 'lodash';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const BackgroundDisplayer = props => {
    const {
        backgroundOptions,
        className,
        uniqueID
    } = props;

    const value = !isObject(backgroundOptions) ?
        JSON.parse(backgroundOptions) :
        backgroundOptions

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
                !isNil(value.SVG.SVGElement) &&
                <RawHTML
                    className='maxi-background-displayer__svg-wrapper'
                >
                    {value.SVG.SVGElement}
                </RawHTML>
            }
        </div>
    )
}

export default BackgroundDisplayer;