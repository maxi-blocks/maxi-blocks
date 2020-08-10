/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';
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
            textLevel,
            isList,
            typeOfList,
            content,
            hoverAnimation,
            hoverAnimationType,
            hoverAnimationTypeText,
            hoverAnimationDuration,
            hoverAnimationTitle,
            hoverAnimationContent,
            hoverOpacity,
            hoverBackground,
            hoverAnimationCustomBorder,
            motion,
        },
    } = props;

    const classes = classnames(
        `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
        'maxi-block maxi-text-block',
        'maxi-text-block-wrap',
        blockStyle,
        extraClassName,
        uniqueID,
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
            <div
                className={classes}
                data-motion={motion}
                data-motion-id={uniqueID}
            >
                <__experimentalBackgroundDisplayer
                    backgroundOptions={background}
                    uniqueID={uniqueID}
                />
                <RichText.Content
                    className='maxi-text-block__content'
                    value={content}
                    tagName={isList ? typeOfList : textLevel}
                    data-gx_initial_block_class={defaultBlockStyle}
                />
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
            </div>
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
        </Fragment>
    );
}

export default save;