/**
 * WordPress dependencies
 */
const {
    BaseControl,
    Button,
    Dropdown,
} = wp.components;

import './editor.scss';

export const IconLibrary = props => {
    const {
        label,
        className = '',
        buttonText = '',
        classNamePopover = 'gx-library-popover',
        content
    } = props;

    return (
        <div className={className}>
            <BaseControl
                className={'gx-library-button'}
            >
                <BaseControl.VisualLabel>
                    {label}
                </BaseControl.VisualLabel>
                <Dropdown
                    className={'gx-library-popover-dropdown'}
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
                            position: 'bottom left'
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
