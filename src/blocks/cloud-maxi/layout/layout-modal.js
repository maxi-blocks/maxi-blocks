/**
 * Layout modal window with tab panel.
 */

import { LayoutsContext } from '../layouts-provider';
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


class LayoutModal extends Component {


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
            <Fragment key={ 'layout-modal-fragment-' + this.props.clientId }>
                { /* Launch the layout modal window */ }
                <Button
                    key={ 'layout-modal-library-button-' + this.props.clientId }
                    isPrimary
                    isLarge
                    className="maxi-cloud-modal-button"
                    onClick={ onClick }
                >
                    { __( 'Launch the Library', 'maxi-blocks' ) }
                </Button>
                { isOpen ?
                    <LayoutsContext.Consumer key={ 'layouts-context-provider-' + this.props.clientId }>
                        { ( context ) => (
                            <Modal
                                key={ 'layout-modal-modal-component-' + this.props.clientId }
                                className="maxi-cloud-modal"
                                title={ __( 'Maxi Cloud Library', 'maxi-blocks' ) }
                                shouldCloseOnEsc = {true}
                                shouldCloseOnClickOutside={false}
                                onRequestClose={ onClick }
                            >
                                <Iframe url="https://ge-library.dev700.com"
                                width="100%"
                                height="90%"
                                id="gx-library-iframe"
                                className="gx-library-iframe"
                                display="initial"
                                position="relative"/>
                            </Modal>
                        )}
                    </LayoutsContext.Consumer>
                    : null }
            </Fragment>
        );
    }
}
export default LayoutModal;

var ddd_full_stop = 0;

var json_counters_array = [];

console.log('layout-modal loaded');


jQuery(document).ready(function($) {
    // main function
    function onIframeLoad() {
        //console.log('onIframeLoad');
        setTimeout(function() {
            console.log('full stop '+ddd_full_stop);
            $('iframe#gx-library-iframe').on('load', function() {
                console.log('iframe loaded');

                var frame = document.getElementById('gx-library-iframe');

                jQuery.ajax({
                    type: 'GET',
                    url: ajaxurl,
                    data: 'action=gx_get_option',
                    success: function(data) {
                        console.log('success data:');
                        console.log(data);
                        var gx_sp_enable = $.trim(data + '');
                        if (gx_sp_enable === 'enabled') { frame.contentWindow.postMessage('pro_membership_activated', '*'); } else { frame.contentWindow.postMessage('pro_membership_dectivated', '*'); }
                    }
                });
                // function to get post id from the url parameter 'post'
                function getUrlVars() {
                    var vars = [],
                        hash;
                    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                    for (var i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split('=');
                        vars.push(hash[0]);
                        vars[hash[0]] = hash[1];
                    }
                    return vars;
                }

                var post_id = getUrlVars()["post"];

                // Create IE + others compatible event handler
                var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                var eventer = window[eventMethod];
                var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


                var global_json_counter = 0;
                var json_counter = 0;
                // Listen to message from child window
                eventer(messageEvent, function(e) {

                    if (e.origin === 'https://ge-library.dev700.com') {
                        var response;
                        if (jQuery.type(e.data) === 'string') { // check if the response is text

                            if (~e.data.indexOf('type') || ~e.data.indexOf('wp_block')) { // if the response is a gutenberg json file
                                response = jQuery.parseJSON(e.data);
                                console.log('response '+response);
                                if (response) {
                                    if (!$(frame).hasClass('settingsIframe') && !$(frame).hasClass('vbIframe') && ddd_full_stop === 0) {
                                        console.log('LOADING LAYOUT');
                                        var layout = JSON.stringify(response);
                                        //console.log('layout');
                                        //console.log(layout);

                                      //  var el = wp.element.createElement;

                                        console.log('response.title ' + response.name);
                                        console.log('response.type ' + response.type);
                                        console.log('response.category ' + response.category);
                                        console.log('response.content ' + response.content);

                                        // var insertedBlock = wp.blocks.createBlock('core/image', {
                                        // content: '<!-- wp:image {\"id\":210927,\"align\":\"center\"} -->\n<div class=\"wp-block-image\"><figure class=\"aligncenter\"><img src=\"https://gutenberg.dev700.com/wp-content/uploads/2018/05/blog3.jpg\" alt=\"\" class=\"wp-image-210927\"/><figcaption>thsi is a test</figcaption></figure></div>\n<!-- /wp:image -->',
                                        // });
                                        // wp.data.dispatch('core/editor').insertBlocks(insertedBlock);

                                        if($('.gx-load-global-styles .components-form-toggle').hasClass('is-checked')) {
                                            console.log('CHECKED!');

                                            response.content = response.content.replace(/gx-dark/g, "gx-global");
                                            response.content = response.content.replace(/gx-light/g, "gx-global");
                                            response.content = response.content.replace(/gx-custom/g, "gx-global");
                                        }

                                        const {
                                            getBlock,
                                            canUserUseUnfilteredHTML
                                        } = wp.data.select( 'core/editor' );

                                        console.log('name '+wp.data.select( 'core/editor' ).getSelectedBlock().name);

                                        const block =  wp.data.select( 'core/editor' ).getSelectedBlock().name;

                                       // console.log('block '+block);

                                       const clientId = wp.data.select( 'core/editor' ).getSelectedBlock().clientId;

                                       console.log('clientId '+clientId);


                                        wp.data.dispatch('core/editor').replaceBlocks(
                                            clientId,
                                            rawHandler( {
                                                HTML: response.content,
                                                mode: 'BLOCKS',
                                                canUserUseUnfilteredHTML,
                                            } ),
                                        ),


                                        ddd_full_stop = 1;

                                    }
                                } //  if (response)
                            } // if (~e.data.indexOf('context'))

                        } //if jQuery.type(e.data) === 'string'
                    } //if (e.origin === 'https://ondemand.divi-den.com') {
                }, false); // eventer(messageEvent, function(e) {
                    ddd_full_stop = 0;

            }); //  $('iframe#gx-library-iframe').on('load', function()

        $('.maxi-cloud-modal .components-button.components-icon-button').on('click', function(){
            console.log('close');
            $('.components-modal__screen-overlay').remove();
        });

        }, 200);
    }
    //function onIframeLoad()

    if (typeof ajaxurl === 'undefined') { ajaxurl = gx_wl_options_for_js.gx_ajax_url; }

    setInterval(function() {
        if ($('iframe#gx-library-iframe').length > 0) {
            //console.log('gx-library-iframe layout modal');
           // console.log($('iframe#gx-library-iframe').parents());
            onIframeLoad();
        }
    }, 1000);

}); //jQuery(document).ready(function($)