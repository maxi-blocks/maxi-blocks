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
        label = __("Image Position", 'gutenberg-extra'),
        alternativeClassName = "gx-image-position",
        value = props.attributes.imagePosition,
        onChange = undefined,
        options = [
            { label: __('Before', 'gutenbgerg-extra'), value: 'top' },
            { label: __('After', 'gutenbgerg-extra'), value: 'bottom' },
            { label: __('Left', 'gutenbgerg-extra'), value: 'left' },
            { label: __('Right', 'gutenbgerg-extra'), value: 'right' },
        ],
        setAttributes
    } = props;

    const onChangeValue = (target, value, callback) => {
        if (typeof callback != 'undefined' ) {
            callback(value);
        }
        else {
            setAttributes({[target]: value})
        }
    }

    return (
        <SelectControl
            label={label}
            className={alternativeClassName}
            value={value}
            options={options}
            onChange={value => onChangeValue( 'imagePosition', value, onChange )}
        />
    )
}