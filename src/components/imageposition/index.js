const {	SelectControl } = wp.components;

export const imagePositionAttributes = {
    imagePosition: {
        type: 'string',
        default: 'top',
    },
}

export const ImagePosition = ( props ) => {
    const {
        attributes: {
            imagePosition
        },
        setAttributes
    } = props;

    return ( 
        <SelectControl
            label="Image Position"
            className="gx-image-position"
            value={imagePosition}
            options={[
                { label: 'Before', value: 'top' },
                { label: 'After', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
            ]}
            onChange={(value) => setAttributes({ imagePosition: value })}
        />
    )
}