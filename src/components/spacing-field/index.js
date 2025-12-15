/**
 * WordPress dependencies
 */
import { useState, useMemo, useCallback } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import SpacingPopover from './spacing-popover';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Styles
 */
import './editor.scss';

const SIDES = ['top', 'right', 'bottom', 'left'];

// --- Helpers ---

const normalizeValue = (spacingValue) => ({
    value: spacingValue?.value ?? '0',
    unit: spacingValue?.unit ?? 'px',
});

const buildSpacingGroup = (group) => ({
    top: normalizeValue(group?.top),
    right: normalizeValue(group?.right),
    bottom: normalizeValue(group?.bottom),
    left: normalizeValue(group?.left),
});

const areSidesLinked = (group) => {
    if (!group) return true;
    const { top, right, bottom, left } = group;
    // Check if every side matches 'top'
    return [right, bottom, left].every(side => 
        side?.value === top?.value && side?.unit === top?.unit
    );
};

const SpacingField = ({
    value = {},
    onChange = () => {},
    disableMargin = false,
    disablePadding = false,
    breakpoint = 'general',
    noResponsiveTabs = false,
}) => {
    // 1. Memoize value calculation to ensure stability
    // We use the spread operator logic exactly like your original code 
    // to ensure we don't pass 'undefined' keys.
    const nextValue = useMemo(() => ({
        ...(disableMargin ? {} : { margin: buildSpacingGroup(value?.margin) }),
        ...(disablePadding ? {} : { padding: buildSpacingGroup(value?.padding) }),
    }), [value, disableMargin, disablePadding]);

    // 2. Initialize Linked State intelligently
    // We check the incoming values once on mount.
    const [marginLinked, setMarginLinked] = useState(() => areSidesLinked(value?.margin));
    const [paddingLinked, setPaddingLinked] = useState(() => areSidesLinked(value?.padding));

    // 3. Centralized Change Handler
    const handleUpdate = useCallback((type, side, inputVal) => {
        const parsedValue = inputVal?.value ?? '';
        const isAuto = parsedValue === 'auto';
        const isLinked = type === 'margin' ? marginLinked : paddingLinked;
        
        // Get the current group (e.g. nextValue.margin)
        const currentGroup = nextValue[type];

        let updatedGroup;

        if (isLinked) {
            // Update all sides
            updatedGroup = {};
            SIDES.forEach(s => {
                updatedGroup[s] = {
                    value: parsedValue,
                    unit: isAuto ? '' : inputVal?.unit || 'px',
                };
            });
        } else {
            // Update single side
            updatedGroup = {
                ...currentGroup,
                [side]: {
                    value: parsedValue,
                    unit: isAuto ? '' : inputVal?.unit || 'px',
                },
            };
        }

        // Return the structure exactly as the parent expects
        onChange({
            ...nextValue,
            [type]: updatedGroup,
        });
    }, [marginLinked, paddingLinked, nextValue, onChange]);

    // 4. Reusable Render Function (kept internal for safety)
    const renderControlGroup = (type, isLinked, onToggle) => {
        // Guard clause: if this group doesn't exist in nextValue (e.g. disabled), don't render
        if (!nextValue[type]) return null;

        return (
            <div className={`maxi-spacing-field__${type}`}>
                <div className={`maxi-spacing-field__label maxi-spacing-field__label--${type}`}>
                    {type.toUpperCase()}
                </div>
                <Button
                    icon={isLinked ? link : linkOff}
                    onClick={onToggle}
                    className={classnames(
                        'maxi-spacing-field__link-button',
                        `maxi-spacing-field__link-button--${type}`,
                        isLinked && 'is-linked'
                    )}
                    label={isLinked ? 'Unlink sides' : 'Link sides'}
                    isSmall
                />
                {SIDES.map((side) => (
                    <SpacingPopover
                        key={`${type}-${side}`}
                        spacingValue={nextValue[type][side]}
                        gridArea={side}
                        onChange={(val) => handleUpdate(type, side, val)}
                    />
                ))}
            </div>
        );
    };

    const controls = (
        <div className={classnames('maxi-spacing-field', 'relative')}>
            {!disableMargin && renderControlGroup('margin', marginLinked, () => setMarginLinked(!marginLinked))}
            {!disablePadding && renderControlGroup('padding', paddingLinked, () => setPaddingLinked(!paddingLinked))}
        </div>
    );

    if (noResponsiveTabs) return controls;

    return (
        <ResponsiveTabsControl breakpoint={breakpoint}>
            {controls}
        </ResponsiveTabsControl>
    );
};

export default SpacingField;