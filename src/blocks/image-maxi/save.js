/**
 * WordPress dependencies
 */
const {
    SVG,
    Path,
    Defs,
} = wp.primitives;

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
    isEmpty
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
            svgPath
        },
        imageData
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
        >
            <__experimentalBackgroundDisplayer
                backgroundOptions={background}
                uniqueID={uniqueID}
            />
            {
                !isEmpty(svgPath) &&
                <SVG
                    x="0px"
                    y="0px"
                    viewBox="0 0 36.1 36.1"
                    xmlSpace="preserve"
                    className={`maxi-image-block__image wp-image-${mediaID}`}
                >
                    <Defs>
                        <pattern
                            id={`maxi-background-displayer__svg__${uniqueID}`}
                            x="0"
                            y="0"
                            patternUnits="userSpaceOnUse"
                            width='100%'
                            height='100%'
                        >
                            <image
                                className="maxi-image-block__image__pattern"
                                href={mediaURL}
                                width={100}
                                height={100}
                                alt={mediaALT}
                                preserveAspectRatio="xMinYMin meet"
                            />
                        </pattern>
                    </Defs>
                    <Path
                        d={svgPath}
                        fill={`url(#maxi-background-displayer__svg__${uniqueID})`}
                    />
                </SVG>
            }
            {
                isEmpty(svgPath) &&
                <img
                    className={`maxi-image-block__image wp-image-${mediaID}`}
                    src={mediaURL}
                    width={mediaWidth}
                    height={mediaHeight}
                    alt={mediaALT}
                />
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