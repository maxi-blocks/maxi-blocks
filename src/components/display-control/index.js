/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const DisplayControl = props => {
    const {
        display,
        className,
        onChange,
        breakpoint,
        defaultDisplay = 'inherit'
    } = props;

    let value = !isObject(display) ?
        JSON.parse(display) :
        display

    const classes = classnames(
        'maxi-display-control',
        className
    )

    const isHide = () => {
        const objectKeys = Object.keys(value);
        const breakpointIndex = objectKeys.indexOf(breakpoint) - 1;

        if (breakpointIndex === 0)
            return false;

        let i = breakpointIndex;

        do {
            console.log(value[objectKeys[i]], value[objectKeys[i]].display === 'none');
            if (value[objectKeys[i]].display === 'none')
                return true;
            if (value[objectKeys[i]].display === defaultDisplay)
                return false;
            else
                i--;
        }
        while (i > 0);

        return false;
    }

    const getValue = () => {
        const isPrevHide = isHide();
        console.log(isPrevHide)

        return isPrevHide && value[breakpoint].display === '' ?
            'none' :
            value[breakpoint].display;
    }

    const getNewValue = val => {
        const isPrevHide = isHide();

        if (isPrevHide)
            return val ? 'none' : defaultDisplay;
        else
            return val ? 'none' : '';
    }

    const getOptions = () => {
        const isPrevHide = isHide();

        if (isPrevHide)
            return [
                { label: __('Show', 'maxi-blocks'), value: defaultDisplay },
                { label: __('Hide', 'maxi-blocks'), value: 'none' }
            ]
        else
            return [
                { label: __('Show', 'maxi-blocks'), value: '' },
                { label: __('Hide', 'maxi-blocks'), value: 'none' }
            ]
    }
    return (
        <div
            className={classes}
        >
            <RadioControl
                label={__('Display block', 'maxi-blocks')}
                selected={getValue()}
                options={getOptions()}
                onChange={val => {
                    value[breakpoint].display = val;
                    onChange(JSON.stringify(value))
                }}
            />
        </div>
    )
}

export default DisplayControl;