/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

/**
 * General
 */
const allowedBlocks = [
    // 'gutenberg-extra/block-image-box',
    // 'gutenberg-extra/block-title-extra',
    // 'gutenberg-extra/testimonials-slider-block',
    'gutenberg-extra/block-row-extra',
    'gutenberg-extra/block-column-extra',
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
            return <BlockListBlock {...props} className={`gx-block-wrapper ${uniqueID}`} />;
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