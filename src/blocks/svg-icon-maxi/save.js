/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { RawHTML } from '@wordpress/element';
import {
    isNil,
    isEmpty,
} from 'lodash';

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
            motion,
            hover,
            content,
            hoverContent
        },
    } = props;

    const {
        settings: hoverSettings,
        titleText: hoverTitleText,
        contentText: hoverContentText,
        textPreset: hoverTextPreset,
    } = JSON.parse(hover);

    let classes = classnames(
        `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
        `maxi-block maxi-svg-icon-block`,
        blockStyle,
        extraClassName,
        uniqueID,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            null,
        !isNil(uniqueID) ?
            uniqueID :
            null
    );

    return (
        <div className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
            data-motion={motion}
            data-motion-id={uniqueID}
            >

            <RawHTML>{ content }</RawHTML>
            <__experimentalBackgroundDisplayer
                background={background}
            />
        </div>
    );
}

export default save;