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
 * Icons
 */
import DesctopIcon from '../../icons/block-icons/desktop-icon/icon';
import TabletIcon from '../../icons/block-icons/tablet-icon/icon';
import MobileIcon from '../../icons/block-icons/mobile-icon/icon';


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
                { label: <DesctopIcon />, value: 'desktop' },
                { label: <TabletIcon />, value: 'tablet' },
                { label: <MobileIcon />, value: 'mobile' },
            ]}
            onChange={value => onChange(value)}
        />
    )
}

export default DeviceSelectorControl;