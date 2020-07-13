/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { TextControl } = wp.components;

/**
 * Component
 */
const CustomCSS = props => {
    const {
        extraClassName = props.attributes.extraClassName,
        onChangeExtraClassName = undefined,
        setAttributes
    } = props;

    const onChangeValue = (target, value, callback) => {
        if (typeof callback != 'undefined') {
            callback(value);
        }
        else {
            setAttributes({ [target]: value })
        }
    }

    return (
        <Fragment>
            <TextControl
                label={__('Additional CSS Classes', 'maxi-blocks')}
                className='maxi-additional__css-classes'
                value={extraClassName}
                onChange={value => onChangeValue('extraClassName', value, onChangeExtraClassName)}
            />
        </Fragment>
    )
}

export default CustomCSS;