/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    TextControl,
    TextareaControl,
} = wp.components;

/**
 * Component
 */
const CustomCSS = props => {
    const {
        extraClassName = props.attributes.extraClassName,
        onChangeExtraClassName = undefined,
        extraStyles = props.attributes.extraStyles,
        onChangeExtraStyles = undefined,
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
        <Fragment>
            <TextControl
                label={__('Additional CSS Classes', 'maxi-blocks')}
                className='maxi-additional__css-classes'
                value={extraClassName}
                onChange={value => onChangeValue('extraClassName', value, onChangeExtraClassName)}
            />
            <TextareaControl
                label={__('Additional CSS Styles', 'maxi-blocks')}
                placeholder={__('Uses the block\'s class as a parent class', 'maxi-blocks')}
                className='maxi-additional__css-styles'
                value={extraStyles}
                onChange={value => onChangeValue('extraStyles', value, onChangeExtraStyles)}
            />
        </Fragment>
    )
}

export default CustomCSS;