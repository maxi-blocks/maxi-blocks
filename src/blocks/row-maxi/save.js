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
            hoverAnimation,
            hoverAnimationDuration,
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
        'hover-animation-type-'+hoverAnimation,
        'hover-animation-duration-'+hoverAnimationDuration,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            null,
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