/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

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
            background,
        },
        className
    } = props;

    const classes = classnames(
        'maxi-block maxi-column-block',
        blockStyle,
        extraClassName,
        className,
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

    return (
        <div
            className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
        >
            <__experimentalBackgroundDisplayer
                background={background}
            />
            <InnerBlocks.Content />
        </div>
    );
}

export default save;