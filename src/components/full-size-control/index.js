/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FullSizeControl = props => {
    const {
        size,
        defaultSize,
        onChange,
        className,
        breakpoint,
        hideWidth,
    } = props;

    const value = isObject(size) ? size : JSON.parse(size);

    const defaultValue = isObject(defaultSize)
        ? defaultSize
        : JSON.parse(defaultSize);

    const classes = classnames('maxi-fullsize-control', className);

    const onChangeValue = (target, val) => {
        if (isNil(val)) val = '';
        value[breakpoint][target] = val;
        onChange(JSON.stringify(value));
    };

    const minMaxSettings = {
        px: {
            min: 0,
            max: 3999,
        },
        em: {
            min: 0,
            max: 999,
        },
        vw: {
            min: 0,
            max: 999,
        },
        '%': {
            min: 0,
            max: 100,
        },
    };

    return (
        <div className={classes}>
            <SizeControl
                label={__('Max Width', 'maxi-blocks')}
                unit={getLastBreakpointValue(
                    value,
                    'max-widthUnit',
                    breakpoint
                )}
                defaultUnit={defaultValue[breakpoint]['max-widthUnit']}
                onChangeUnit={val => onChangeValue('max-widthUnit', val)}
                value={getLastBreakpointValue(value, 'max-width', breakpoint)}
                defaultValue={defaultValue[breakpoint]['max-width']}
                onChangeValue={val => onChangeValue('max-width', val)}
                minMaxSettings={minMaxSettings}
            />
            {!hideWidth && (
                <SizeControl
                    label={__('Width', 'maxi-blocks')}
                    unit={getLastBreakpointValue(
                        value,
                        'widthUnit',
                        breakpoint
                    )}
                    defaultUnit={defaultValue[breakpoint].widthUnit}
                    onChangeUnit={val => onChangeValue('widthUnit', val)}
                    value={getLastBreakpointValue(value, 'width', breakpoint)}
                    defaultValue={defaultValue[breakpoint].width}
                    onChangeValue={val => onChangeValue('width', val)}
                    minMaxSettings={minMaxSettings}
                />
            )}
            <SizeControl
                label={__('Min Width', 'maxi-blocks')}
                unit={getLastBreakpointValue(
                    value,
                    'min-widthUnit',
                    breakpoint
                )}
                defaultUnit={defaultValue[breakpoint]['min-widthUnit']}
                onChangeUnit={val => onChangeValue('min-widthUnit', val)}
                value={getLastBreakpointValue(value, 'min-width', breakpoint)}
                defaultValue={defaultValue[breakpoint]['min-width']}
                onChangeValue={val => onChangeValue('min-width', val)}
                minMaxSettings={minMaxSettings}
            />
            <SizeControl
                label={__('Max Height', 'maxi-blocks')}
                unit={getLastBreakpointValue(
                    value,
                    'max-heightUnit',
                    breakpoint
                )}
                defaultUnit={defaultValue[breakpoint]['max-heightUnit']}
                onChangeUnit={val => onChangeValue('max-heightUnit', val)}
                value={getLastBreakpointValue(value, 'max-height', breakpoint)}
                defaultValue={defaultValue[breakpoint]['max-height']}
                onChangeValue={val => onChangeValue('max-height', val)}
                minMaxSettings={minMaxSettings}
            />
            <SizeControl
                label={__('Height', 'maxi-blocks')}
                unit={getLastBreakpointValue(value, 'heightUnit', breakpoint)}
                defaultUnit={defaultValue[breakpoint].heightUnit}
                onChangeUnit={val => onChangeValue('heightUnit', val)}
                value={getLastBreakpointValue(value, 'heigh', breakpoint)}
                defaultValue={defaultValue[breakpoint].heigh}
                onChangeValue={val => onChangeValue('height', val)}
                minMaxSettings={minMaxSettings}
            />
            <SizeControl
                label={__('Min Height', 'maxi-blocks')}
                unit={getLastBreakpointValue(
                    value,
                    'min-heightUnit',
                    breakpoint
                )}
                defaultUnit={defaultValue[breakpoint]['min-heightUnit']}
                onChangeUnit={val => onChangeValue('min-heightUnit', val)}
                value={getLastBreakpointValue(value, 'min-height', breakpoint)}
                defaultValue={defaultValue[breakpoint]['min-height']}
                onChangeValue={val => onChangeValue('min-height', val)}
                minMaxSettings={minMaxSettings}
            />
        </div>
    );
};

export default FullSizeControl;
