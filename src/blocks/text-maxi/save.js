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
            fullWidth,
            extraClassName,
            textLevel,
            content
        },
    } = props;

    let classes = classnames(
        'maxi-block maxi-image-block',
        blockStyle,
        extraClassName,
        uniqueID,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            '',
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