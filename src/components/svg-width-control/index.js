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
const SvgWidthControl = props => {
    const {
        width,
        onChange,
        breakpoint = 'general',
    } = props;

    return (
        <RangeControl
            value={width}
            onChange={val => onChange(val)}
            min={10}
            max={250}
            step={1}
            withInputField={true}
            initialPosition={64}
            allowReset={true}
        />
    )
}

export default SvgWidthControl;