const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

import { buildDivider } from '../../divider/index';

export const dividerWidthAttributes = {
  dividerWidthUnit:{
    type: 'string',
    default: 'px'
  },
  dividerWidth:{
    type: 'number',
    default: 0
  },
}

export const DividerWidth = ( props ) => {
  const {
    dividerWidthUnit = props.attributes.dividerWidthUnit,
    dividerWidth = props.attributes.dividerWidth,
    isVertical = props.attributes.isVertical,
    dividerThickness = props.attributes.dividerThickness,
    buildDivider = props.buildDivider,
    setAttributes,
  } = props;

   const onChangeDividerWidthUnit = (value) => {
      setAttributes({ dividerWidthUnit: value });
      this.dividerWidthUnitValue = value;
      props.buildDivider();
   }

   const onChangeDividerWidth = ( value ) => {
     if(isVertical){
       setAttributes({dividerThickness: value});
       this.dividerThicknessValue = value;
     }else{
       setAttributes({ dividerWidth: value, dividerHeight: 0 });
       this.dividerWidthValue = value;
       this.dividerHeightValue = 0;
     }
     props.buildDivider();
   }

  return (
    <div>
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
    </div>
  )
}
