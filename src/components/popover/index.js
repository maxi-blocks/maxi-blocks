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
 * Block
 */
export const PopoverControl = props => {
    const {
        label,
        className = '',
        buttonText = '',
        classNamePopover = 'gx-popover',
        icon = iconsSettings.advanced,
        content,
        showReset = undefined,
        onReset,
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
                        action="reset"
                    >
                        {
                            <Icon 
                                icon={iconsSettings.reset}
                            />
                        }
                    </Button>
                }
                <Dropdown
                    className={'gx-popover-dropdown'}
                    renderToggle={({ isOpen, onToggle }) => (
                        <Button
                            isSecondary
                            onClick={onToggle}
                            aria-expanded={isOpen}
                            action="popup"
                        >
                            {icon}
                        </Button>
                    )}
                    popoverProps={
                        {
                            className: classNamePopover,
                            noArrow: true,
                            position: 'center'
                        }
                    }
                    renderContent={
                        () => (
                            content
                        )
                    }
                >
                </Dropdown>
            </BaseControl>
        </div>
    )
}