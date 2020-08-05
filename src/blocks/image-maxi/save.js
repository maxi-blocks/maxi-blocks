/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil,
    isEmpty,
} from 'lodash';
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
            background,
            extraClassName,
            captionType,
            captionContent,
            mediaID,
            mediaURL,
            mediaWidth,
            mediaHeight,
            mediaALT,
            mediaALTwp,
            mediaALTtitle,
            altSelector,
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
            hover,
        },
        imageData
    } = props;

    const {
        settings: hoverSettings,
        titleText: hoverTitleText,
        contentText: hoverContentText,
    } = JSON.parse(hover);

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

    const imageALT = () => {
        switch (altSelector) {
            case "wordpress": return mediaALTwp;
            case "title": return mediaALTtitle;
            case "custom": return mediaALT;
            default: return '';
        }
    }

    return (
        <figure
            className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
            data-motion={motion}
            data-motion-id={uniqueID}
            data-hover={JSON.stringify(hoverSettings)}
        >
            <__experimentalBackgroundDisplayer
                backgroundOptions={background}
            />
            <div className="maxi-block-hover-element">
                <img
                    className={"wp-image-" + mediaID}
                    src={mediaURL}
                    width={mediaWidth}
                    height={mediaHeight}
                    alt={imageALT()}

                />
            </div>
            {
            hoverSettings.type !== 'none' &&
                <div className="maxi-hover-details">
                    <div className="maxi-hover-details__content">
                        {
                            !isEmpty(hoverTitleText) &&
                            <h3>{hoverTitleText}</h3>
                        }
                        {
                            !isEmpty(hoverContentText) &&
                            <p>{hoverContentText}</p>
                        }
                    </div>
                </div>
            }
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