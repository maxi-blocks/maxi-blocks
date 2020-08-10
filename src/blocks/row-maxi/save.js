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
            background,
            extraClassName,
            defaultBlockStyle,
            fullWidth,
        },
        className,
    } = props;

    const classes = classnames(
        'maxi-block maxi-row-block',
        blockStyle,
        extraClassName,
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
            data-maxi_initial_block_class={defaultBlockStyle}
        >
            <__experimentalBackgroundDisplayer
                backgroundOptions={background}
                uniqueID={uniqueID}
            />
            <InnerBlocks.Content />
        </div>
    );
}

export default save;