const { RawHTML } = wp.element;

/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import { ReactSVG } from 'react-svg'
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
            SVGElement,
            fullWidth,
            background,
            extraClassName,
            motion,
        },
    } = props;

    const classes = classnames(
        `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
        'maxi-block maxi-svg-block',
        blockStyle,
        extraClassName,
        uniqueID,
        className,
        fullWidth === 'full' ?
            'alignfull' :
            null,
        !isNil(uniqueID) ?
            uniqueID :
            null,
    );

    return (
        <div
            className={classes}
            data-maxi_initial_block_class={defaultBlockStyle}
            data-motion={motion}
            data-motion-id={uniqueID}
        >
            <__experimentalBackgroundDisplayer
                backgroundOptions={background}
            />
            <RawHTML>
                {SVGElement}
            </RawHTML>
        </div>
    );
}

export default save;