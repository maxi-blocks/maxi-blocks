/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const {
    BaseControl,
    Button,
    Modal
} = wp.components;

class IconLibrary extends Component {

    state = {
        isOpen: false
    }

    render() {
        const {
            className = ''
        } = this.props;

        const {
            isOpen
        } = this.state;

        const onClick = () => {
            this.setState({ isOpen: !this.state.isOpen })
        }

        return (
            <div className={className}>
                <BaseControl
                    className={'gx-settings-button'}
                >
                    <BaseControl.VisualLabel>
                        Modal Test
                    </BaseControl.VisualLabel>
                    <Button
                        isSecondary
                        onClick={onClick}
                    >
                        Open Modal
                    </Button>
                    {isOpen &&
                        <Modal
                            title="This is my modal"
                            onRequestClose={onClick}>
                            <Button isSecondary onClick={onClick}>
                                My custom close button
                            </Button>
                        </Modal>
                    }
                </BaseControl>
            </div>
        )
    }
}

export default IconLibrary; 
