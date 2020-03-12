const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;

export const hoverAnimationAttributes = {
    hoverAnimation: {
        type: 'string',
        default: 'none',
    },
    hoverAnimationDuration: {
        type: 'string',
        default: 'normal',
    },
}

export const HoverAnimation = ( props ) => {
    const {
        hoverAnimationLabel = __("Hover Animation", 'gutenberg-extra' ),
        hoverAnimationClassName = "gx-hover-animation",
        hoverAnimation = props.attributes.hoverAnimation,
        hoverAnimationOptions = [
            { label: __('None', 'gutenberg-extra'), value: 'none' },
            { label: __('Other', 'gutenberg-extra'), value: 'other' },
        ],
        animationDurationLabel = __("Animation Duration", 'gutenberg-extra'),
        animationDurationClassName = "gx-hover-animation-duration",
        hoverAnimationDuration = props.attributes.hoverAnimationDuration,
        animationDurationOptions = [
            { label: __('Shorter', 'gutenberg-extra'), value: 'shorter' },
            { label: __('Short', 'gutenberg-extra'), value: 'short' },
            { label: __('Normal', 'gutenberg-extra'), value: 'normal' },
            { label: __('Long', 'gutenberg-extra'), value: 'long' },
            { label: __('Longer', 'gutenberg-extra'), value: 'longer' },
        ],
        setAttributes
    } = props;

    return (
        <Fragment>
            <SelectControl
                label={hoverAnimationLabel}
                className={hoverAnimationClassName}
                value={hoverAnimation}
                options={hoverAnimationOptions}
                onChange={(value) => setAttributes({ hoverAnimation: value })}
            />
            <SelectControl
                label={animationDurationLabel}
                className={animationDurationClassName}
                value={hoverAnimationDuration}
                options={animationDurationOptions}
                onChange={(value) => setAttributes({ hoverAnimationDuration: value })}
            />
        </Fragment>
    )
}