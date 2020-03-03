/**
 * External dependencies
 */
import classnames from 'classnames';
import map from 'lodash/map';

/**
 * Internal dependencies
 */
import './styles/editor.scss';
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { withInstanceId } from '@wordpress/compose';
import { dispatch } from '@wordpress/data';
import { Component, Fragment } from '@wordpress/element';
import { ButtonGroup, BaseControl, Button, Tooltip, TabPanel, SelectControl, RadioControl, RangeControl } from '@wordpress/components';

const Divider = () => (
    <hr style={{marginBottom: '15px',}} />
);

// Declaring placeholder variables because attributes are not async when setting them
let cssResponsive = '';
let textDecorationTitleValue;
let textDecorationTitleTabletValue;
let textDecorationTitleMobileValue;
let textDecorationTitleDesktopValue;
let fontSizeTitleValue;
let fontSizeTitleTabletValue;
let fontSizeTitleMobileValue;
let fontSizeTitleDesktopValue;
let fontSizeTitleUnitValue;
let lineHeightTitleDesktopValue;
let lineHeightTitleValue;
let lineHeightTitleTabletValue;
let lineHeightTitleMobileValue;
let lineHeightTitleUnitValue;
let letterSpacingTitleUnitValue;
let letterSpacingTitleValue;
let letterSpacingTitleDesktopValue;
let letterSpacingTitleTabletValue;
let letterSpacingTitleMobileValue;
let fontWeightTitleValue;
let fontWeightTitleTabletValue;
let fontWeightTitleMobileValue;
let fontWeightTitleDesktopValue;
let textTransformTitleValue;
let textTransformTitleDesktopValue;
let textTransformTitleTabletValue;
let textTransformTitleMobileValue;
let fontStyleTitleValue;
let fontStyleTitleDesktopValue;
let fontStyleTitleTabletValue;
let fontStyleTitleMobileValue;

// Subtitle placeholders
let textDecorationSubtitleValue;
let textDecorationSubtitleTabletValue;
let textDecorationSubtitleMobileValue;
let textDecorationSubtitleDesktopValue;
let fontSizeSubtitleValue;
let fontSizeSubtitleTabletValue;
let fontSizeSubtitleMobileValue;
let fontSizeSubtitleDesktopValue;
let fontSizeSubtitleUnitValue;
let lineHeightSubtitleDesktopValue;
let lineHeightSubtitleValue;
let lineHeightSubtitleTabletValue;
let lineHeightSubtitleMobileValue;
let lineHeightSubtitleUnitValue;
let letterSpacingSubtitleUnitValue;
let letterSpacingSubtitleValue;
let letterSpacingSubtitleDesktopValue;
let letterSpacingSubtitleTabletValue;
let letterSpacingSubtitleMobileValue;
let fontWeightSubtitleValue;
let fontWeightSubtitleTabletValue;
let fontWeightSubtitleMobileValue;
let fontWeightSubtitleDesktopValue;
let textTransformSubtitleValue;
let textTransformSubtitleDesktopValue;
let textTransformSubtitleTabletValue;
let textTransformSubtitleMobileValue;
let fontStyleSubtitleValue;
let fontStyleSubtitleDesktopValue;
let fontStyleSubtitleTabletValue;
let fontStyleSubtitleMobileValue;


