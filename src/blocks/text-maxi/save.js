/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;
/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil
} from 'lodash';
import transform from "css-to-react-native-transform";

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
        'maxi-block maxi-image-block',
        blockStyle,
        extraClassName,
        uniqueID,
        'hover-animation-type-'+hoverAnimation,
        'hover-animation-duration-'+hoverAnimationDuration,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            '',
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    let extraStylesObj = '';

   // if (!isNil(extraStyles))  {let extraStylesObj = transform(extraStyles)}

    return (
        <RichText.Content
            value={content}
            tagName={textLevel}
            className={classes}
            style={extraStylesObj}
            data-gx_initial_block_class={defaultBlockStyle}
        />
    );
}

export default save;