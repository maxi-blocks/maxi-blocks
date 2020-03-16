const {	SelectControl } = wp.components;

export const FontLevel = ( props ) => {
    const {
        label,
        className = 'gx-title-level',
        value,
        options = [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'H5', value: 'h5' },
            { label: 'H6', value: 'h6' },
        ],
        onChange,
    } = props;

    return (
        <SelectControl
            label={label}
            className={className}
            value={value}
            options={options}
            onChange={onChange}
        />
    )
}