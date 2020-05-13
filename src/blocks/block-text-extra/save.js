/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;
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
            textLevel,
            content
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
        <RichText.Content
            value={content}
            tagName={textLevel}
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        />
    );
}

export default save;