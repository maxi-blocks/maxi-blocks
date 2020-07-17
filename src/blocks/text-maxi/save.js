/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;
const { Fragment } = wp.element;
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
        },
    } = props;

    let classes = classnames(
        'maxi-block maxi-text-block',
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
            <div className='maxi-text-block-wrap'>
                <RichText.Content
                    value={content}
                    tagName={isList ? typeOfList : textLevel}
                    className={classes}
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