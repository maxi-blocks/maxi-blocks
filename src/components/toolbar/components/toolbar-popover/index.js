/**
 * WordPress dependencies
 */
const {
    Fragment,
    Component
} = wp.element;
const {
    Button,
    Icon,
    Popover,
    withFocusOutside
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
class ToolbarPopover extends Component {
    state = {
        isOpen: false
    }

    handleFocusOutside() {
        this.setState({
            isOpen: false
        })
    }

    onToggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        const {
            className,
            icon,
            content
        } = this.props;

        const { isOpen } = this.state;

        const classes = classnames(
            'toolbar-item',
            'toolbar-item__button',
            className
        );

        return (
            <Fragment>
                <Button
                    className={classes}
                    onClick={() => this.onToggle()}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={icon}
                    />
                </Button>
                {
                    isOpen &&
                    <Popover
                        className='toolbar-item__popover'
                        noArrow={false}
                        position='top center'
                        focusOnMount={true}
                        isAlternate
                        // anchorRef= anchorRef
                        __unstableSticky={true}
                        // __unstableSlotName= "block-toolbar"
                        shouldAnchorIncludePadding={true}
                    >
                        {content}
                    </Popover>
                }
            </Fragment>
        )
    }
}

export default withFocusOutside(ToolbarPopover);