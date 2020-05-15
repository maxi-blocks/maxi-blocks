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
            verticalDivider,
            roundedDivider,
            hideDivider
        },
    } = props;

    let classes = classnames(
        'maxi-block maxi-divider-block',
        blockStyle,
        extraClassName,
        uniqueID,
        className
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    if (verticalDivider)
        classes = classnames(classes, 'is-vertical')
    if (roundedDivider)
        classes = classnames(classes, 'is-rounded')

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            {
                !hideDivider &&
                <hr
                    className="maxi-divider"
                />
            }
        </div>
    );
}

export default save;