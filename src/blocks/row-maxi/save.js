/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { __experimentalBackground } from '../../components';

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
        attributes: {
            uniqueID,
            blockStyle,
            hoverAnimation,
            background,
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

    const classes = classnames(
        'maxi-block maxi-row-block',
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
        <div
            className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
        >
            <__experimentalBackground
                backgroundOptions={background}
            />
            <InnerBlocks.Content />
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
        </div>
    );
}

export default save;