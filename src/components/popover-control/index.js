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
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    advanced,
    reset
} from '../../icons';

/**
 * Component
 */
const PopoverControl = props => {
    const {
        label,
        className,
        classNamePopover,
        icon = advanced,
        showReset = undefined,
        onReset,
        popovers
    } = props;

    const classes = classnames('gx-popover-control', className);
    // For doing that, we need to modify a little bit
    // let's do it (ask me if you don't understand what I'm doing, ok?)

    // So, here we are getting a basic class for the popover, and adding a general class
    // in case is passed by props => classNamePopover
    let classesPopover = classnames('gx-popover', classNamePopover);

    return (
        <div className={classes}>
            <BaseControl
                className={'gx-settings-button'}
            >
                <BaseControl.VisualLabel>
                    {label}
                </BaseControl.VisualLabel>
                {popovers.map(popover => {
                    if (!popover) {
                        return
                    }

                    // Here we are updating that classesPopover with a specific class for that popover
                    // In case it would be more than one element
                    // I.g. on ColorControl we could have one class for color, and other gradient
                    // Ping me when read =>
                    classesPopover = classnames(classesPopover, popover.classNamePopover);

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
                                // Here we have the popover options
                                // It has classname, but it has an error (mea culpa in this case)
                                // the problem it has is: doesn't have a constant class
                                // so, how it should look our className for popover should be something like this:
                                // '.gx-popover {popover class added, like .gx-typography-popover}
                                // So, in this way, we have a constant class that will be repeated in all
                                // Popover instances. That's a good starting
                                // ping me when read =>
                                {
                                    className: classesPopover,
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