/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;

/**
 * Component
 */
const HoverAnimationControl = ( props ) => {
    const {
        hoverAnimation,
        onChangeHoverAnimation,
        hoverAnimationOptions = [
            { label: __('None', 'gutenberg-extra'), value: 'none' },
            { label: __('Other', 'gutenberg-extra'), value: 'other' },
        ],
        hoverAnimationDuration,
        onChangeHoverAnimationDuration,
        animationDurationOptions = [
            { label: __('Shorter', 'gutenberg-extra'), value: 'shorter' },
            { label: __('Short', 'gutenberg-extra'), value: 'short' },
            { label: __('Normal', 'gutenberg-extra'), value: 'normal' },
            { label: __('Long', 'gutenberg-extra'), value: 'long' },
            { label: __('Longer', 'gutenberg-extra'), value: 'longer' },
        ],
    } = props;

    return (
        <Fragment>
            <SelectControl
                label={__("Hover Animation", 'gutenberg-extra' )}
                className={"gx-hover-animation"}
                value={hoverAnimation}
                options={hoverAnimationOptions}
                onChange={value => onChangeHoverAnimation( value )}
            />
            <SelectControl
                label={__("Animation Duration", 'gutenberg-extra')}
                className={"gx-hover-animation-duration"}
                value={hoverAnimationDuration}
                options={animationDurationOptions}
                onChange={value => onChangeHoverAnimationDuration( value )}
            />
        </Fragment>
    )
}

export default HoverAnimationControl;