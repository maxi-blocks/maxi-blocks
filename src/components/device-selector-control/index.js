/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    RadioControl
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Bock
 */
const DeviceSelectorControl = props => {

    const {
        className,
        device,
        onChange,
    } = props;

    const classes = classnames('maxi-device-control', className);

    return (
        <RadioControl
            className={classes}
            selected={device}
            options={[
                { label: __('Desktop', 'maxi-blocks'), value: 'desktop' },
                { label: __('Tablet', 'maxi-blocks'), value: 'tablet' },
                { label: __('Mobile', 'maxi-blocks'), value: 'mobile' },
            ]}
            onChange={value => onChange(value)}
        />
    )
}

export default DeviceSelectorControl;