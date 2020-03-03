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
let textDecorationTabletValue;
let textDecorationMobileValue;
let textDecorationDesktopValue;
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
let fontWeightTabletValue;
let fontWeightMobileValue;
let fontWeightDesktopValue;
let textTransformTitleValue;
let textTransformDesktopValue;
let textTransformTabletValue;
let textTransformMobileValue;
let fontStyleTitleValue;
let fontStyleDesktopValue;
let fontStyleTabletValue;
let fontStyleMobileValue;


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
    if(this.props.target == 'title'){
      this.props.setAttributes({ fontWeightTitle: value });
      fontWeightTitleValue = value;
      if(device == 'tablet'){
        this.props.setAttributes({fontWeightTablet : value});
        fontWeightTabletValue = value;
      }else if(device == 'desktop'){
        this.props.setAttributes({fontWeightDesktop : value});
        fontWeightDesktopValue = value;
      }else if(device == 'mobile'){
        this.props.setAttributes({fontWeightMobile : value})
        fontWeightMobileValue = value;
      }
      this.saveMeta();
    }
  }

  changeTextTransform(value,device){
    if(this.props.target == 'title'){
      this.props.setAttributes({ textTransformTitle: value });
      textTransformTitleValue = value;
      if(device == 'tablet'){
        this.props.setAttributes({textTransformTablet : value});
        textTransformTabletValue = value;
      }else if(device == 'desktop'){
        this.props.setAttributes({textTransformDesktop : value});
        textTransformDesktopValue = value;
      }else if(device == 'mobile'){
        this.props.setAttributes({textTransformMobile : value})
        textTransformMobileValue = value;
      }
      this.saveMeta();
    }
  }


  changeFontStyle(value,device){
    if(this.props.target == 'title'){
      this.props.setAttributes({ fontStyle: value });
      fontStyleTitleValue = value;
      if(device == 'tablet'){
        this.props.setAttributes({fontStyleTablet : value});
        fontStyleTabletValue = value;
      }else if(device == 'desktop'){
        this.props.setAttributes({fontStyleDesktop : value});
        fontStyleDesktopValue = value;
      }else if(device == 'mobile'){
        this.props.setAttributes({fontStyleMobile : value})
        fontStyleMobileValue = value;
      }
      this.saveMeta();
    }
  }

  changeTextDecoration(value, device){
    if(this.props.target == 'title'){
      this.props.setAttributes({ textDecorationTitle: value });
      textDecorationTitleValue = value;
      if(device == 'tablet'){
        this.props.setAttributes({textDecorationTablet : value});
        textDecorationTabletValue = value;
      }else if(device == 'desktop'){
        this.props.setAttributes({textDecorationDesktop : value});
        textDecorationDesktopValue = value;
      }else if(device == 'mobile'){
        this.props.setAttributes({textDecorationMobile : value})
        textDecorationMobileValue = value;
      }
      this.saveMeta();
    }
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
      letterSpacing: ( typeof block.attributes.letterSpacingDesktop !== 'undefined' ) ? block.attributes.letterSpacingDesktop + block.attributes.letterSpacingTitleUnit : null,
      letterSpacingTablet: ( typeof block.attributes.letterSpacingTablet !== 'undefined' ) ? block.attributes.letterSpacingTablet + block.attributes.letterSpacingTitleUnit : null,
      letterSpacingMobile: ( typeof block.attributes.letterSpacingMobile !== 'undefined' ) ? block.attributes.letterSpacingMobile + block.attributes.letterSpacingTitleUnit : null,
    }

    const fontWeight = {
      fontWeight: ( typeof block.attributes.fontWeightDesktop !== 'undefined' ) ? block.attributes.fontWeightDesktop : null,
      fontWeightTablet: ( typeof block.attributes.fontWeightTablet !== 'undefined' ) ? block.attributes.fontWeightTablet : null,
      fontWeightMobile: ( typeof block.attributes.fontWeightMobile !== 'undefined' ) ? block.attributes.fontWeightMobile : null,
    }

    const textTransform = {
      textTransform: ( typeof block.attributes.textTransformDesktop !== 'undefined' ) ? block.attributes.textTransformDesktop : null,
      textTransformTablet: ( typeof block.attributes.textTransformTablet !== 'undefined' ) ? block.attributes.textTransformTablet : null,
      textTransformMobile: ( typeof block.attributes.textTransformMobile !== 'undefined' ) ? block.attributes.textTransformMobile : null,
    }

    const fontStyle = {
      fontStyle: ( typeof block.attributes.fontStyleDesktop !== 'undefined' ) ? block.attributes.fontStyleDesktop : null,
      fontStyleTablet: ( typeof block.attributes.fontStyleTablet !== 'undefined' ) ? block.attributes.fontStyleTablet : null,
      fontStyleMobile: ( typeof block.attributes.fontStyleMobile !== 'undefined' ) ? block.attributes.fontStyleMobile : null,
    }

    const textDecoration = {
      textDecoration: ( typeof block.attributes.textDecorationDesktop !== 'undefined' ) ? block.attributes.textDecorationDesktop : null,
      textDecorationTablet: ( typeof block.attributes.textDecorationTablet !== 'undefined' ) ? block.attributes.textDecorationTablet : null,
      textDecorationMobile: ( typeof block.attributes.textDecorationMobile !== 'undefined' ) ? block.attributes.textDecorationMobile : null,
    }

    const style = document.createElement( 'style' );
    let responsiveCss = '';
    style.type = 'text/css';
    if(this.props.target == 'title'){
    //add responsive styling
      responsiveCss += '@media only screen and (max-width: 768px) {';
      responsiveCss += '.gx-image-box-text h2{';
      if(typeof fontSizeTitleTabletValue !== 'undefined'){
      responsiveCss += 'font-size: ' + fontSizeTitleTabletValue + fontSizeTitleUnitValue + ' !important;';
      }
      if(typeof lineHeightTitleTabletValue !== 'undefined'){
        responsiveCss += 'line-height: ' + lineHeightTitleTabletValue + lineHeightTitleUnitValue + ' !important;';
      }
      if(typeof letterSpacingTabletValue !== 'undefined'){
        responsiveCss += 'letter-spacing: ' + letterSpacingTitleTabletValue + this.props.attributes.letterSpacingTitleUnit + ' !important;';
      }
      if(typeof fontWeightTabletValue !== 'undefined'){
        responsiveCss += 'font-weight: ' + fontWeightTabletValue + ' !important;';
      }
      if(typeof textTransformTabletValue !== 'undefined'){
        responsiveCss += 'text-transform: ' + textTransformTabletValue + ' !important;';
      }
      if(typeof fontStyleTabletValue !== 'undefined'){
        responsiveCss += 'font-style: ' + fontStyleTabletValue + ' !important;';
      }
      if(typeof textDecorationTabletValue !== 'undefined'){
        responsiveCss += 'text-decoration: ' + textDecorationTabletValue + ' !important;';
      }
      responsiveCss += '}';
      responsiveCss += '}';

      responsiveCss += '@media only screen and (max-width: 514px) {';
      responsiveCss += '.gx-image-box-text h2{';
      if(typeof fontSizeTitleMobileValue !== 'undefined'){
      responsiveCss += 'font-size: ' + fontSizeTitleMobileValue + fontSizeTitleUnitValue + ' !important;';
      }
      if(typeof lineHeightTitleMobileValue !== 'undefined'){
        responsiveCss += 'line-height: ' + lineHeightTitleMobileValue + lineHeightTitleUnitValue + ' !important;';
      }
      if(typeof letterSpacingMobileValue !== 'undefined'){
        responsiveCss += 'letter-spacing: ' + letterSpacingTitleMobileValue + this.props.attributes.letterSpacingTitleUnit + ' !important;';
      }
      if(typeof fontWeightMobileValue !== 'undefined'){
        responsiveCss += 'font-weight: ' + fontWeightMobileValue + ' !important;';
      }
      if(typeof textTransformMobileValue !== 'undefined'){
        responsiveCss += 'text-transform:  ' + textTransformMobileValue + ' !important;';
      }
      if(typeof fontStyleMobileValue !== 'undefined'){
        responsiveCss += 'font-style: ' + fontStyleMobileValue + ' !important;';
      }
      if(typeof textDecorationMobileValue !== 'undefined'){
        responsiveCss += 'text-decoration: ' + textDecorationMobileValue + ' !important;';
      }
      responsiveCss += '}';
      responsiveCss += '}';
    }
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
      fontStyle
		} = this.props;
    const {
      deviceTypography,
      letterSpacingTitle,
      fontSizeTitleUnit,
      fontSizeTitle,
      fontSizeTitleMobile,
      fontSizeTitleTablet,
      fontSizeTitleDesktop,
      lineHeightTitleUnit,
      lineHeightTitleDesktop,
      lineHeightTitleTablet,
      lineHeightTitleMobile,
      lineHeightTitle,
     } = this.props.attributes;

    // When device is changed
    const onChangeDevice = (value) => {
      this.props.setAttributes({ deviceTypography: value });
      this.saveMeta();
    }

    // When font size unit is changed
    const onChangeFontSizeUnit = (value) => {
      this.props.setAttributes({ ['fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1) + 'Unit']:value });
      if(value == 'px'){
        eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "px"');
      }else if(value == 'em'){
        eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "em"');
      }else if(value == 'vw'){
        eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "vw"');
      }else{
        eval('fontSize' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "%"');
      }

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
      if(value == 'px'){
        eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "px"');
      }else if(value == 'em'){
        eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "em"');
      }else if(value == 'vw'){
        eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "vw"');
      }else{
        eval('lineHeight' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1).toString() + 'UnitValue' + '= "%"');
      }
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
        label="Family"
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
     label="Size"
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
     label="Line Height"
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
     label="Letter Spacing"
     className={'gx-with-unit-control'}
     value={eval('letterSpacing' + this.props.target.charAt(0).toUpperCase() + this.props.target.slice(1))}
     onChange={ onChangeLetterSpacing }
     min={ 0 }
     step={0.1}
     allowReset = {true}
               />
     <Divider/>
     <SelectControl
        label="Weight"
        className="gx-title-typography-setting"
        value={ fontWeightTitle }
        options={ [
          { label: 'Thin (Hairline)', value: 100 },
          { label: 'Extra Light (Ultra Light)', value: 200 },
          { label: 'Light', value: 300 },
          { label: 'Normal (Regular)', value: 400 },
          { label: 'Medium', value: 500 },
          { label: 'Semi Bold (Demi Bold)', value: 600 },
          { label: 'Bold', value: 700 },
          { label: 'Extra Bold (Ultra Bold)', value: 800 },
          { label: 'Black (Heavy)', value: 900 },
          { label: 'Extra Black (Ultra Black)', value: 950 },
        ] }
        onChange={ onChangeWeight }
     />
     <SelectControl
        label="Transform"
        className="gx-title-typography-setting"
        value={ textTransformTitle }
        options={ [
          { label: 'Default', value: 'none' },
          { label: 'Capitilize', value: 'capitalize' },
          { label: 'Uppercase', value: 'uppercase' },
          { label: 'Lowercase', value: 'lowercase' },
          { label: 'Full Width', value: 'full-width' },
          { label: 'Full Size Kana', value: 'full-size-kana' },
        ] }
        onChange={ onChangeTextTransform }
     />
     <SelectControl
        label="Style"
        className="gx-title-typography-setting"
        value={ fontStyle }
        options={ [
          { label: 'Default', value: 'normal' },
          { label: 'Italic', value: 'italic' },
          { label: 'Oblique', value: 'oblique' },
          { label: 'Oblique (40 deg)', value: 'oblique 40deg' },
        ] }
        onChange={ onChangeFontStyle }
     />
     <SelectControl
        label="Decoration"
        className="gx-title-typography-setting"
        value={ textDecorationTitle }
        options={ [
          { label: 'Default', value: 'none' },
          { label: 'Overline', value: 'overline' },
          { label: 'Line Through ', value: 'line-through' },
          { label: 'Underline ', value: 'underline' },
          { label: 'Underline Overline ', value: 'underline overline' },
        ] }
        onChange={ onChangeTextDecoration }
     />
     </div>
    )
  }
}
export default withInstanceId( Typography );
