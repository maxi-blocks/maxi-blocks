const {	SelectControl } = wp.components;

export const FontLevel = ( props ) => {
    const {
        label,
        value,
        onChange,
        className
    } = props;

    return (
        <SelectControl
            label={label}
            className={className + " gx-title-level"}
            value={value}
            options={[
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' },
            ]}
            onChange={onChange}
        />
    )
}