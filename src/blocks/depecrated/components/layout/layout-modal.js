/**
 * Layout modal window with tab panel.
 */

import LayoutLibrary from './layout-library';
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
    constructor() {
        super( ...arguments );

        this.state = {
            modalOpen: true,
            currentTab: 'maxi-layout-tab-sections',
            loadGlobalStyles: false,
        };
    }

    render() {
        return (
            <Fragment key={ 'layout-modal-fragment-' + this.props.clientId }>
                { /* Launch the layout modal window */ }
                <Button
                    key={ 'layout-modal-library-button-' + this.props.clientId }
                    isPrimary
                    isLarge
                    className="maxi-layout-modal-button"
                    onClick={ () => this.setState( {
                        modalOpen: true
                    } ) }
                >
                    { __( 'Layout Library', 'maxi-blocks' ) }
                </Button>
                { this.state.modalOpen ?
                    <LayoutsContext.Consumer key={ 'layouts-context-provider-' + this.props.clientId }>
                        { ( context ) => (
                            <Modal
                                key={ 'layout-modal-modal-component-' + this.props.clientId }
                                className="maxi-layout-modal"
                                title={ __( 'Maxi Blocks Layouts and Blocks Library', 'maxi-blocks' ) }
                               // shouldCloseOnOverlayClick={false}
                              //  onRequestClose={ () => this.setState( { modalOpen: false } ) }
                            >
                                <ToggleControl
                                    label={ __( 'Load blocks with Global Styles from Theme Customizer' ) }
                                    className={'maxi-load-global-styles'}
                                    checked={ this.state.loadGlobalStyles  }
                                    onChange={ () => this.setState( { loadGlobalStyles: !this.state.loadGlobalStyles } ) }
                                />
                                <Iframe url="https://ge-library.dev700.com"
                                width="100%"
                                height="90%"
                                id="maxi-library-iframe"
                                className="maxi-library-iframe"
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
            $('iframe#maxi-library-iframe').on('load', function() {
                console.log('iframe loaded');
                var frame = document.getElementById('maxi-library-iframe');

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

                                        if($('.maxi-load-global-styles .components-form-toggle').hasClass('is-checked')) {
                                            console.log('CHECKED!');

                                            response.content = response.content.replace(/maxi-dark/g, "maxi-global");
                                            response.content = response.content.replace(/maxi-light/g, "maxi-global");
                                            response.content = response.content.replace(/maxi-custom/g, "maxi-global");
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

            }); //  $('iframe#maxi-library-iframe').on('load', function()

        $('.maxi-layout-modal .components-button.components-icon-button').on('click', function(){
            console.log('close');
            $('.components-modal__screen-overlay').remove();
        });

        }, 200);
    }
    //function onIframeLoad()

    if (typeof ajaxurl === 'undefined') { ajaxurl = gx_wl_options_for_js.gx_ajax_url; }

    setInterval(function() {
        if ($('iframe#maxi-library-iframe').length > 0) {
            //console.log('maxi-library-iframe layout modal');
           // console.log($('iframe#maxi-library-iframe').parents());
            onIframeLoad();
        }
    }, 1000);

}); //jQuery(document).ready(function($)