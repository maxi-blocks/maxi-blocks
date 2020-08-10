/**
 * WordPress dependencies
 */
const {
    SVG,
    Path,
    Defs,
} = wp.primitives;

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isObject,
    isEmpty
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

    const mediaURL = value.backgroundOptions[0].imageOptions.mediaURL;

    const getFill = () => {
        if (!isEmpty(mediaURL))
            return `url(#maxi-background-displayer__svg__${uniqueID})`;
        if (!isEmpty(value.colorOptions.color))
            return value.colorOptions.color;
    }

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
                !isEmpty(value.svgPath) &&
                <SVG
                    x="0px"
                    y="0px"
                    viewBox="0 0 36.1 36.1"
                    xmlSpace="preserve"
                    className={`maxi-background-displayer__svg`}
                >
                    <Defs>
                        <pattern
                            id={`maxi-background-displayer__svg__${uniqueID}`}
                            x="0"
                            y="0"
                            patternUnits="userSpaceOnUse"
                            width={100}
                            height={100}
                        >
                            <image
                                className="maxi-background-displayer__svg__image"
                                xlinkHref={mediaURL}
                                width={100}
                                height={100}
                            />
                        </pattern>
                    </Defs>
                    <Path
                        d={value.svgPath}
                        fill={getFill()}
                    />
                </SVG>
            }
        </div>
    )
}

export default BackgroundDisplayer;