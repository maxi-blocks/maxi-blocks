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

// Format target prop

const formattedTarget = (target) => {
  let str = target.charAt(0).toUpperCase() + target.slice(1);
  str = str.replace(/-/g, "");
  return str;
}

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

// Description placeholders
let textDecorationDescriptionValue;
let textDecorationDescriptionTabletValue;
let textDecorationDescriptionMobileValue;
let textDecorationDescriptionDesktopValue;
let fontSizeDescriptionValue;
let fontSizeDescriptionTabletValue;
let fontSizeDescriptionMobileValue;
let fontSizeDescriptionDesktopValue;
let fontSizeDescriptionUnitValue;
let lineHeightDescriptionDesktopValue;
let lineHeightDescriptionValue;
let lineHeightDescriptionTabletValue;
let lineHeightDescriptionMobileValue;
let lineHeightDescriptionUnitValue;
let letterSpacingDescriptionUnitValue;
let letterSpacingDescriptionValue;
let letterSpacingDescriptionDesktopValue;
let letterSpacingDescriptionTabletValue;
let letterSpacingDescriptionMobileValue;
let fontWeightDescriptionValue;
let fontWeightDescriptionTabletValue;
let fontWeightDescriptionMobileValue;
let fontWeightDescriptionDesktopValue;
let textTransformDescriptionValue;
let textTransformDescriptionDesktopValue;
let textTransformDescriptionTabletValue;
let textTransformDescriptionMobileValue;
let fontStyleDescriptionValue;
let fontStyleDescriptionDesktopValue;
let fontStyleDescriptionTabletValue;
let fontStyleDescriptionMobileValue;

// Read more placeholder
let textDecorationReadmoretextValue;
let textDecorationReadmoretextTabletValue;
let textDecorationReadmoretextMobileValue;
let textDecorationReadmoretextDesktopValue;
let fontSizeReadmoretextValue;
let fontSizeReadmoretextTabletValue;
let fontSizeReadmoretextMobileValue;
let fontSizeReadmoretextDesktopValue;
let fontSizeReadmoretextUnitValue;
let lineHeightReadmoretextDesktopValue;
let lineHeightReadmoretextValue;
let lineHeightReadmoretextTabletValue;
let lineHeightReadmoretextMobileValue;
let lineHeightReadmoretextUnitValue;
let letterSpacingReadmoretextUnitValue;
let letterSpacingReadmoretextValue;
let letterSpacingReadmoretextDesktopValue;
let letterSpacingReadmoretextTabletValue;
let letterSpacingReadmoretextMobileValue;
let fontWeightReadmoretextValue;
let fontWeightReadmoretextTabletValue;
let fontWeightReadmoretextMobileValue;
let fontWeightReadmoretextDesktopValue;
let textTransformReadmoretextValue;
let textTransformReadmoretextDesktopValue;
let textTransformReadmoretextTabletValue;
let textTransformReadmoretextMobileValue;
let fontStyleReadmoretextValue;
let fontStyleReadmoretextDesktopValue;
let fontStyleReadmoretextTabletValue;
let fontStyleReadmoretextMobileValue;

