/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { 
    isObject,
    isNil
} from 'lodash';

/**
 * Save
 */
const save = props => {
    const {
        attributes: {
            uniqueID,
            blockStyle,
            defaultBlockStyle,
            linkSettings,
            buttonText,
            extraClassName,
            hoverAnimation,
            hoverAnimationType,
            hoverAnimationDuration,
        },
        className
    } = props;

    const classes = classnames(
        'maxi-block maxi-button-extra',
        blockStyle,
        extraClassName,
        'hover-animation-'+hoverAnimation,
        'hover-animation-type-'+hoverAnimationType,
        'hover-animation-duration-'+hoverAnimationDuration,
        uniqueID,
        className,
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

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