/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    BaseControl,
    Button,
    Modal
} = wp.components;

class ModalControl extends Component {

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
                <BaseControl>
                    <BaseControl.VisualLabel>
                        { __('Modal Test', 'maxi-blocks') }
                    </BaseControl.VisualLabel>
                    <Button
                        isSecondary
                        onClick={onClick}
                    >
                        { __('Open Modal', 'maxi-blocks') }
                    </Button>
                    {isOpen &&
                        <Modal
                            title='This is my modal'
                            onRequestClose={onClick}>
                            <Button isSecondary onClick={onClick}>
                                { __('My custom close button', 'maxi-blocks') }
                            </Button>
                        </Modal>
                    }
                </BaseControl>
            </div>
        )
    }
}

export default ModalControl;