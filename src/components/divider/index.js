const { __ } = wp.i18n;
import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/compose';

const {
  InspectorControls,
  PanelColorSettings,
  URLInput,
  RichText,
  MediaUpload,
} = wp.blockEditor;

const {
  PanelBody,
  Button,
  RangeControl,
  RadioControl,
  CheckboxControl,
  SelectControl,
  ToggleControl
} = wp.components;

export const dividerAttributes = {
  dividerWidth:{
    type: 'number',
    default: 0
  },
  dividerHeight:{
    type: 'number',
    default: 0
  },
  dividerWidthUnit:{
    type: 'string',
    default: 'px'
  },
  dividerColor:{
    type: 'string',
    default: '#00b2ff'
  },
  dividerHeightUnit:{
    type: 'string',
    default: 'px'
  },
  dividerOrder:{
    type: 'string',
  },
  dividerThicknessUnit:{
    type: 'string',
    default: 'px'
  },
  dividerThickness:{
    type: 'number',
    default: 1
  },
  isVertical:{
    type: 'boolean',
    default: false
  },
  isHidden:{
    type: 'boolean',
    default: false
  },
  isRounded:{
    type: 'boolean',
    default: false
  },
  isMultiple:{
    type: 'boolean',
    default: false
  },
  dividerAlignment:{
    type: 'string',
    default: 'auto'
  },
}

// Declaring placeholder variables
let dividerColorValue;
let dividerAlignmentValue;
let dividerHeightValue;
let dividerWidthValue;
let dividerHeightUnitValue;
let dividerWidthUnitValue;
let dividerThicknessValue;
let dividerThicknessUnitValue;

class Divider extends Component {
  constructor( props ) {
		super( ...arguments );
  }


