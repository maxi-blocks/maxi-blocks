/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
            hoverAnimation,
            hoverAnimationDuration,
        },
        className,
    } = props;

    let classes = classnames(
        'maxi-block maxi-column-block',
        blockStyle,
        extraClassName,
        'hover-animation-type-'+hoverAnimation,
        'hover-animation-duration-'+hoverAnimationDuration,
        className,
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

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