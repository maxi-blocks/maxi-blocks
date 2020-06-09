/**
 * Layout modal window with tab panel.
 */

import { MaxiContext } from './provider';
import Iframe from 'react-iframe';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const {
    Component,
    Fragment,
} = wp.element;
const {
    Button,
    Modal,
    TabPanel,
    ToggleControl,
} = wp.components;

/**
 * WordPress dependencies.
 */
const { compose } = wp.compose;
const { rawHandler } = wp.blocks;
const {
    withSelect,
    withDispatch,
    clientId
} = wp.data;


class MaxiModal extends Component {


        // this.state = {
        //     modalOpen: true,
        //     currentTab: 'maxi-cloud-tab-sections',
        //     loadGlobalStyles: false,
        // };

        state = {
            isOpen: false,
            loadGlobalStyles: false,
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

        //console.log("isOpen: "+ isOpen);

        return (
            <Fragment key={ 'maxi-block-library__fragment--' + this.props.clientId }>
                { /* Launch the layout modal window */ }
                <Button
                    key={ 'maxi-block-library__modal-button--' + this.props.clientId }
                    isPrimary
                    isLarge
                    className='maxi-block-library__modal-button'
                    onClick={ onClick }
                >
                    { __( 'Launch the Library', 'maxi-blocks' ) }
                </Button>
                { isOpen ?
                    <MaxiContext.Consumer key={ 'maxi-block-library__context-provider--' + this.props.clientId }>
                        { ( context ) => (
                            <Modal
                                key={ 'maxi-block-library__modal--' + this.props.clientId }
                                className="maxi-block-library__modal"
                                title={ __( 'Maxi Cloud Library', 'maxi-blocks' ) }
                                shouldCloseOnEsc = {true}
                                shouldCloseOnClickOutside={false}
                                onRequestClose={ onClick }
                            >
                                <Iframe url="https://ge-library.dev700.com/?_sft_gutenberg_type=block-patterns&_sft_light_or_dark=light"
                                width="100%"
                                height="90%"
                                id="maxi-block-library__modal-iframe"
                                className="maxi-block-library__modal-iframe"
                                display="initial"
                                position="relative"/>
                                <Fragment>
                                    <div class='maxi-block-library__modal__loading_message maxi-block__item--hidden'>
                                        <p>Saving...</p>
                                    </div>
                                </Fragment>
                            </Modal>
                        )}
                    </MaxiContext.Consumer>
                    : null }
            </Fragment>
        );
    }
}
export default MaxiModal;