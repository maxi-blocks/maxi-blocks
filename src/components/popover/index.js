/**
 * WordPress dependencies
 */
const {
    BaseControl,
    Button,
    Dropdown,
} = wp.components;

export const Popover = props => {
    const {
        className = '',
        label,
        buttonText = '',
        classNamePopover = "gx-popover gx-fontpopover",
        content
    } = props;

    return (
        <div className={className}>
            <BaseControl
                className={"gx-settings-button"}
            >
                <BaseControl.VisualLabel>
                    {label}
                </BaseControl.VisualLabel>
                <Dropdown
                    className={'gx-fontdropdown'}
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
                            position: "center"
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