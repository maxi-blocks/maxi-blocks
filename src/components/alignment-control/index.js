/**
 * Wordpress dependencies
 */
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and Icons
 */
import './editor.scss';
import {
    Icon,
    alignLeft,
    alignCenter,
    alignRight,
    alignJustify
} from '@wordpress/icons';

/**
 * Component
 */
const AlignmentControl = props => {

    const {
        value,
        onChange,
        label = '',
        disableLeft = false,
        disableCenter = false,
        disableRight = false,
        disableJustify = false,
    } = props;

    const getOptions = () => {
        let options = [];
        if(!disableLeft)
            options.push({ label: <Icon icon={alignLeft} />, value: 'left' });
        if(!disableCenter)
            options.push({ label: <Icon icon={alignCenter} />, value: 'center' });
        if(!disableRight)
            options.push({ label: <Icon icon={alignRight} />, value: 'right' });
        if(!disableJustify)
            options.push({ label: <Icon icon={alignJustify} />, value: 'justify' })

        return options;
    }

    const classes = classnames(
        'maxi-alignment-control',
        ( label === '' ) ? 'maxi-alignment-control__no-label' : ''
    );

    return (
        <RadioControl
            label={ label }
            className={classes}
            selected={value}
            options={getOptions()}
            onChange={value => onChange(value)}
        />
    )
}

export default AlignmentControl;