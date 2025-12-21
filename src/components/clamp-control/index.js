import { __, sprintf } from '@wordpress/i18n';
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
import { lowerCase } from 'lodash';
import './editor.scss';

const ClampControl = ({
    label,
    valueKey,
    getValue,
    getUnitValue = getValue,
    getPlaceholder = getValue,
    getDefault,
    onChangeFormat,
    prefix,
    className,
    isClampEnabled,
    isClampAutoEnabled,
    ...props
}) => {
    // Helper to avoid repeating prefix/valueKey logic
    const getAttrKey = (suffix) => `${prefix}${valueKey}${suffix}`;

    const clampStatus = isClampEnabled !== undefined ? !!isClampEnabled : !!getValue(`${valueKey}-clamp-status`);
    const clampAutoStatus = isClampAutoEnabled !== undefined ? !!isClampAutoEnabled : !!getValue(`${valueKey}-clamp-auto-status`);

    // 1. Define the fields configuration to avoid JSX repetition
    const fields = [
        { id: 'min', suffix: '-clamp-min', label: sprintf(__('Minimum %s', 'maxi-blocks'), lowerCase(label)) },
        { id: 'pref', suffix: '', label: sprintf(__('Preferred %s', 'maxi-blocks'), lowerCase(label)), hide: clampAutoStatus },
        { id: 'max', suffix: '-clamp-max', label: sprintf(__('Maximum %s', 'maxi-blocks'), lowerCase(label)) },
    ];

    // 2. Centralized update handler
    const updateValue = (suffix, val, unit = null) => {
        const updates = { [getAttrKey(suffix)]: val };
        if (unit) {
            updates[getAttrKey(`${suffix}-unit`)] = unit;
        }
        onChangeFormat(updates);
    };

    // 3. Centralized reset handler
    const handleReset = (suffix) => {
        onChangeFormat({
            [getAttrKey(`${suffix}-unit`)]: getDefault(`${valueKey}${suffix}-unit`),
            [getAttrKey(suffix)]: getDefault(`${valueKey}${suffix}`),
        }, { isReset: true });
    };

    return (
        <div className={className}>
            {clampStatus && <hr className="maxi-clamp-divider" />}
            
            {clampStatus && fields.map(({ id, suffix, label: fieldLabel, hide }) => {
                if (hide) return null;
                
                return (
                    <AdvancedNumberControl
                        key={id}
                        data-clamp-field="true"
                        label={fieldLabel}
                        enableUnit
                        unit={getUnitValue(`${valueKey}${suffix}-unit`)}
                        defaultUnit={getDefault(`${valueKey}${suffix}-unit`)}
                        placeholder={getPlaceholder(`${valueKey}${suffix}`)}
                        value={getValue(`${valueKey}${suffix}`)}
                        defaultValue={getDefault(`${valueKey}${suffix}`)}
                        onChangeUnit={val => updateValue(`${suffix}-unit`, val)}
                        onChangeValue={(val, unit) => updateValue(suffix, val, unit)}
                        onReset={() => handleReset(suffix)}
                        {...props}
                    />
                );
            })}

            {clampStatus && (
                <ToggleSwitch
                    label={__('Auto-adjust scaling', 'maxi-blocks')}
                    selected={clampAutoStatus}
                    onChange={val => onChangeFormat({ [getAttrKey('-clamp-auto-status')]: val })}
                />
            )}

            {!clampStatus && (
                <AdvancedNumberControl
                    label={label}
                    enableUnit
                    unit={getUnitValue(`${valueKey}-unit`)}
                    defaultUnit={getDefault(`${valueKey}-unit`)}
                    placeholder={getPlaceholder(valueKey)}
                    value={getValue(valueKey)}
                    defaultValue={getDefault(valueKey)}
                    onChangeUnit={val => updateValue('-unit', val)}
                    onChangeValue={(val, unit) => updateValue('', val, unit)}
                    onReset={() => handleReset('')}
                    {...props}
                />
            )}

            <ToggleSwitch
                label={sprintf(__('Clamp %s', 'maxi-blocks'), lowerCase(label))}
                selected={clampStatus}
                onChange={val => onChangeFormat({ [getAttrKey('-clamp-status')]: val })}
            />
            
            {clampStatus && <hr className="maxi-clamp-divider" />}
        </div>
    );
};

export default ClampControl;