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
        label = __('Alignment', 'maxi-blocks'),
        alternativeClassName = 'maxi-alignment',
        value = props.attributes.titleAlignment,
        options = [
            { label: __('Text Left', 'maxi-blocks'), value: 'left' },
            { label: __('Text Center', 'maxi-blocks'), value: 'center' },
            { label: __('Text Right', 'maxi-blocks'), value: 'right' },
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