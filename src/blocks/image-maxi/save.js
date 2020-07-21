/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';
// import postscribe from 'postscribe';
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
            defaultBlockStyle,
            fullWidth,
            extraClassName,
            captionType,
            captionContent,
            mediaID,
            mediaURL,
            mediaWidth,
            mediaHeight,
            mediaALT,
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
            motion,
        },
    } = props;

    let classes = classnames(
        `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
        'maxi-block maxi-image-block',
        blockStyle,
        extraClassName,
        'hover-animation-' + hoverAnimation,
        'hover-animation-type-' + hoverAnimationType,
        'hover-animation-type-text-' + hoverAnimationTypeText,
        'hover-animation-duration-' + hoverAnimationDuration,
        uniqueID,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            null,
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

    return (
        <figure
            className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
            data-motion={motion}
            data-motion-id={uniqueID}
        >
            <img
                className={"wp-image-" + mediaID}
                src={mediaURL}
                width={mediaWidth}
                height={mediaHeight}
                alt={mediaALT}
            />
            {
                captionType !== 'none' &&
                <figcaption>
                    {captionContent}
                </figcaption>
            }
            {
                hoverAnimation === 'text' &&
                <div className='maxi-block-text-hover'>
                    {
                        hoverAnimationTitle !== '' &&
                        <h3 className='maxi-block-text-hover__title'>
                            {hoverAnimationTitle}
                        </h3>
                    }
                    {
                        hoverAnimationContent !== '' &&
                        <div className='maxi-block-text-hover__content'>
                            {hoverAnimationContent}
                        </div>
                    }
                </div>
            }
            {
                hoverAnimation === 'basic' &&
                <Scripts
                    hover_animation={hoverAnimationType}
                    hover_animation_type={hoverAnimation}
                >
                </Scripts>
            }
            {
                hoverAnimation === 'text' &&
                <Scripts
                    hover_animation={hoverAnimationTypeText}
                    hover_animation_type={hoverAnimation}
                >
                </Scripts>
            }
        </figure>
    );
}

export default save;