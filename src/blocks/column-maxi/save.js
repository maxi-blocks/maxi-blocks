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
            defaultBlockStyle
        }
    } = props;

    let classes = classnames(
        'maxi-block maxi-column-block',
        blockStyle,
        extraClassName,
        className,
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <div className='maxi-column-block__content'>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}

export default save;