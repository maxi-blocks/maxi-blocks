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

    let wrap_classes = classnames(
        'maxi-text-block-wrap',
        blockStyle);


    return (
        <Fragment>
            <div className={wrap_classes} data-maxi_initial_block_class={defaultBlockStyle}>
                <RichText.Content
                    value={content}
                    tagName={textLevel}
                    className={classes}
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