/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Style
 */
import './style.scss';

/**
 * Component
 */
const ImagePositionControl = (props) => {
    const {
        value,
        onChange,
        options = [
            { label: __('Before', 'gutenbgerg-extra'), value: 'top' },
            { label: __('After', 'gutenbgerg-extra'), value: 'bottom' },
            { label: __('Left', 'gutenbgerg-extra'), value: 'left' },
            { label: __('Right', 'gutenbgerg-extra'), value: 'right' },
        ],
    } = props;

    return (
        <SelectControl
            label={__("Image Position", 'maxi-blocks')}
            className={"maxi-image-position"}
            value={value}
            options={options}
            onChange={value => onChange( value )}
        />
    )
}

export default ImagePositionControl;