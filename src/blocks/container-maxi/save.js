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
 * Internal dependencies
 */
import { __experimentalShapeDivider } from '../../components';

/**
 * Save
 */
const save = props => {

    const {
        className,
        attributes: {
            uniqueID,
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            fullWidth,
            extraClassName,
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
            shapeDivider,
            shapeDividerBottom,
        }
    } = props;

    let classes = classnames(
        'maxi-block maxi-container-block',
        blockStyle,
        extraClassName,
        'hover-animation-' + hoverAnimation,
        'hover-animation-type-' + hoverAnimationType,
        'hover-animation-type-text-' + hoverAnimationTypeText,
        'hover-animation-duration-' + hoverAnimationDuration,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            '',
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div className="maxi-section-container">
            <__experimentalShapeDivider
                shapeDividerOptions={shapeDivider}
            />
            {
                isFirstOnHierarchy &&
                <section
                    className={classes}
                    data-gx_initial_block_class={defaultBlockStyle}
                >
                    <div
                        className='maxi-container-block__container'
                    >
                        <InnerBlocks.Content />
                    </div>
                </section>
            }
            {
                !isFirstOnHierarchy &&
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
                            hover_animation={hoverAnimationType}
                            hover_animation_type={hoverAnimation}
                        >
                        </Scripts>
                    }
                    {hoverAnimation === 'text' &&
                        <Scripts
                            hover_animation={hoverAnimationTypeText}
                            hover_animation_type={hoverAnimation}
                        >
                        </Scripts>
                    }
                </div>
            }
            <__experimentalShapeDivider
                position='bottom'
                shapeDividerOptions={shapeDividerBottom}
            />
        </div>
    );
}

export default save;