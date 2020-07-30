/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

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
        className,
        attributes: {
            uniqueID,
            blockStyle,
            defaultBlockStyle,
            background,
            extraClassName,
            fullWidth,
            showLine,
            lineOrientation,
            motion
        },
    } = props;

    const classes = classnames(
        `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
        'maxi-block maxi-divider-block',
        blockStyle,
        extraClassName,
        uniqueID,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            null,
        lineOrientation === 'vertical' ?
            'maxi-divider-block--vertical' :
            'maxi-divider-block--horizontal',
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

    return (
        <div
            className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
            data-motion={motion}
            data-motion-id={uniqueID}
        >
            <__experimentalBackgroundDisplayer
                backgroundOptions={background}
            />
            {
                !!showLine &&
                <Fragment>
                    <hr class="maxi-divider-block__divider" />
                </Fragment>
            }
        </div>
    );
}

export default save;