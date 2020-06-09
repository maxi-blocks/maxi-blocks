/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

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
            undefined,
        lineOrientation === 'vertical' ?
            'maxi-divider-block--vertical' :
            'maxi-divider-block--horizontal',
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);


    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            {
                showLine &&
                <Fragment>
                    <hr class="maxi-divider-block__divider-1" />
                    <hr class="maxi-divider-block__divider-2" />
                </Fragment>
            }
        </div>
    );
}

export default save;