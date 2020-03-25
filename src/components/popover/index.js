/**
 * WordPress dependencies
 */
const {
    BaseControl,
    Button,
    Dropdown,
} = wp.components;

export const PopoverControl = props => {
    const {
        label,
        className = '',
        buttonText = '',
        classNamePopover = 'gx-popover',
        content
    } = props;

    return (
        <div className={className}>
            <BaseControl
                className={'gx-settings-button'}
            >
                <BaseControl.VisualLabel>
                    {label}
                </BaseControl.VisualLabel>
                <Dropdown
                    className={'gx-popover-dropdown'}
                    renderToggle={({ isOpen, onToggle }) => (
                        <Button
                            isSecondary
                            onClick={onToggle}
                            aria-expanded={isOpen}
                        >
                            {buttonText}
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
