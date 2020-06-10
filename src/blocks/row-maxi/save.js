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
        attributes: {
            uniqueID,
            blockStyle,
            extraClassName,
            defaultBlockStyle,
            fullWidth
        },
        className,
    } = props;

    let classes = classnames(
        'maxi-block maxi-row-block',
        blockStyle,
        extraClassName,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            '',
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