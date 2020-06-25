/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;


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
            extraClassName,
            defaultBlockStyle,
            hoverAnimation,
            hoverAnimationDuration,
        }
    } = props;

    let classes = classnames(
        'maxi-block maxi-column-block',
        blockStyle,
        extraClassName,
        'hover-animation-type-'+hoverAnimation,
        'hover-animation-duration-'+hoverAnimationDuration,
        className,
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <InnerBlocks.Content />
        </div>
    );
}

export default save;