export const typographyAttributes = {
  fontSizeTitleUnit: {
    type: 'string',
    default: 'px',
  },
  fontStyle: {
    type: 'string',
  },
  fontStyleTitleMobile:{
    type: 'string',
  },
  fontStyleTitle:{
    type: 'string',
  },
  fontStyleTitleTablet:{
    type: 'string',
  },
  fontStyleTitleDesktop:{
    type: 'string',
  },
  textDecorationTitle:{
    type: 'string',
  },
  textDecorationTitleMobile:{
    type: 'string',
  },
  textDecorationTitleTablet:{
    type: 'string',
  },
  textDecorationTitleDesktop:{
    type: 'string',
  },
  textDecoration:{
    type: 'string',
  },
  customTitleCss:{
    type: 'string'
  },
  // Subtitle attributes
  customSubtitleCss:{
    type: 'string'
  },
  textTransform:{
    type: 'string',
  },
  textTransformSubtitle:{
    type: 'string',
  },
  textTransformSubtitleTablet:{
    type: 'string',
  },
  textTransformSubtitleDesktop:{
    type: 'string',
  },
  textTransformSubtitleMobile:{
    type: 'string',
  },
  fontSizeSubtitle: {
    type: 'number',
  },
  fontSizeSubtitleDesktop: {
    type: 'number',
  },
  fontSizeSubtitleTablet: {
    type: 'number',
  },
  fontSizeSubtitleMobile: {
    type: 'number',
  },
  fontSizeSubtitleUnit: {
    type: 'string',
    default: 'px',
  },
  lineHeightSubtitle:{
    type: 'number',
  },
  lineHeightSubtitleUnit:{
    type: 'string',
    default: 'px'
  },
  letterSpacingSubtitleUnit:{
    type: 'string',
    default: '%',
  },
  letterSpacingSubtitleDesktop:{
    type: 'number',
  },
  letterSpacingSubtitleTablet:{
    type: 'number',
  },
  letterSpacingSubtitleMobile:{
    type: 'number',
  },
  letterSpacingSubtitle:{
    type: 'number',
  },
  letterSpacingSubtitleUnit:{
    type: 'string',
    default: 'px'
  },
  fontStyleSubtitleMobile:{
    type: 'string',
  },
  fontStyleSubtitle:{
    type: 'string',
  },
  fontStyleSubtitleTablet:{
    type: 'string',
  },
  fontStyleSubtitleDesktop:{
    type: 'string',
  },
  textDecorationSubtitle:{
    type: 'string',
  },
  textDecorationSubtitleMobile:{
    type: 'string',
  },
  textDecorationSubtitleTablet:{
    type: 'string',
  },
  textDecorationSubtitleDesktop:{
    type: 'string',
  },
  // Description Attributes
  customDescriptionCss:{
    type: 'string'
  },
  textTransform:{
    type: 'string',
  },
  textTransformDescription:{
    type: 'string',
  },
  textTransformDescriptionTablet:{
    type: 'string',
  },
  textTransformDescriptionDesktop:{
    type: 'string',
  },
  textTransformDescriptionMobile:{
    type: 'string',
  },
  fontSizeDescription: {
    type: 'number',
  },
  fontSizeDescriptionDesktop: {
    type: 'number',
  },
  fontSizeDescriptionTablet: {
    type: 'number',
  },
  fontSizeDescriptionMobile: {
    type: 'number',
  },
  fontSizeDescriptionUnit: {
    type: 'string',
    default: 'px',
  },
  lineHeightDescription:{
    type: 'number',
  },
  lineHeightDescriptionUnit:{
    type: 'string',
    default: 'px'
  },
  letterSpacingDescriptionUnit:{
    type: 'string',
    default: '%',
  },
  letterSpacingDescriptionDesktop:{
    type: 'number',
  },
  letterSpacingDescriptionTablet:{
    type: 'number',
  },
  letterSpacingDescriptionMobile:{
    type: 'number',
  },
  letterSpacingDescription:{
    type: 'number',
  },
  letterSpacingDescriptionUnit:{
    type: 'string',
    default: 'px'
  },
  fontStyleDescriptionMobile:{
    type: 'string',
  },
  fontStyleDescription:{
    type: 'string',
  },
  fontStyleDescriptionTablet:{
    type: 'string',
  },
  fontStyleDescriptionDesktop:{
    type: 'string',
  },
  textDecorationDescription:{
    type: 'string',
  },
  textDecorationDescriptionMobile:{
    type: 'string',
  },
  textDecorationDescriptionTablet:{
    type: 'string',
  },
  textDecorationDescriptionDesktop:{
    type: 'string',
  },
  // Read more attributes
  customReadmoretextCss:{
    type: 'string'
  },
  textTransform:{
    type: 'string',
  },
  textTransformReadmoretext:{
    type: 'string',
  },
  textTransformReadmoretextTablet:{
    type: 'string',
  },
  textTransformReadmoretextDesktop:{
    type: 'string',
  },
  textTransformReadmoretextMobile:{
    type: 'string',
  },
  fontSizeReadmoretext: {
    type: 'number',
  },
  fontSizeReadmoretextDesktop: {
    type: 'number',
  },
  fontSizeReadmoretextTablet: {
    type: 'number',
  },
  fontSizeReadmoretextMobile: {
    type: 'number',
  },
  fontSizeReadmoretextUnit: {
    type: 'string',
    default: 'px',
  },
  lineHeightReadmoretext:{
    type: 'number',
  },
  lineHeightReadmoretextUnit:{
    type: 'string',
    default: 'px'
  },
  letterSpacingReadmoretextUnit:{
    type: 'string',
    default: '%',
  },
  letterSpacingReadmoretextDesktop:{
    type: 'number',
  },
  letterSpacingReadmoretextTablet:{
    type: 'number',
  },
  letterSpacingReadmoretextMobile:{
    type: 'number',
  },
  letterSpacingReadmoretext:{
    type: 'number',
  },
  letterSpacingReadmoretextUnit:{
    type: 'string',
    default: 'px'
  },
  fontStyleReadmoretextMobile:{
    type: 'string',
  },
  fontStyleReadmoretext:{
    type: 'string',
  },
  fontStyleReadmoretextTablet:{
    type: 'string',
  },
  fontStyleReadmoretextDesktop:{
    type: 'string',
  },
  textDecorationReadmoretext:{
    type: 'string',
  },
  textDecorationReadmoretextMobile:{
    type: 'string',
  },
  textDecorationReadmoretextTablet:{
    type: 'string',
  },
  textDecorationReadmoretextDesktop:{
    type: 'string',
  },
  // Title
  titleFontFamily: {
    type: 'string',
    default: 'inherit'
  },
  fontSizeTitleUnit: {
    type: 'string',
    default: 'px',
  },
  fontWeightTitle:{
    type: 'string',
  },
  fontWeight:{
    type: 'string',
  },
  fontWeightTitleDesktop:{
    type: 'string',
  },
  fontWeightTitleTablet:{
    type: 'string',
  },
  fontWeightTitleMobile:{
    type: 'string',
  },
  textTransform:{
    type: 'string',
  },
  textTransformTitle:{
    type: 'string',
  },
  textTransformTitleTablet:{
    type: 'string',
  },
  textTransformTitleDesktop:{
    type: 'string',
  },
  textTransformTitleMobile:{
    type: 'string',
  },
  fontSizeTitleUnit: {
    type: 'string',
    default: 'px',
  },
  letterSpacingTitleUnit:{
    type: 'string',
    default: '%',
  },
  letterSpacingTitleDesktop:{
    type: 'number',
  },
  letterSpacingTitleTablet:{
    type: 'number',
  },
  letterSpacingTitleMobile:{
    type: 'number',
  },
  letterSpacingTitle:{
    type: 'number',
  },
  fontSizeTitle: {
    type: 'number',
  },
  fontSizeTitleDesktop: {
    type: 'number',
  },
  fontSizeTitleTablet: {
    type: 'number',
  },
  fontSizeTitleMobile: {
    type: 'number',
  },
  letterSpacingTitleUnit:{
    type: 'string',
    default: 'px'
  },
  fontSizeTitle: {
    type: 'number',
  },
  deviceTypography: {
    type: 'string',
    default: 'desktop',
  },
}

