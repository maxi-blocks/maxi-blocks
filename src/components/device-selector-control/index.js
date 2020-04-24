/**
 * WordPress dependencies
 */
const { 
    Icon,
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
import {
    desktop,
    tablet,
    mobile
} from '../../icons';

/**
 * Bock
 */
const DeviceSelectorControl = props => {
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
                { label: "", value: 'desktop' },
                { label: "", value: 'tablet' },
                { label: "", value: 'mobile' },
            ]}
            onChange={value => onChange(value)}
        />
    )
}

export default DeviceSelectorControl;