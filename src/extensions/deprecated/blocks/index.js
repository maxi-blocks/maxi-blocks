/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

/**
 * General
 */
const allowedBlocks = [
    // 'maxi-blocks/block-image-box',
    // 'maxi-blocks/block-title-extra',
    // 'maxi-blocks/testimonials-slider-block',
    'maxi-blocks/row-maxi',
    'maxi-blocks/column-maxi',
];

/**
 * Extend wrapper classes on selected Blocks
 */
const withCustomClassName = createHigherOrderComponent(
    BlockListBlock => props => {
        const { 
            attributes: {
                uniqueID
            },
            name: blockName,
        } = props;

        if (allowedBlocks.includes(blockName))
            return <BlockListBlock {...props} className={`maxi-block-wrapper ${uniqueID}`} />;
        else
            return <BlockListBlock {...props} />;

    },
    'withClientIdClassName'
);

// addFilter(
//     'editor.BlockListBlock',
//     'my-plugin/with-client-id-class-name',
//     withCustomClassName
// );