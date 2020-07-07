/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

/**
 * External dependencies
 */
import classnames from 'classnames';
import Scripts from '../../extensions/styles/hoverAnimations.js';

/**
 * Save
 */
const save = props => {
    const {
        attributes: {
            uniqueID,
            blockStyle,
            wrapTablet,
            wrapMobile,
            hoverAnimation,
            hoverAnimationType,
            hoverAnimationTypeText,
            hoverAnimationDuration,
            hoverAnimationTitle,
            hoverAnimationContent,
            hoverOpacity,
            hoverBackground,
            hoverAnimationCustomBorder,
            extraClassName,
            defaultBlockStyle,
            fullWidth,
            hoverPadding,
        },
        className,
    } = props;

    let classes = classnames(
        'maxi-block maxi-row-block',
        blockStyle,
        extraClassName,
        'hover-animation-'+hoverAnimation,
        'hover-animation-type-'+hoverAnimationType,
        'hover-animation-type-text-'+hoverAnimationTypeText,
        'hover-animation-duration-'+hoverAnimationDuration,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            '',
        !wrapTablet ?
            'maxi-row-block--wrap-tablet' :
            null,
        !wrapMobile ?
            'maxi-row-block--wrap-mobile' :
            null,
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <InnerBlocks.Content />
            {hoverAnimation === 'basic' &&
                <Scripts
                hover_animation = {hoverAnimationType}
                hover_animation_type = {hoverAnimation}
                >
                </Scripts>
            }
            {hoverAnimation === 'text' &&
                <Scripts
                hover_animation = {hoverAnimationTypeText}
                hover_animation_type = {hoverAnimation}
                >
                </Scripts>
            }
        </div>
    );
}

export default save;