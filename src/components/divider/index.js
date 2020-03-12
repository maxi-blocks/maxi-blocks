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
  dividerWidthUnit:{
    type: 'string',
    default: 'px'
  },
  dividerColor:{
    type: 'string'
  },
  dividerHeightUnit:{
    type: 'string',
    default: 'px'
  },
  dividerOrder:{
    type: 'number',
    default: 0
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
  }
}

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
      dividerThickness,
      dividerThicknessUnit,
      isVertical,
      isHidden
     } = this.props.attributes;

     const dividerStyles =  {
         border: '1px solid rgb(152, 152, 152)',
         margin: 'auto',
         borderColor: dividerColor,
         height: dividerHeight ? dividerHeight + dividerHeightUnit : undefined,
         width: dividerWidth ? dividerWidth + dividerWidthUnit : undefined,
         borderWidth: dividerThickness ? dividerThickness + dividerThicknessUnit : undefined,
         display: isHidden ? 'none' : undefined
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
     }

     const onChangeDividerWidth = ( value ) => {
       if(isVertical){
         setAttributes({dividerThickness: value});
       }else{
         setAttributes({ dividerWidth: value, dividerHeight: 0 });
       }
     }

     const onChangeDividerHeight = ( value ) => {
       if(isVertical){
        setAttributes({ dividerHeight: value, dividerWidth: 1 });
       }else{
        setAttributes({dividerThickness: value})
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
      <SelectControl
          label={__('Divider Position', 'gutenberg-extra')}
          className="gx-block-style"
          value={dividerOrder}
          options={[
              { label: __('After Title'), value: 1 },
              { label: __('Before Title'), value: 0 },
              { label: __('Before Subtitle'), value: -1 },
              { label: __('After Description'), value: 4 },
          ]}
          onChange={(value) => setAttributes({ dividerOrder: value })}
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
          onChange={ ( value ) => setAttributes({ dividerWidthUnit: value }) }
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
          onChange={ ( value ) => setAttributes({ dividerHeightUnit: value }) }
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
            onChange: (value) => setAttributes({ dividerColor: value }),
            label: __('Divider Colour', 'gutenberg-extra' ),
          },
        ]}
      />
      </InspectorControls>
      <div
      style={dividerStyles}
      />
      </div>
    )
  }
}
export default Divider;
