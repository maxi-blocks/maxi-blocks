/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {	SelectControl } = wp.components;

/**
 * Block
 */
const BlockStylesControl = ( props ) => {
    const {
        firstSelectorLabel = __( 'Block Style', 'gutenberg-extra'),
        firstSelectorClassName = 'gx-block-style',
        blockStyle = props.attributes.blockStyle,
        onChangeBlockStyle = undefined,
        firstSelectorOptions = [
            { label: __('Global', 'gutenberg-extra'), value: 'gx-global' },
            { label: __('Dark', 'gutenberg-extra'), value: 'gx-dark' },
            { label: __('Light', 'gutenberg-extra'), value: 'gx-light' },
        ],
        secondSelectorLabel = __( 'Default Block Style', 'gutenberg-extra'),
        secondSelectorClassName = 'gx--default-block-style',
        defaultBlockStyle = props.attributes.defaultBlockStyle,
        onChangeDefaultBlockStyle = undefined,
        secondSelectorOptions = [
            { label: __('Dark', 'gutenberg-extra'), value: 'gx-def-dark' },
            { label: __('Light', 'gutenberg-extra'), value: 'gx-def-light' },
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
        <Fragment>
            <SelectControl
                label={firstSelectorLabel}
                className={firstSelectorClassName}
                value={blockStyle}
                options={firstSelectorOptions}
                onChange={value => onChangeValue( 'blockStyle', value, onChangeBlockStyle )}
            />
            <SelectControl
                label={secondSelectorLabel}
                className={secondSelectorClassName}
                value={defaultBlockStyle}
                options={secondSelectorOptions}
                onChange={value => onChangeValue( 'defaultBlockStyle', value, onChangeDefaultBlockStyle )}
            />
        </Fragment> 
    )
}

export default BlockStylesControl;