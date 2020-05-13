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
            extraClassName,
            captionType,
            captionContent,
            mediaID,
            mediaURL,
            mediaWidth,
            mediaHeight,
            mediaALT
        },
    } = props;

    let classes = classnames(
        'gx-block gx-image-block',
        blockStyle,
        extraClassName,
        uniqueID,
        className
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