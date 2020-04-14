/**
 * WordPress dependencies
 */
const {
    BaseControl,
    Button,
    Dropdown,
    Icon
} = wp.components;

/**
 * External dependencies
 */
import iconsSettings from '../icons/icons-settings.js';

/**
 * Styles
 */
import './editor.scss';

/**
 * Block
 */
export const PopoverControl = props => {
    const {
        label,
        className = 'gx-popover-control',
        classNamePopover = 'gx-popover',
        icon = iconsSettings.advanced,
        showReset = undefined,
        onReset,
        popovers
    } = props;

    return (
        <div className={className}>
            <BaseControl
                className={'gx-settings-button'}
            >
                <BaseControl.VisualLabel>
                    {label}
                </BaseControl.VisualLabel>
                {showReset &&
                    <Button
                        isSecondary
                        onClick={onReset}
                        type="reset"
                    >
                        {
                            <Icon
                                icon={iconsSettings.reset}
                            />
                        }
                    </Button>
                }
                {popovers.map(popover => {
                    if (!popover) {
                        return;
                    }
                    return (
                        <Dropdown
                            className={'gx-popover-dropdown'}
                            renderToggle={({ isOpen, onToggle }) => (
                                <Button
                                    isSecondary
                                    onClick={onToggle}
                                    aria-expanded={isOpen}
                                    action="popup"
                                >
                                    <Icon 
                                        icon={popover.icon ? popover.icon : icon}
                                    />
                                </Button>
                            )}
                            popoverProps={
                                {
                                    className: popover.classNamePopover ? popover.classNamePopover : classNamePopover,
                                    noArrow: true,
                                    position: 'center'
                                }
                            }
                            renderContent={
                                () => (
                                    popover.content
                                )
                            }
                        >
                        </Dropdown>
                    )
                })}
            </BaseControl>
        </div>
    )
}