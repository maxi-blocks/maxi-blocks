/**
 * WordPress dependencies
 */
const { Button } = wp.components;

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
            linkOptions,
            buttonText,
            extraClassName
        },
    } = props;

    let classes = classnames(
        'maxi-block maxi-button-extra',
        blockStyle,
        extraClassName,
        uniqueID,
        className
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    const linkOpt = typeof linkOptions === 'object' ? linkOptions : JSON.parse(linkOptions);
    const linkProps = {
        href: linkOpt.url || '',
        target: linkOpt.opensInNewTab ? '_blank' : '_self'
    }

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <Button
                className="maxi-buttoneditor-button"
                {...linkProps}
                data-gx_initial_block_class={defaultBlockStyle}
            >
                {buttonText}
            </Button>
        </div>
    );
}

export default save;