  render() {
    const {
			help,
			instanceId,
			label = __( 'Margin', 'gx' ),
			type = 'margin',
      setAttributes,
		} = this.props;
    const {
      dividerColor,
      dividerWidth,
      dividerHeight,
      dividerWidthUnit,
      dividerHeightUnit,
      dividerOrder,
      dividerAlignment,
      dividerThickness,
      dividerThicknessUnit,
      isVertical,
      isHidden,
      isRounded,
      isMultiple,
      isBehindTheSubtitle,
      isPreappendedToSubtitle,
      isAppendedToSubtitle,
      subtitleTextAlign
     } = this.props.attributes;
     dividerColorValue = this.props.attributes.dividerColor;
     dividerAlignmentValue = this.props.attributes.dividerAlignment;
     dividerHeightValue = this.props.attributes.dividerHeight;
     dividerWidthValue = this.props.attributes.dividerWidth;
     dividerHeightUnitValue = this.props.attributes.dividerHeightUnit;
     dividerWidthUnitValue = this.props.attributes.dividerWidthUnit;
     dividerThicknessValue = this.props.attributes.dividerThickness;
     dividerThicknessUnitValue = this.props.attributes.dividerThicknessUnit;


     const dividerStyles =  {
         border: dividerColor ? '1px solid ' + dividerColor : '1px solid rgb(152, 152, 152)',
         margin: dividerAlignment,
         borderColor: dividerColor,
         height: dividerHeight ? dividerHeight + dividerHeightUnit : undefined,
         width: dividerWidth ? dividerWidth + dividerWidthUnit : undefined,
         borderWidth: dividerThickness ? dividerThickness + dividerThicknessUnit : undefined,
         display: isHidden ? 'none' : undefined,
         borderRadius: isRounded ? '2rem' : undefined,
         position: isBehindTheSubtitle ? 'absolute' : undefined,
         top: isBehindTheSubtitle ? '1.5rem' : undefined,
         left: isBehindTheSubtitle ? dividerAlignment == 'auto' ? '0' : dividerAlignment == '0 auto 0 0' ? '0' : undefined  : undefined,
         right: isBehindTheSubtitle ? dividerAlignment == 'auto' ? '0' : dividerAlignment == '0 0 0 auto' ? '0' : undefined : undefined,
         zIndex: isBehindTheSubtitle ? -1 : undefined,
     };

     const dividerWrapperStyles = {
       order: dividerOrder,
     }

     const onChangeDirection = (value) =>{
       setAttributes({isVertical: value});
       if(value){
         setAttributes({ dividerHeight: dividerWidth, dividerWidth: 1 });
       }else{
         setAttributes({ dividerWidth: dividerHeight, dividerHeight: 0 });
       }
       buildDivider();
     }

     const onChangeDividerWidth = ( value ) => {
       if(isVertical){
         setAttributes({dividerThickness: value});
         dividerThicknessValue = value;
       }else{
         setAttributes({ dividerWidth: value, dividerHeight: 0 });
         dividerWidthValue = value;
         dividerHeightValue = 0;
       }
       buildDivider();
     }

     const onChangeDividerHeight = ( value ) => {
       if(isVertical){
        setAttributes({ dividerHeight: value, dividerWidth: 1 });
        dividerHeightValue = value;
        dividerWidthValue = 1;
       }else{
        dividerThicknessValue = value;
        setAttributes({dividerThickness: value})
       }
       buildDivider();
     }

     const buildDivider = () => {
       if(isMultiple){
         let div = `<div class="test"
         style="border:${dividerColorValue ? '1px solid ' + dividerColorValue : '1px solid rgb(152,152,152)'};
         margin:${dividerAlignmentValue};
         border-color:${dividerColorValue};
         height:${dividerHeightValue ? dividerHeightValue + dividerHeightUnitValue : ''};
         width:${dividerWidthUnitValue ? dividerWidthValue != 0 ? dividerWidthValue + dividerWidthUnitValue : '' : ''};
         border-width:${dividerThicknessValue ? dividerThicknessValue + dividerThicknessUnitValue : ''};
         display:${isHidden ? 'none' : ''};
         border-radius:${isRounded ? '2rem' : ''};
         ">`;
         setAttributes({additionalDivider: div });
         return div;
      }
     }
     const onChangeAdditional = (value) => {
      setAttributes({isMultiple: value});
      if(value){
        buildDivider();
      }else{
        setAttributes({additionalDivider: ''});
      }
     }

     const onChangeDividerColor = (value) => {
        setAttributes({ dividerColor: value });
        dividerColorValue = value;
        buildDivider();
     }

     const onChangeDividerAlignment = (value) => {
        setAttributes({ dividerAlignment: value });
        dividerAlignmentValue = value;
        buildDivider();
     }

     const onChangeDividerHeightValue = (value) => {
       setAttributes({dividerHeightUnit : value});
       dividerHeightUnitValue = value;
       buildDivider();
     }

     const onChangeDividerWidthUnit = (value) => {
        setAttributes({ dividerWidthUnit: value });
        dividerWidthUnitValue = value;
        buildDivider();
     }

     const onChangeDividerPosition = (value) => {
       setAttributes({ dividerOrder: value });
       if(value !== 'behind-subtitle'){
         setAttributes({ isBehindTheSubtitle: false });
         setAttributes({isAppendedToSubtitle: false});
         setAttributes({isPreappendedToSubtitle: false});
       }
       if(value == 'preappend-subtitle'){
         setAttributes({ dividerAlignment: '0 auto 0 0' });
         setAttributes({ isBehindTheSubtitle: true });
         setAttributes({isAppendedToSubtitle: false});
         setAttributes({isPreappendedToSubtitle: true});
         setAttributes({subtitleBackgroundColor: 'white'});
       }
       if(value == 'appended-subtitle'){
         setAttributes({ dividerAlignment: '0 0 0 auto' });
         setAttributes({ isBehindTheSubtitle: true });
         setAttributes({isPreappendedToSubtitle: false});
         setAttributes({isAppendedToSubtitle: true});
         setAttributes({subtitleBackgroundColor: 'white'});
       }

       if(value == 'behind-subtitle'){
         setAttributes({ isBehindTheSubtitle: true });
         setAttributes({subtitleBackgroundColor: 'white'});
       }
     }


    return (
      <div
      style={dividerWrapperStyles}
      >
      <InspectorControls>
      <ToggleControl
          label={__('Hide Divider', 'gutenberg-extra')}
          id='gx-block-style'
          checked={isHidden}
          onChange={(value) => setAttributes({isHidden: value})}
      />
      <ToggleControl
          label={__('Vertical Divider', 'gutenberg-extra')}
          id='gx-block-style'
          checked={isVertical}
          onChange={onChangeDirection}
      />
      <ToggleControl
          label={__('Rounded Divider', 'gutenberg-extra')}
          id='gx-block-style'
          checked={isRounded}
          onChange={(value) => setAttributes({isRounded: value})}
      />
      <ToggleControl
          label={__('Additional Divider', 'gutenberg-extra')}
          id='gx-block-style'
          checked={isMultiple}
          onChange={ onChangeAdditional }
      />
      <SelectControl
          label={__('Divider Alignment', 'gutenberg-extra')}
          className="gx-block-style"
          value={dividerAlignment}
          options={[
              { label: __('Left'), value: '0 auto 0 0' },
              { label: __('Center'), value: 'auto' },
              { label: __('Right'), value: '0 0 0 auto' },
          ]}
          onChange={ onChangeDividerAlignment }
      />
      <SelectControl
          label={__('Divider Position', 'gutenberg-extra')}
          className="gx-block-style"
          value={dividerOrder}
          options={[
              { label: __('After Title'), value: 1 },
              { label: __('Before Title'), value: 0 },
              { label: __('Before Subtitle'), value: -1 },
              { label: __('After Description'), value: 4 },
              { label: __('Behind Subtitle'), value: 'behind-subtitle' },
              { label: __('Preappended to Subtitle'), value: 'preappend-subtitle' },
              { label: __('Appended to Subtitle'), value: 'appended-subtitle' },
          ]}
          onChange={ onChangeDividerPosition }
      />
        <RadioControl
          className={'gx-unit-control'}
          selected={ dividerWidthUnit }
          options={ [
              { label: 'PX', value: 'px' },
              { label: 'EM', value: 'em' },
              { label: 'VW', value: 'vw' },
              { label: '%', value: '%' },
          ] }
          onChange={ onChangeDividerWidthUnit }
        />
        <RangeControl
          label={__('Divider Width', 'gutenberg-extra')}
          className={'gx-with-unit-control'}
          value={isVertical ? dividerThickness : dividerWidth}
          onChange={ onChangeDividerWidth }
          min={ 0 }
          allowReset = {true}
          initialPosition = { 0 }
        />
        <RadioControl
          className={'gx-unit-control'}
          selected={ dividerHeightUnit }
          options={ [
              { label: 'PX', value: 'px' },
              { label: 'EM', value: 'em' },
              { label: 'VW', value: 'vw' },
              { label: '%', value: '%' },
          ] }
          onChange={ onChangeDividerHeightValue }
        />
        <RangeControl
          label={__('Divider Height', 'gutenberg-extra')}
          className={'gx-with-unit-control'}
          value={isVertical ? dividerHeight : dividerThickness}
          onChange={ onChangeDividerHeight }
          min={ 0 }
          allowReset = {true}
          initialPosition = { 0 }
        />

      <PanelColorSettings
        title={__('Divider Colour', 'gutenberg-extra' )}
        colorSettings={[
          {
            value: dividerColor,
            onChange: {onChangeDividerColor},
            label: __('Divider Colour', 'gutenberg-extra' ),
          },
        ]}
      />
      </InspectorControls>
      <div
      className={'gx-divider'}
      style={dividerStyles}
      />
      </div>
    )
  }
}
export default Divider;