class Typography extends Component {
  constructor( props ) {
		super( ...arguments );
		this.saveMeta = this.saveMeta.bind( this );
    this.changeFontSize = this.changeFontSize.bind( this );
    this.props.setAttributes({'target' : this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) });
  }

  // Callback function to set attributes because of the scope restrictions
  changeFontSize(value,device){
    this.props.setAttributes({['fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) ]: value });

    fontSizeTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Tablet']: value});
      let varname = 'fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
      eval(varname + "=" + value);
      // fontSizeTitleTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Desktop']: value});
      let varname = 'fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
      eval(varname + "=" + value);
      // fontSizeTitleDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Mobile']: value});
      let varname = 'fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
      eval(varname + "=" + value);
      // fontSizeTitleMobileValue = value;
    }
    this.saveMeta();
  }

  changeLineHeight(value, device){
    this.props.setAttributes({ ['lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)]: value });
    let varname = 'lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Value';
    eval(varname + '=' + value);
    // lineHeightTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Tablet'] : value});
      let varname = 'lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
      eval(varname + '=' + value);
      // lineHeightTitleTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Desktop'] : value});
      let varname = 'lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
      eval(varname + '=' + value);
      // lineHeightTitleDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Mobile'] : value});
      let varname = 'lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
      eval(varname + '=' + value);
      // lineHeightTitleMobileValue = value;
    }
    this.saveMeta();
  }

  changeLetterSpacing(value, device){
    this.props.setAttributes({ ['letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)]: value });
    let varname = 'letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Value';
    eval(varname + '=' + value);
    // letterSpacingTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Tablet'] : value});
      let varname = 'letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
      eval(varname + '=' + value);
      // letterSpacingTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Desktop'] : value});
      let varname = 'letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
      eval(varname + '=' + value);
      // letterSpacingDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Mobile'] : value})
      let varname = 'letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
      eval(varname + '=' + value);
      // letterSpacingMobileValue = value;
    }
    this.saveMeta();
  }

  changeWeight(value, device){
    this.props.setAttributes({ ['fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)]: value });
    let varname = 'fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Value';
    eval(varname + '=' + value);
    // fontWeightTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Tablet'] : value});
      let varname = 'fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
      eval(varname + '=' + value);
      // fontWeightTitleTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Desktop'] : value});
      let varname = 'fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
      eval(varname + '=' + value);
      // fontWeightTitleDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Mobile'] : value})
      let varname = 'fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
      eval(varname + '=' + value);
      // fontWeightTitleMobileValue = value;
    }
    this.saveMeta();
  }

  changeTextTransform(value,device){
    this.props.setAttributes({ ['textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)]: value });
    let varname = 'textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Value';
    eval(varname + '= "' + value + '";');
    // textTransformTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +  'Tablet'] : value});
      let varname = 'textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
      eval(varname + '= "' + value + '";');
      // textTransformTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +  'Desktop'] : value});
      let varname = 'textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
      eval(varname + '= "' + value + '";');
      // textTransformDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +  'Mobile'] : value})
      let varname = 'textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
      eval(varname + '= "' + value + '";');
      // textTransformMobileValue = value;
    }
    this.saveMeta();
  }


  changeFontStyle(value,device){
      this.props.setAttributes({ ['fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)]: value });
      let varname = 'fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Value';
      eval(varname + '="' + value + '";');
      // fontStyleTitleValue = value;
      if(device == 'tablet'){
        this.props.setAttributes({['fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Tablet'] : value});
        let varname = 'fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
        eval(varname + '="' + value + '";');
        // fontStyleTabletValue = value
      }else if(device == 'desktop'){
        this.props.setAttributes({['fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Desktop'] : value});
        let varname = 'fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
        eval(varname + '="' + value + '";');
        // fontStyleDesktopValue = value;
      }else if(device == 'mobile'){
        this.props.setAttributes({['fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Mobile'] : value})
        let varname = 'fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
        eval(varname + '="' + value + '";');
        // fontStyleMobileValue = value;
      }
      this.saveMeta();
  }

  changeTextDecoration(value, device){

    this.props.setAttributes({ ['textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)]: value });
    let varname = 'textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Value';
    eval(varname + '= "' + value + '";');
    // textDecorationTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Tablet'] : value});
      let varname = 'textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue';
      eval(varname + '= "' + value + '";');
      // textDecorationTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Desktop'] : value});
      let varname = 'textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'DesktopValue';
      eval(varname + '= "' + value + '";');
      // textDecorationDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Mobile'] : value})
      let varname = 'textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue';
      eval(varname + '= "' + value + '";');
      // textDecorationMobileValue = value;
    }
    this.saveMeta();
  }

  // General function to create responsive css
  saveMeta() {
    const head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
    const meta = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'meta' );
    const block = wp.data.select( 'core/block-editor' ).getBlock( this.props.clientId );
    let dimensions = {};
    const id = this.props.name.split( '/' ).join( '-' );
    // Truncating head tag
    while (head.firstChild) {
      head.removeChild(head.lastChild);
    }

    // Running checks for unit
    if(typeof lineHeightTitleUnitValue == 'undefined'){
      lineHeightTitleUnitValue = this.props.attributes.lineHeightTitleUnit;
    }

    if(typeof fontSizeTitleUnitValue == 'undefined'){
      fontSizeTitleUnitValue = this.props.attributes.fontSizeTitleUnit;
    }

    if(typeof letterSpacingTitleUnitValue == 'undefined'){
      letterSpacingTitleUnitValue = this.props.attributes.letterSpacingTitleUnit;
    }

    const fontSize = {
      fontSize: ( typeof block.attributes.fontSizeTitleDesktop !== 'undefined' ) ? block.attributes.fontSizeTitleDesktop + block.attributes.fontSizeTitleUnit : null,
      fontSizeTitleTablet: ( typeof block.attributes.fontSizeTitleTablet !== 'undefined' ) ? block.attributes.fontSizeTitleTablet + block.attributes.fontSizeTitleUnit : null,
      fontSizeTitleMobile: ( typeof block.attributes.fontSizeTitleMobile !== 'undefined' ) ? block.attributes.fontSizeTitleMobile + block.attributes.fontSizeTitleUnit : null,
    };

    const lineHeight = {
      lineHeight: ( typeof block.attributes.lineHeightTitleDesktop !== 'undefined' ) ? block.attributes.lineHeightTitleDesktop + block.attributes.lineHeightTitleUnit : null,
      lineHeightTitleTablet: ( typeof block.attributes.lineHeightTitleTablet !== 'undefined' ) ? block.attributes.lineHeightTitleTablet + block.attributes.lineHeightTitleUnit : null,
      lineHeightTitleMobile: ( typeof block.attributes.lineHeightTitleMobile !== 'undefined' ) ? block.attributes.lineHeightTitleMobile + block.attributes.lineHeightTitleUnit : null,
    }

    const letterSpacing = {
      letterSpacing: ( typeof block.attributes.letterSpacingTitleDesktop !== 'undefined' ) ? block.attributes.letterSpacingTitleDesktop + block.attributes.letterSpacingTitleUnit : null,
      letterSpacingTitleTablet: ( typeof block.attributes.letterSpacingTitleTablet !== 'undefined' ) ? block.attributes.letterSpacingTitleTablet + block.attributes.letterSpacingTitleUnit : null,
      letterSpacingTitleMobile: ( typeof block.attributes.letterSpacingTitleMobile !== 'undefined' ) ? block.attributes.letterSpacingTitleMobile + block.attributes.letterSpacingTitleUnit : null,
    }

    const fontWeight = {
      fontWeight: ( typeof block.attributes.fontWeightTitleDesktop !== 'undefined' ) ? block.attributes.fontWeightTitleDesktop : null,
      fontWeightTitleTablet: ( typeof block.attributes.fontWeightTitleTablet !== 'undefined' ) ? block.attributes.fontWeightTitleTablet : null,
      fontWeightMobile: ( typeof block.attributes.fontWeightMobile !== 'undefined' ) ? block.attributes.fontWeightMobile : null,
    }

    const textTransform = {
      textTransform: ( typeof block.attributes.textTransformDesktop !== 'undefined' ) ? block.attributes.textTransformDesktop : null,
      textTransformTablet: ( typeof block.attributes.textTransformTablet !== 'undefined' ) ? block.attributes.textTransformTablet : null,
      textTransformMobile: ( typeof block.attributes.textTransformMobile !== 'undefined' ) ? block.attributes.textTransformMobile : null,
    }

    const fontStyle = {
      fontStyle: ( typeof block.attributes.fontStyleTitleDesktop !== 'undefined' ) ? block.attributes.fontStyleTitleDesktop : null,
      fontStyleTitleTablet: ( typeof block.attributes.fontStyleTitleTablet !== 'undefined' ) ? block.attributes.fontStyleTitleTablet : null,
      fontStyleTitleMobile: ( typeof block.attributes.fontStyleTitleMobile !== 'undefined' ) ? block.attributes.fontStyleTitleMobile : null,
    }

    const textDecoration = {
      textDecoration: ( typeof block.attributes.textDecorationTitleDesktop !== 'undefined' ) ? block.attributes.textDecorationTitleDesktop : null,
      textDecorationTitleTablet: ( typeof block.attributes.textDecorationTitleTablet !== 'undefined' ) ? block.attributes.textDecorationTitleTablet : null,
      textDecorationTitleMobile: ( typeof block.attributes.textDecorationTitleMobile !== 'undefined' ) ? block.attributes.textDecorationTitleMobile : null,
    }

    const style = document.createElement( 'style' );
    let responsiveCss = '';
    style.type = 'text/css';
    //add responsive styling
      responsiveCss += '@media only screen and (max-width: 768px) {';
      responsiveCss += '.gx-image-box-text h2{';
      // if(typeof fontSizeTitleTabletValue !== 'undefined'){
      if(typeof eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') !== 'undefined'){
      // responsiveCss += 'font-size: ' + fontSizeTitleTabletValue + fontSizeTitleUnitValue + ' !important;';
      responsiveCss += 'font-size: ' + eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') + eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'UnitValue') + ' !important;';
      }
      // if(typeof lineHeightTitleTabletValue !== 'undefined'){
      if(typeof eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'line-height: ' + eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') + eval('lineHeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'letter-spacing: ' + eval('letterSpacing'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'TabletValue') + eval('letterSpacing'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('fontWeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'font-weight: ' + eval('fontWeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') + ' !important;';
      }
      if(typeof eval('textTransform'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'text-transform: ' + eval('textTransform'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'TabletValue') + ' !important;';
      }
      if(typeof eval('fontStyle'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'font-style: ' + eval('fontStyle'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'TabletValue') + ' !important;';
      }
      if(typeof eval('textDecoration'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'TabletValue') !== 'undefined'){
        responsiveCss += 'text-decoration: ' + eval('textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'TabletValue') + ' !important;';
      }
      responsiveCss += '}';
      responsiveCss += '}';

      responsiveCss += '@media only screen and (max-width: 514px) {';
      responsiveCss += '.gx-image-box-text h2{';
      if(typeof eval('fontSize'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue') !== 'undefined'){
      responsiveCss += 'font-size: ' + eval('fontSize'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') + eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue') !== 'undefined'){
        responsiveCss += 'line-height: ' + eval('lineHeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') + eval('lineHeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'UnitValue') + ' !important;';
      }
      if(typeof eval('letterSpacing'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue') !== 'undefined'){
        responsiveCss += 'letter-spacing: ' + eval('letterSpacing'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue') + eval('letterSpacing'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('fontWeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') !== 'undefined'){
        responsiveCss += 'font-weight: ' + eval('fontWeight'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') + ' !important;';
      }
      if(typeof eval('textTransform'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') !== 'undefined'){
        responsiveCss += 'text-transform:  ' + eval('textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue') + ' !important;';
      }
      if(typeof eval('fontStyle'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') !== 'undefined'){
        responsiveCss += 'font-style: ' + eval('fontStyle'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') + ' !important;';
      }
      if(typeof eval('textDecoration' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'MobileValue') !== 'undefined'){
        responsiveCss += 'text-decoration: ' + eval('textDecoration'+ this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'MobileValue') + ' !important;';
      }
      responsiveCss += '}';
      responsiveCss += '}';
    cssResponsive = responsiveCss;

    // Setting Attribute
    this.props.setAttributes({customCss: cssResponsive});
    wp.data.dispatch( 'core/editor' ).editPost( {
      responsiveStyles: {
        style: cssResponsive,
      },
    } );
    if ( style.styleSheet ) {
      style.innerHTML = responsiveCss;
    } else {
      style.appendChild( document.createTextNode( responsiveCss ) );
    }
    head.appendChild( style );
  };

	render() {
    const {
			help,
			instanceId,
			label = __( 'Margin', 'gx' ),
			type = 'margin',
			setAttributes,
      titleFontFamily,
      letterSpacingTitleUnit,
      target,
      fontWeightTitle,
      textDecorationTitle,
      textTransformTitle,
		} = this.props;
    const {
      deviceTypography,
      letterSpacingTitle,
      fontSizeTitle,
      fontSizeTitleUnit,
      fontSizeTitleMobile,
      fontSizeTitleTablet,
      fontSizeTitleDesktop,
      lineHeightTitleUnit,
      lineHeightTitleDesktop,
      lineHeightTitleTablet,
      lineHeightTitleMobile,
      lineHeightTitle,
      fontStyleTitle,
      fontStyleTitleDesktop,
      fontStyleTitleTablet,
      fontStyleTitleMobile,
      textDecorationTitleDesktop,
      textDecorationTitleTablet,
      textDecorationTitleMobile,
      // Subtitle attributes
      textTransformSubtitle,
      fontSizeSubtitle,
      lineHeightSubtitle,
      fontStyleSubtitle,
      textDecorationSubtitle,
      letterSpacingSubtitle,
      fontWeightSubtitle,
     } = this.props.attributes;

    // When device is changed
    const onChangeDevice = (value) => {
      this.props.setAttributes({ deviceTypography: value });
      this.saveMeta();
    }

    // When font size unit is changed
    const onChangeFontSizeUnit = (value) => {
      this.props.setAttributes({ ['fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Unit']:value });
      let varname = "fontSize" + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue';
      eval(varname + "= '" + value + "';");
      this.saveMeta();
    }

    // When font size is changed
    const onChangeFontSize = (value) => {
      this.changeFontSize(value, deviceTypography);
    }

    // When line height is changed
    const onChangeLineHeight = (value) => {
      this.changeLineHeight(value, deviceTypography);
    }

    //  When line height unit is changed
    const onChangelineHeightUnit = (value) => {
      this.props.setAttributes({['lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'Unit']:value });
      let varname = "lineHeight" + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue';
      eval(varname + "= '" + value + "';");
      this.saveMeta();
    }

    // When letter spacing is changed
    const onChangeLetterSpacing = (value) => {
      this.changeLetterSpacing(value, deviceTypography);
    }

    // When letter spacing unit is changed
    const onChangeletterSpacingTitleUnit = (value) => {
      this.props.setAttributes({['letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'Unit']:value });
      if(value == 'px'){
        eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "px"');
      }else if(value == 'em'){
        eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "em"');
      }else if(value == 'vw'){
        eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "vw"');
      }else{
        eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "%"');
      }
      // letterSpacingTitleUnitValue = value;
      this.saveMeta();
    }

    // When weight is changed
    const onChangeWeight = (value) => {
      this.changeWeight(value, deviceTypography);
    }

    // When transform is changed
    const onChangeTextTransform = (value) => {
      this.changeTextTransform(value,deviceTypography);
    }

    // When font style is changed
    const onChangeFontStyle = (value) => {
      this.changeFontStyle(value,deviceTypography);
    }

    // When text decoration is changed
    const onChangeTextDecoration = (value) => {
      this.changeTextDecoration(value, deviceTypography);
    }

    return(
    <div>
      <SelectControl
        label={ __( 'Family', 'gutenber-extra' ) }
        className="gx-title-typography-setting"
        value={ titleFontFamily }
        options={ [
          { label: 'Default', value: 'inherit' },
          { label: 'Placeholder', value: 'inherit' },
        ] }
        onChange={ ( value ) => props.setAttributes({ titleFontFamily: value }) }
      />
   <RadioControl
     className={'gx-device-control'}
         selected={deviceTypography }
         options={ [
             { label: '', value: 'desktop' },
             { label: '', value: 'tablet' },
             { label: '', value: 'mobile' },
         ] }
         onChange={ onChangeDevice }
     />
   <RadioControl
     className={'gx-unit-control'}
         selected={eval('this.props.attributes.fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) +'Unit')}
         options={ [
             { label: 'PX', value: 'px' },
             { label: 'EM', value: 'em' },
             { label: 'VW', value: 'vw' },
             { label: '%', value: '%' },
         ] }
         onChange={ onChangeFontSizeUnit}
     />
     <RangeControl
     label={ __( 'Size', 'gutenberg-extra' ) }
     className={'gx-with-unit-control'}
     value={eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1))}
     onChange={ onChangeFontSize }
     id={'size-control'}
     min={ 0 }
     step={0.1}
     allowReset = {true}
               />
   <RadioControl
     className={'gx-unit-control'}
         selected={this.props.attributes.lineHeightTitleUnit }
         options={ [
             { label: 'PX', value: 'px' },
             { label: 'EM', value: 'em' },
             { label: 'VW', value: 'vw' },
             { label: '%', value: '%' },
         ] }
         onChange={ onChangelineHeightUnit }
     />
     <RangeControl
     label={ __( 'Line Height', 'gutenberg-extra' ) }
     className={'gx-with-unit-control'}
     value={eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1))}
     onChange={ onChangeLineHeight }
     min={ 0 }
     step={0.1}
     allowReset = {true}
               />

     <RadioControl
       className={'gx-unit-control'}
           selected={this.props.attributes.letterSpacingTitleUnit }
           options={ [
               { label: 'PX', value: 'px' },
               { label: 'EM', value: 'em' },
               { label: 'VW', value: 'vw' },
               { label: '%', value: '%' },
           ] }
           onChange={ onChangeletterSpacingTitleUnit }
       />
     <RangeControl
     label={ __( 'Letter Spacing', 'gutenberg-extra' ) }
     className={'gx-with-unit-control'}
     value={eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1))}
     onChange={ onChangeLetterSpacing }
     min={ 0 }
     step={0.1}
     allowReset = {true}
               />
     <Divider/>
     <SelectControl
        label={ __( 'Weight', 'gutenberg-extra' ) }
        className="gx-title-typography-setting"
        value={ eval('fontWeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1))}
        options={ [
          { label: __('Thin (Hairline)', 'gutenberg-extra'), value: 100 },
          { label: __('Extra Light (Ultra Light)', 'gutenberg-extra'), value: 200 },
          { label: __('Light', 'gutenberg-extra'), value: 300 },
          { label: __('Normal (Regular)', 'gutenberg-extra'), value: 400 },
          { label: __('Medium', 'gutenberg-extra'), value: 500 },
          { label: __('Semi Bold (Demi Bold)', 'gutenberg-extra'), value: 600 },
          { label: __('Bold', 'gutenberg-extra'), value: 700 },
          { label: __('Extra Bold (Ultra Bold)', 'gutenberg-extra'), value: 800 },
          { label: __('Black (Heavy)', 'gutenberg-extra'), value: 900 },
          { label: __('Extra Black (Ultra Black)', 'gutenberg-extra'), value: 950 },
        ] }
        onChange={ onChangeWeight }
     />
     <SelectControl
        label={__('Transform', 'gutenberg-extra')}
        className="gx-title-typography-setting"
        value={ eval('textTransform' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1))}
        options={ [
          { label: __('Default', 'gutenberg-extra'), value: 'none' },
          { label: __('Capitilize', 'gutenberg-extra'), value: 'capitalize' },
          { label: __('Uppercase', 'gutenberg-extra'), value: 'uppercase' },
          { label: __('Lowercase', 'gutenberg-extra'), value: 'lowercase' },
          { label: __('Full Width', 'gutenberg-extra'), value: 'full-width' },
          { label: __('Full Size Kana', 'gutenberg-extra'), value: 'full-size-kana' },
        ] }
        onChange={ onChangeTextTransform }
     />
     <SelectControl
        label={__('Style', 'gutenberg-extra')}
        className="gx-title-typography-setting"
        value={ eval('fontStyle' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1)) }
        options={ [
          { label: __('Default', 'gutenberg-extra'), value: 'normal' },
          { label: __('Italic', 'gutenberg-extra'), value: 'italic' },
          { label: __('Oblique', 'gutenberg-extra'), value: 'oblique' },
          { label: __('Oblique (40 deg)'), value: 'oblique 40deg' },
        ] }
        onChange={ onChangeFontStyle }
     />
     <SelectControl
        label={__('Decoration', 'gutenberg-extra')}
        className="gx-title-typography-setting"
        value={ textDecorationTitle }
        options={ [
          { label: __('Default', 'gutenberg-extra'), value: 'none' },
          { label: __('Overline', 'gutenberg-extra'), value: 'overline' },
          { label: __('Line Through', 'gutenberg-extra'), value: 'line-through' },
          { label: __('Underline', 'gutenberg-extra'), value: 'underline' },
          { label: __('Underline Overline', 'gutenberg-extra'), value: 'underline overline' },
        ] }
        onChange={ onChangeTextDecoration }
     />
     </div>
    )
  }
}
export default withInstanceId( Typography );
