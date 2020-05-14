const { __ } = wp.i18n;
const { SelectControl } = wp.components;

export const imagePositionAttributes = {
    alignment: {
        type: 'string',
        default: 'top',
    },
};

export const TextAlignment = props => {
    const {
        label = __("Alignment", 'gutenberg-extra'),
        alternativeClassName = "gx-alignment",
        value = props.attributes.titleAlignment,
        options = [
            { label: __('Text Left', 'gutenbgerg-extra'), value: 'left' },
            { label: __('Text Center', 'gutenbgerg-extra'), value: 'center' },
            { label: __('Text Right', 'gutenbgerg-extra'), value: 'right' },
        ],
        onChange
    } = props;

    return (
        <SelectControl
            label={label}
            className={alternativeClassName}
            value={value}
            options={options}
            onChange={ onChange }
        />
    )
}