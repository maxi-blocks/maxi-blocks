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
    isEmpty,
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
        background,
        className,
        uniqueID
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
            <div className='maxi-background-displayer__overlay' />
            <div className='maxi-background-displayer__color' />
            {
                value.activeMedia === 'image' &&
                    <div className='maxi-background-displayer__images' />
            }
            {
                value.activeMedia === 'video' &&
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
            {/*
                !isNil(value.SVG.SVGElement) &&
                <RawHTML
                    className='maxi-background-displayer__svg-wrapper'
                >
                    {value.SVG.SVGElement}
                </RawHTML>*/
            }
        </div>
    )
}

export default BackgroundDisplayer;