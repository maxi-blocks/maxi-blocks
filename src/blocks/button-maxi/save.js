/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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
            linkSettings,
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

    const linkOpt = !isObject(linkSettings) ?
        JSON.parse(linkSettings) :
        linkSettings;

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
                className="maxi-button-extra__button"
                {...linkProps}
            >
                {buttonText}
            </Button>
        </div>
    );
}

export default save;