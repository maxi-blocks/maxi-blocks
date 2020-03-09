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
        attributes: {
            hoverAnimation,
            hoverAnimationDuration
        },
        setAttributes
    } = props;

    return (
        <Fragment>
            <SelectControl
                label={__("Hover Animation", 'gutenberg-extra' )}
                className="gx-hover-animation"
                value={hoverAnimation}
                options={[
                    { label: __('None', 'gutenberg-extra'), value: 'none' },
                    { label: __('Other', 'gutenberg-extra'), value: 'other' },
                ]}
                onChange={(value) => setAttributes({ hoverAnimation: value })}
            />
            <SelectControl
                label={__("Animation Duration", 'gutenberg-extra')}
                className="gx-hover-animation-duration"
                value={hoverAnimationDuration}
                options={[
                    { label: __('Shorter', 'gutenberg-extra'), value: 'shorter' },
                    { label: __('Short', 'gutenberg-extra'), value: 'short' },
                    { label: __('Normal', 'gutenberg-extra'), value: 'normal' },
                    { label: __('Long', 'gutenberg-extra'), value: 'long' },
                    { label: __('Longer', 'gutenberg-extra'), value: 'longer' },

                ]}
                onChange={(value) => setAttributes({ hoverAnimationDuration: value })}
            />
        </Fragment>
    )
}