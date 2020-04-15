/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { 
    Icon,
    RadioControl
} = wp.components;

/**
 * Internal dependencies
 */
import iconsSettings from '../icons/icons-settings';

/**
 * 
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Bock
 */
const DeviceSelector = props => {
    const {
        className,
        device,
        onChange,
    } = props;

    let classes = classnames('gx-device-control');
    classes = classnames(classes, className);

    return (
        <RadioControl
            className={classes}
            selected={device}
            options={[
                { label: (
                    <Icon 
                        className='gx-device-control-icon'
                        icon={iconsSettings.desktopChrome}
                    />
                ), value: 'desktop' },
                { label: (
                    <Icon 
                        className='gx-device-control-icon'
                        icon={iconsSettings.tablet}
                    />
                ), value: 'tablet' },
                { label: (
                    <Icon 
                        className='gx-device-control-icon'
                        icon={iconsSettings.mobile}
                    />
                ), value: 'mobile' },
            ]}
            onChange={value => onChange(value)}
        />
    )
}

export default DeviceSelector;