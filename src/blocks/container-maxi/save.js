/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import {
    __experimentalShapeDivider,
    __experimentalBackgroundDisplayer
} from '../../components';

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
        attributes: {
            uniqueID,
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            fullWidth,
            background,
            extraClassName,
            shapeDivider,
            motion,
        },
        className,
    } = props;

    let classes = classnames(
        `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
        'maxi-block maxi-container-block',
        blockStyle,
        extraClassName,
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
                    data-motion={motion}
                    data-shape-divider={shapeDivider}
                    data-motion-id={uniqueID}
                >
                    <div className="maxi-container-block__overlay"></div>
                    <__experimentalBackgroundDisplayer
                        background={background}
                    />
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
                    <__experimentalBackgroundDisplayer
                        background={background}
                    />
                    <__experimentalShapeDivider
                        shapeDividerOptions={shapeDivider}
                    />
                    <div
                        className='maxi-container-block__wrapper'
                    >
                        <InnerBlocks.Content />
                    </div>
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