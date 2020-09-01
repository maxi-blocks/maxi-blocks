/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * SvgColor
 */
const SvgColor = props => {
    const {
        blockName,
        svgColor,
        onChange,
    } = props;

    if (blockName !== 'maxi-blocks/svg-icon-maxi')
        return null;

    const returnColor = val => {
        return val.hex;
    }

    return (
        <ToolbarPopover
            className='toolbar-item__background'
            tooltip={__('SVG color', 'maxi-blocks')}
            icon={(
                <div
                    className='toolbar-item__icon'
                    style={{
                        background: svgColor,
                        border: '1px solid #fff'
                    }}
                ></div>
            )}
            content={(
                <ColorPicker
                    color={svgColor}
                    onChangeComplete={val => onChange(returnColor(val))}
                    disableAlpha
                />
            )}
        />
    )
}


export default SvgColor;