class Typography extends Component {
  constructor( props ) {
		super( ...arguments );
		this.saveMeta = this.saveMeta.bind( this );
    this.changeFontSize = this.changeFontSize.bind( this );
    this.props.setAttributes({'target' : formattedTarget(this.props.target) });
  }

  // Callback function to set attributes because of the scope restrictions
  changeFontSize(value,device){
    this.props.setAttributes({['fontSize' + formattedTarget(this.props.target) ]: value });

    fontSizeTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['fontSize' + formattedTarget(this.props.target) + 'Tablet']: value});
      let varname = 'fontSize' + formattedTarget(this.props.target) + 'TabletValue';
      eval(varname + "=" + value);
      // fontSizeTitleTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['fontSize' + formattedTarget(this.props.target) + 'Desktop']: value});
      let varname = 'fontSize' + formattedTarget(this.props.target) + 'DesktopValue';
      eval(varname + "=" + value);
      // fontSizeTitleDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['fontSize' + formattedTarget(this.props.target) + 'Mobile']: value});
      let varname = 'fontSize' + formattedTarget(this.props.target) + 'MobileValue';
      eval(varname + "=" + value);
      // fontSizeTitleMobileValue = value;
    }
    this.saveMeta();
  }

  changeLineHeight(value, device){
    this.props.setAttributes({ ['lineHeight' + formattedTarget(this.props.target)]: value });
    let varname = 'lineHeight' + formattedTarget(this.props.target) + 'Value';
    eval(varname + '=' + value);
    // lineHeightTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['lineHeight' + formattedTarget(this.props.target) + 'Tablet'] : value});
      let varname = 'lineHeight' + formattedTarget(this.props.target) + 'TabletValue';
      eval(varname + '=' + value);
      // lineHeightTitleTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['lineHeight' + formattedTarget(this.props.target) + 'Desktop'] : value});
      let varname = 'lineHeight' + formattedTarget(this.props.target) + 'DesktopValue';
      eval(varname + '=' + value);
      // lineHeightTitleDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['lineHeight' + formattedTarget(this.props.target) + 'Mobile'] : value});
      let varname = 'lineHeight' + formattedTarget(this.props.target) + 'MobileValue';
      eval(varname + '=' + value);
      // lineHeightTitleMobileValue = value;
    }
    this.saveMeta();
  }

  changeLetterSpacing(value, device){
    this.props.setAttributes({ ['letterSpacing' + formattedTarget(this.props.target)]: value });
    let varname = 'letterSpacing' + formattedTarget(this.props.target) + 'Value';
    eval(varname + '=' + value);
    // letterSpacingTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['letterSpacing' + formattedTarget(this.props.target) + 'Tablet'] : value});
      let varname = 'letterSpacing' + formattedTarget(this.props.target) + 'TabletValue';
      eval(varname + '=' + value);
      // letterSpacingTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['letterSpacing' + formattedTarget(this.props.target) + 'Desktop'] : value});
      let varname = 'letterSpacing' + formattedTarget(this.props.target) + 'DesktopValue';
      eval(varname + '=' + value);
      // letterSpacingDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['letterSpacing' + formattedTarget(this.props.target) + 'Mobile'] : value})
      let varname = 'letterSpacing' + formattedTarget(this.props.target) + 'MobileValue';
      eval(varname + '=' + value);
      // letterSpacingMobileValue = value;
    }
    this.saveMeta();
  }

  changeWeight(value, device){
    this.props.setAttributes({ ['fontWeight' + formattedTarget(this.props.target)]: value });
    let varname = 'fontWeight' + formattedTarget(this.props.target) + 'Value';
    eval(varname + '=' + value);
    // fontWeightTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['fontWeight' + formattedTarget(this.props.target) + 'Tablet'] : value});
      let varname = 'fontWeight' + formattedTarget(this.props.target) + 'TabletValue';
      eval(varname + '=' + value);
      // fontWeightTitleTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['fontWeight' + formattedTarget(this.props.target) + 'Desktop'] : value});
      let varname = 'fontWeight' + formattedTarget(this.props.target) + 'DesktopValue';
      eval(varname + '=' + value);
      // fontWeightTitleDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['fontWeight' + formattedTarget(this.props.target) + 'Mobile'] : value})
      let varname = 'fontWeight' + formattedTarget(this.props.target) + 'MobileValue';
      eval(varname + '=' + value);
      // fontWeightTitleMobileValue = value;
    }
    this.saveMeta();
  }

  changeTextTransform(value,device){
    this.props.setAttributes({ ['textTransform' + formattedTarget(this.props.target)]: value });
    let varname = 'textTransform' + formattedTarget(this.props.target) + 'Value';
    eval(varname + '= "' + value + '";');
    // textTransformTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['textTransform' + formattedTarget(this.props.target) +  'Tablet'] : value});
      let varname = 'textTransform' + formattedTarget(this.props.target) + 'TabletValue';
      eval(varname + '= "' + value + '";');
      // textTransformTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['textTransform' + formattedTarget(this.props.target) +  'Desktop'] : value});
      let varname = 'textTransform' + formattedTarget(this.props.target) + 'DesktopValue';
      eval(varname + '= "' + value + '";');
      // textTransformDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['textTransform' + formattedTarget(this.props.target) +  'Mobile'] : value})
      let varname = 'textTransform' + formattedTarget(this.props.target) + 'MobileValue';
      eval(varname + '= "' + value + '";');
      // textTransformMobileValue = value;
    }
    this.saveMeta();
  }


  changeFontStyle(value,device){
      this.props.setAttributes({ ['fontStyle' + formattedTarget(this.props.target)]: value });
      let varname = 'fontStyle' + formattedTarget(this.props.target) + 'Value';
      eval(varname + '="' + value + '";');
      // fontStyleTitleValue = value;
      if(device == 'tablet'){
        this.props.setAttributes({['fontStyle' + formattedTarget(this.props.target) + 'Tablet'] : value});
        let varname = 'fontStyle' + formattedTarget(this.props.target) + 'TabletValue';
        eval(varname + '="' + value + '";');
        // fontStyleTabletValue = value
      }else if(device == 'desktop'){
        this.props.setAttributes({['fontStyle' + formattedTarget(this.props.target) + 'Desktop'] : value});
        let varname = 'fontStyle' + formattedTarget(this.props.target) + 'DesktopValue';
        eval(varname + '="' + value + '";');
        // fontStyleDesktopValue = value;
      }else if(device == 'mobile'){
        this.props.setAttributes({['fontStyle' + formattedTarget(this.props.target) + 'Mobile'] : value})
        let varname = 'fontStyle' + formattedTarget(this.props.target) + 'MobileValue';
        eval(varname + '="' + value + '";');
        // fontStyleMobileValue = value;
      }
      this.saveMeta();
  }

  changeTextDecoration(value, device){

    this.props.setAttributes({ ['textDecoration' + formattedTarget(this.props.target)]: value });
    let varname = 'textDecoration' + formattedTarget(this.props.target) + 'Value';
    eval(varname + '= "' + value + '";');
    // textDecorationTitleValue = value;
    if(device == 'tablet'){
      this.props.setAttributes({['textDecoration' + formattedTarget(this.props.target) + 'Tablet'] : value});
      let varname = 'textDecoration' + formattedTarget(this.props.target) + 'TabletValue';
      eval(varname + '= "' + value + '";');
      // textDecorationTabletValue = value;
    }else if(device == 'desktop'){
      this.props.setAttributes({['textDecoration' + formattedTarget(this.props.target) + 'Desktop'] : value});
      let varname = 'textDecoration' + formattedTarget(this.props.target) + 'DesktopValue';
      eval(varname + '= "' + value + '";');
      // textDecorationDesktopValue = value;
    }else if(device == 'mobile'){
      this.props.setAttributes({['textDecoration' + formattedTarget(this.props.target) + 'Mobile'] : value})
      let varname = 'textDecoration' + formattedTarget(this.props.target) + 'MobileValue';
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

    // Running checks for title units
    if(typeof lineHeightTitleUnitValue == 'undefined'){
      lineHeightTitleUnitValue = this.props.attributes.lineHeightTitleUnit;
    }

    if(typeof fontSizeTitleUnitValue == 'undefined'){
      fontSizeTitleUnitValue = this.props.attributes.fontSizeTitleUnit;
    }

    if(typeof letterSpacingTitleUnitValue == 'undefined'){
      letterSpacingTitleUnitValue = this.props.attributes.letterSpacingTitleUnit;
    }

    // Running checks for subtitle units
    if(typeof lineHeightSubtitleUnitValue == 'undefined'){
      lineHeightSubtitleUnitValue = this.props.attributes.lineHeightSubtitleUnit;
    }

    if(typeof fontSizeSubtitleUnitValue == 'undefined'){
      fontSizeSubtitleUnitValue = this.props.attributes.fontSizeSubtitleUnit;
    }

    if(typeof letterSpacingSubtitleUnitValue == 'undefined'){
      letterSpacingSubtitleUnitValue = this.props.attributes.letterSpacingSubtitleUnit;
    }

    // Running checks for description
    if(typeof lineHeightDescriptionUnitValue == 'undefined'){
      lineHeightDescriptionUnitValue = this.props.attributes.lineHeightDescriptionUnit;
    }

    if(typeof fontSizeDescriptionUnitValue == 'undefined'){
      fontSizeDescriptionUnitValue = this.props.attributes.fontSizeDescriptionUnit;
    }

    if(typeof letterSpacingDescriptionUnitValue == 'undefined'){
      letterSpacingDescriptionUnitValue = this.props.attributes.letterSpacingDescriptionUnit;
    }

    // Running checks for read more
    if(typeof lineHeightReadmoretextUnitValue == 'undefined'){
      lineHeightReadmoretextUnitValue = this.props.attributes.lineHeightReadmoretextUnit;
    }

    if(typeof fontSizeReadmoretextUnitValue == 'undefined'){
      fontSizeReadmoretextUnitValue = this.props.attributes.fontSizeReadmoretextUnit;
    }

    if(typeof letterSpacingReadmoretextUnitValue == 'undefined'){
      letterSpacingReadmoretextUnitValue = this.props.attributes.letterSpacingReadmoretextUnit;
    }

    if(document.getElementById(this.props.target + '-responsive-styles') !== null){
      document.getElementById(this.props.target + '-responsive-styles').remove();
    }

    var style = document.createElement( 'style' );
    style.setAttribute('id', this.props.target + '-responsive-styles');
    style.type = 'text/css';

    let responsiveCss = '';
    //add responsive styling
      responsiveCss += '@media only screen and (max-width: 768px) {';
      responsiveCss += '.gx-image-box-'+this.props.target+'{';
      // if(typeof fontSizeTitleTabletValue !== 'undefined'){
      if(typeof eval('fontSize' + formattedTarget(this.props.target) + 'TabletValue') !== 'undefined'){
      // responsiveCss += 'font-size: ' + fontSizeTitleTabletValue + fontSizeTitleUnitValue + ' !important;';
      responsiveCss += 'font-size: ' + eval('fontSize' + formattedTarget(this.props.target) + 'TabletValue') + eval('fontSize' + formattedTarget(this.props.target) + 'UnitValue') + ' !important;';
      }
      // if(typeof lineHeightTitleTabletValue !== 'undefined'){
      if(typeof eval('lineHeight' + formattedTarget(this.props.target) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'line-height: ' + eval('lineHeight' + formattedTarget(this.props.target) + 'TabletValue') + eval('lineHeight'+ formattedTarget(this.props.target) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('letterSpacing' + formattedTarget(this.props.target) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'letter-spacing: ' + eval('letterSpacing'+ formattedTarget(this.props.target) +'TabletValue') + eval('letterSpacing'+ formattedTarget(this.props.target) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('fontWeight'+ formattedTarget(this.props.target) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'font-weight: ' + eval('fontWeight'+ formattedTarget(this.props.target) + 'TabletValue') + ' !important;';
      }
      if(typeof eval('textTransform'+ formattedTarget(this.props.target) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'text-transform: ' + eval('textTransform'+ formattedTarget(this.props.target) +'TabletValue') + ' !important;';
      }
      if(typeof eval('fontStyle'+ formattedTarget(this.props.target) + 'TabletValue') !== 'undefined'){
        responsiveCss += 'font-style: ' + eval('fontStyle'+ formattedTarget(this.props.target) +'TabletValue') + ' !important;';
      }
      if(typeof eval('textDecoration'+ formattedTarget(this.props.target) +'TabletValue') !== 'undefined'){
        responsiveCss += 'text-decoration: ' + eval('textDecoration' + formattedTarget(this.props.target) + 'TabletValue') + ' !important;';
      }
      responsiveCss += '}';
      responsiveCss += '}';

      responsiveCss += '@media only screen and (max-width: 514px) {';
      responsiveCss += '.gx-image-box-'+ this.props.target +'{';
      if(typeof eval('fontSize'+ formattedTarget(this.props.target) + 'MobileValue') !== 'undefined'){
      responsiveCss += 'font-size: ' + eval('fontSize'+ formattedTarget(this.props.target) +'MobileValue') + eval('fontSize' + formattedTarget(this.props.target) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('lineHeight' + formattedTarget(this.props.target) + 'MobileValue') !== 'undefined'){
        responsiveCss += 'line-height: ' + eval('lineHeight'+ formattedTarget(this.props.target) +'MobileValue') + eval('lineHeight'+ formattedTarget(this.props.target) +'UnitValue') + ' !important;';
      }
      if(typeof eval('letterSpacing'+ formattedTarget(this.props.target) + 'MobileValue') !== 'undefined'){
        responsiveCss += 'letter-spacing: ' + eval('letterSpacing'+ formattedTarget(this.props.target) + 'MobileValue') + eval('letterSpacing'+ formattedTarget(this.props.target) + 'UnitValue') + ' !important;';
      }
      if(typeof eval('fontWeight'+ formattedTarget(this.props.target) +'MobileValue') !== 'undefined'){
        responsiveCss += 'font-weight: ' + eval('fontWeight'+ formattedTarget(this.props.target) +'MobileValue') + ' !important;';
      }
      if(typeof eval('textTransform'+ formattedTarget(this.props.target) +'MobileValue') !== 'undefined'){
        responsiveCss += 'text-transform:  ' + eval('textTransform' + formattedTarget(this.props.target) + 'MobileValue') + ' !important;';
      }
      if(typeof eval('fontStyle'+ formattedTarget(this.props.target) +'MobileValue') !== 'undefined'){
        responsiveCss += 'font-style: ' + eval('fontStyle'+ formattedTarget(this.props.target) +'MobileValue') + ' !important;';
      }
      if(typeof eval('textDecoration' + formattedTarget(this.props.target) + 'MobileValue') !== 'undefined'){
        responsiveCss += 'text-decoration: ' + eval('textDecoration'+ formattedTarget(this.props.target) +'MobileValue') + ' !important;';
      }
      responsiveCss += '}';
      responsiveCss += '}';
    cssResponsive = responsiveCss;

    // Setting Attribute
    this.props.setAttributes({['custom' + formattedTarget(this.props.target) + 'Css']: cssResponsive});
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
      fontSizeSubtitleUnit,
      fontSizeSubtitleMobile,
      fontSizeSubtitleTablet,
      fontSizeSubtitleDesktop,
      lineHeightSubtitle,
      fontStyleSubtitle,
      fontStyleSubtitleDesktop,
      fontStyleSubtitleTablet,
      fontStyleSubtitleMobile,
      textDecorationSubtitle,
      letterSpacingSubtitle,
      fontWeightSubtitle,
      // Description attributes
      textTransformDescription,
      fontSizeDescription,
      fontSizeDescriptionUnit,
      fontSizeDescriptionMobile,
      fontSizeDescriptionTablet,
      fontSizeDescriptionDesktop,
      lineHeightDescription,
      fontStyleDescription,
      fontStyleDescriptionDesktop,
      fontStyleDescriptionTablet,
      fontStyleDescriptionMobile,
      textDecorationDescription,
      letterSpacingDescription,
      fontWeightDescription,
      // Read more attributes
      textTransformReadmoretext,
      fontSizeReadmoretext,
      fontSizeReadmoretextUnit,
      fontSizeReadmoretextMobile,
      fontSizeReadmoretextTablet,
      fontSizeReadmoretextDesktop,
      lineHeightReadmoretext,
      fontStyleReadmoretext,
      fontStyleReadmoretextDesktop,
      fontStyleReadmoretextTablet,
      fontStyleReadmoretextMobile,
      textDecorationReadmoretext,
      letterSpacingReadmoretext,
      fontWeightReadmoretext,
     } = this.props.attributes;

    // When device is changed
    const onChangeDevice = (value) => {
      this.props.setAttributes({ deviceTypography: value });
      this.saveMeta();
    }

    // When font size unit is changed
    const onChangeFontSizeUnit = (value) => {
      this.props.setAttributes({ ['fontSize' + formattedTarget(this.props.target) + 'Unit']:value });
      let varname = "fontSize" + formattedTarget(this.props.target).toString() + 'UnitValue';
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
      this.props.setAttributes({['lineHeight' + formattedTarget(this.props.target).toString() + 'Unit']:value });
      let varname = "lineHeight" + formattedTarget(this.props.target).toString() + 'UnitValue';
      eval(varname + "= '" + value + "';");
      this.saveMeta();
    }

    // When letter spacing is changed
    const onChangeLetterSpacing = (value) => {
      this.changeLetterSpacing(value, deviceTypography);
    }

    // When letter spacing unit is changed
    const onChangeletterSpacingTitleUnit = (value) => {
      this.props.setAttributes({['letterSpacing' + formattedTarget(this.props.target).toString() + 'Unit']:value });
      let varname = "letterSpacing" + formattedTarget(this.props.target).toString() + 'UnitValue';
      eval(varname + "= '" + value + "';");
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
         selected={eval('this.props.attributes.fontSize' + formattedTarget(this.props.target) +'Unit')}
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
     value={eval('fontSize' + formattedTarget(this.props.target))}
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
     value={eval('lineHeight' + formattedTarget(this.props.target))}
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
     value={eval('letterSpacing' + formattedTarget(this.props.target))}
     onChange={ onChangeLetterSpacing }
     min={ 0 }
     step={0.1}
     allowReset = {true}
               />
     <Divider/>
     <SelectControl
        label={ __( 'Weight', 'gutenberg-extra' ) }
        className="gx-title-typography-setting"
        value={ eval('fontWeight' + formattedTarget(this.props.target))}
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
        value={ eval('textTransform' + formattedTarget(this.props.target))}
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
        value={ eval('fontStyle' + formattedTarget(this.props.target)) }
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
        value={ eval('textDecoration' + formattedTarget(this.props.target))}
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
