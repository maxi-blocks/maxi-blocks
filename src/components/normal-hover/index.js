/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Block
 */
const NormalHover = props => {
    const {
        selector,
        className,
        onChange
    } = props;

    let classes = classnames("gx-imagesettings-selector-control");
    if(className)
        classes = classnames(classes, className);

    return (
        <RadioControl
            className={classes}
            selected={selector}
            options={[
                { label: 'Normal', value: 'normal' },
                { label: 'Hover', value: 'hover' },
            ]}
            onChange={onChange}
        />
    )
}

export default NormalHover;