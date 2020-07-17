/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

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
            extraClassName,
            fullWidth,
            showLine,
            lineOrientation
        },
    } = props;

    let classes = classnames(
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
        >
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