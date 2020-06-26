/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
    const {
        className,
        attributes: {
            uniqueID,
            blockStyle,
            defaultBlockStyle,
            fullWidth,
            extraClassName,
            captionType,
            captionContent,
            mediaID,
            mediaURL,
            mediaWidth,
            mediaHeight,
            mediaALT,
            hoverAnimation,
            hoverAnimationDuration,
        },
    } = props;

    let classes = classnames(
        'maxi-block maxi-image-block',
        blockStyle,
        extraClassName,
        'hover-animation-type-'+hoverAnimation,
        'hover-animation-duration-'+hoverAnimationDuration,
        uniqueID,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            '',
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <figure
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <img
                className={"wp-image-" + mediaID}
                src={mediaURL}
                width={mediaWidth}
                height={mediaHeight}
                alt={mediaALT}
            />
            {captionType !== 'none' &&
                <figcaption>
                    {captionContent}
                </figcaption>
            }
        </figure>
    );
}

export default save;