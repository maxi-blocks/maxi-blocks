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
        className,
        attributes: {
            uniqueID,
            blockStyle,
            extraClassName,
            defaultBlockStyle,
            hoverAnimation,
            hoverAnimationType,
            hoverAnimationTypeText,
            hoverAnimationDuration,
            hoverAnimationTitle,
            hoverAnimationContent,
            hoverOpacity,
            hoverBackground,
            hoverAnimationCustomBorder,
            hoverPadding,
        }
    } = props;

    let classes = classnames(
        'maxi-block maxi-column-block',
        blockStyle,
        extraClassName,
        'hover-animation-'+hoverAnimation,
        'hover-animation-type-'+hoverAnimationType,
        'hover-animation-type-text-'+hoverAnimationTypeText,
        'hover-animation-duration-'+hoverAnimationDuration,
        className,
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <InnerBlocks.Content />
            {hoverAnimation === 'text' &&
                <div className='maxi-block-text-hover'>
                {hoverAnimationTitle !== '' &&
                <h3 className='maxi-block-text-hover__title'>{hoverAnimationTitle}</h3>
                }
                {hoverAnimationContent !== '' &&
                <div className='maxi-block-text-hover__content'>{hoverAnimationContent}</div>
                }
                </div>
            }
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