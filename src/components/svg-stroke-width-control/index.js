/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RangeControl,
} = wp.components;

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
    const {
        defaultStroke,
        stroke,
        onChange,
        breakpoint = 'general',
    } = props;

    return (
        <RangeControl
            value={stroke}
            onChange={val => onChange(val)}
            min={0.1}
            max={10}
            step={0.1}
            withInputField={true}
            initialPosition={defaultStroke}
            allowReset={true}
        />
    )
}

export default SvgStrokeWidthControl;