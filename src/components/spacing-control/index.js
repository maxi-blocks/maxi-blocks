/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import SpacingField from '@components/spacing-field';
import { getLastBreakpointAttribute } from '@extensions/styles';

const spacingSides = ['top', 'right', 'bottom', 'left'];

const buildSpacingGroup = (attributes, type, breakpoint, prefix = '') =>
        spacingSides.reduce((acc, side) => {
                const baseKey = `${prefix}${type}-${side}`;
                const value = getLastBreakpointAttribute({
                        target: baseKey,
                        breakpoint,
                        attributes,
                });

                const unit = getLastBreakpointAttribute({
                        target: `${baseKey}-unit`,
                        breakpoint,
                        attributes,
                });

                acc[side] = {
                        value: value ?? '0',
                        unit: value === 'auto' ? '' : unit || 'px',
                };

                return acc;
        }, {});

const SpacingControl = ({
        attributes = {},
        breakpoint = 'general',
        onChange = () => {},
        prefix = '',
        disableMargin = false,
        label,
}) => {
        const spacingValue = {
                ...(disableMargin ? {} : { margin: buildSpacingGroup(attributes, 'margin', breakpoint, prefix) }),
                padding: buildSpacingGroup(attributes, 'padding', breakpoint, prefix),
        };

        const handleChange = updated => {
                const updates = {};

                ['margin', 'padding'].forEach(type => {
                        if (disableMargin && type === 'margin') return;

                        spacingSides.forEach(side => {
                                const nextValue = updated?.[type]?.[side];
                                if (!nextValue) return;

                                const baseKey = `${prefix}${type}-${side}`;
                                const valueKey = `${baseKey}-${breakpoint}`;
                                const unitKey = `${baseKey}-unit-${breakpoint}`;

                                updates[valueKey] = nextValue.value ?? '';
                                updates[unitKey] =
                                        nextValue.value === 'auto'
                                                ? ''
                                                : nextValue.unit || 'px';
                        });
                });

                onChange(updates);
        };

        return (
                <BaseControl label={label} className='maxi-spacing-control'>
                        <SpacingField
                                value={spacingValue}
                                onChange={handleChange}
                                disableMargin={disableMargin}
                                disablePadding={false}
                        />
                </BaseControl>
        );
};

export default SpacingControl;
