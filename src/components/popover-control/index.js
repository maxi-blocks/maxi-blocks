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