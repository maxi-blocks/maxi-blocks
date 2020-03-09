const { __ } = wp.i18n;
const { SelectControl } = wp.components;

export const imagePositionAttributes = {
    imagePosition: {
        type: 'string',
        default: 'top',
    },
}

export const ImagePosition = (props) => {
    const {
        attributes: {
            imagePosition
        },
        setAttributes
    } = props;

    return (
        <SelectControl
            label={__("Image Position", 'gutenberg-extra')}
            className="gx-image-position"
            value={imagePosition}
            options={[
                { label: __('Before', 'gutenbgerg-extra'), value: 'top' },
                { label: __('After', 'gutenbgerg-extra'), value: 'bottom' },
                { label: __('Left', 'gutenbgerg-extra'), value: 'left' },
                { label: __('Right', 'gutenbgerg-extra'), value: 'right' },
            ]}
            onChange={(value) => setAttributes({ imagePosition: value })}
        />
    )
}