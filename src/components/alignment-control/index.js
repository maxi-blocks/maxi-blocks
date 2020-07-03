/**
 * Wordpress dependencies
 */
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';
import {
    alignLeft,
    alignCenter,
    alignRight,
    alignJustify
} from '../../icons';
import { Icon } from '@wordpress/icons';

/**
 * Component
 */
const AlignmentControl = props => {

    const {
        alignment,
        onChange,
        label = '',
        disableLeft = false,
        disableCenter = false,
        disableRight = false,
        disableJustify = false,
        breakpoint
    } = props;

    const getOptions = () => {
        let options = [];
        if (!disableLeft)
            options.push({ label: <Icon icon={alignLeft} />, value: 'left' });
        if (!disableCenter)
            options.push({ label: <Icon icon={alignCenter} />, value: 'center' });
        if (!disableRight)
            options.push({ label: <Icon icon={alignRight} />, value: 'right' });
        if (!disableJustify)
            options.push({ label: <Icon icon={alignJustify} />, value: 'justify' })

        return options;
    }

    const classes = classnames(
        'maxi-alignment-control',
        (label === '') ? 'maxi-alignment-control__no-label' : ''
    );

    const value = !isObject(alignment) ?
        JSON.parse(alignment) :
        alignment;

    return (
        <RadioControl
            label={label}
            className={classes}
            selected={value[breakpoint].alignment}
            options={getOptions()}
            onChange={val => {
                value[breakpoint].alignment = val;
                onChange(JSON.stringify(value));
            }}
        />
    )
}

export default AlignmentControl;