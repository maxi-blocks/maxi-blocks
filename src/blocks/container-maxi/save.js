/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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
        },
        className,
    } = props;

    let classes = classnames(
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
                >
                    <div
                        className='maxi-container-block__container'
                    >
                        <InnerBlocks.Content />
                    </div>
                </section>
            }
            {
                !isFirstOnHierarchy &&
                <div
                    className={classes}
                    data-gx_initial_block_class={defaultBlockStyle}
                >
                    <InnerBlocks.Content />
                </div>
            }
        </Fragment>
    );
}

export default save;