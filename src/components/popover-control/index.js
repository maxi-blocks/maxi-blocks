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
 * Styles and icons
 */
import './editor.scss';
import { 
    advanced,
    reset
} from '../../icons';

/**
 * Block
 */
const PopoverControl = props => {
    const {
        label,
        className = 'gx-popover-control',
        classNamePopover = 'gx-popover',
        icon = advanced,
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
                {showReset &&
                    <Button
                        isSecondary
                        onClick={onReset}
                        type="reset"
                    >
                        {
                            <Icon
                                icon={reset}
                            />
                        }
                    </Button>
                }
            </BaseControl>
        </div>
    )
}

export default PopoverControl;