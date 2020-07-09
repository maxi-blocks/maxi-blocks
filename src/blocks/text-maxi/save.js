/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
            extraStyles,
            hoverAnimation,
            hoverAnimationDuration
        },
    } = props;

    let classes = classnames(
        'maxi-block maxi-text-block',
        blockStyle,
        extraClassName,
        uniqueID,
        'hover-animation-type-' + hoverAnimation,
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
        <RichText.Content
            value={content}
            tagName={textLevel}
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        />
    );
}

export default save;