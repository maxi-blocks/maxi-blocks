const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

export const dividerHeightAttributes = {
  dividerHeight:{
    type: 'number',
    default: 0
  },
  dividerHeightUnit:{
    type: 'string',
    default: 'px'
  },
}

export const DividerHeight = ( props ) => {
  const {
    dividerHeightUnit = props.attributes.dividerHeightUnit,
    dividerHeight = props.attributes.dividerHeight,
    isVertical = props.attributes.isVertical,
    dividerThickness = props.attributes.dividerThickness,
    setAttributes,
  } = props;

  const onChangeDividerHeightValue = (value) => {
    setAttributes({dividerHeightUnit : value});
    this.dividerHeightUnitValue = value;
    this.buildDivider;
  }

  const onChangeDividerHeight = ( value ) => {
    if(isVertical){
     setAttributes({ dividerHeight: value, dividerWidth: 1 });
     this.dividerHeightValue = value;
     this.dividerWidthValue = 1;
    }else{
     this.dividerThicknessValue = value;
     setAttributes({dividerThickness: value})
    }
    this.buildDivider;
  }

  return (
    <div>
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
    </div>
  )
}
