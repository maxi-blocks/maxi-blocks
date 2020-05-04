/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;
const {
    InnerBlocks,
    InspectorControls
} = wp.blockEditor;
const {
    PanelBody,
    RangeControl
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
    const {
        anchor,
        className,
        attributes: {
            uniqueID,
            blockStyle,
            extraClassName,
        }
    } = props;

    let classes = classnames(
        'gx-block gx-column-block', 
        blockStyle, 
        extraClassName, 
        className
    );
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div className={classes}>
            <div
                className="gx-column-block-content"
            >
                <InnerBlocks.Content />
            </div>
        </div>
    );
}

export default save;