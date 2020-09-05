/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { SelectControl, RangeControl } = wp.components;
const { Fragment } = wp.element;

/**
 * Component
 */
const SvgAnimationDurationControl = (props) => {
    const {
        animation,
        duration,
        onChange,
    } = props;
    return (
        <Fragment>
        { {animation} !== 'off' && <RangeControl
                label={__('Animation Duration', 'maxi-blocks')}
                value={duration}
                min={1.0}
                max={5.0}
                step={0.1}
                initialPosition={3.7}
                onChange={value => onChange(value)}
            />
        }
        </Fragment>
    )
}

export default SvgAnimationDurationControl;