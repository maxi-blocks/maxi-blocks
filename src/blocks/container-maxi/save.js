/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';
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
        },
        className,
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
            null,
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

    return (
        <Fragment>
            {
                isFirstOnHierarchy &&
                <section
                    className={classes}
                    data-gx_initial_block_class={defaultBlockStyle}
                >
                    <__experimentalShapeDivider
                        shapeDividerOptions={shapeDivider}
                    />
                    <div
                        className='maxi-container-block__wrapper'
                    >
                        <div
                            className='maxi-container-block__container'
                        >
                            <InnerBlocks.Content />
                        </div>
                    </div>
                    <__experimentalShapeDivider
                        position='bottom'
                        shapeDividerOptions={shapeDivider}
                    />
                </section>
            }
            {
                !isFirstOnHierarchy &&
                <div
                    className={classes}
                    data-gx_initial_block_class={defaultBlockStyle}
                >
                    <__experimentalShapeDivider
                        shapeDividerOptions={shapeDivider}
                    />
                    <div
                        className='maxi-container-block__wrapper'
                    >
                        <InnerBlocks.Content />
                    </div>
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
                    <__experimentalShapeDivider
                        position='bottom'
                        shapeDividerOptions={shapeDivider}
                    />
                </div>
            }
        </Fragment>
    );
}

export default save;